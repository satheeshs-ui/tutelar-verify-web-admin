import { useCallback, useRef, useState } from "react";
import constants from "../../utils/config";
import useLoginStore from "../../store/Login/useLoginStore";
import { useNavigate } from "react-router-dom";

const MIN_PART_SIZE = 5 * 1024 * 1024; // 5MB required by S3

export default function useS3MultipartRecorder(caseId, expiresAt) {
    const expiryTime = new Date(expiresAt).getTime();

    const currentTime = Date.now();

    console.log(!isNaN(expiryTime) && currentTime < expiryTime);

    const recorderRef = useRef(null);
    const navigate = useNavigate();

    // Stores blobs until they reach ≥5MB
    const pendingBufferRef = useRef([]);

    // Track accumulated buffer size
    const pendingSizeRef = useRef(0);

    // Multipart upload tracking
    const partNumberRef = useRef(1);
    const partsRef = useRef([]);
    const uploadInfoRef = useRef(null);

    // Stop flag (prevents uploads after stop)
    const stoppingRef = useRef(false);

    const [recording, setRecording] = useState(false);
    // const navigate = useNavigate();
    const token = useLoginStore.getState().loginDetails?.data?.accessToken;

    /* -------------------------------------------------------
       1. INIT MULTIPART UPLOAD
    ------------------------------------------------------- */
    const initMultipart = useCallback(async () => {
        const res = await fetch(`${constants.BASE_URL}/video-kyc/case/recording/create/${caseId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ caseId }),
        });

        if (!res.ok) throw new Error("Failed to init multipart upload");

        const data = await res.json();
        uploadInfoRef.current = data.data;
        console.log("Multipart upload initialized:", data.data);
    }, [caseId, token]);

    /* -------------------------------------------------------
       2. UPLOAD PART TO S3
    ------------------------------------------------------- */
    const uploadPart = useCallback(
        async (blob) => {
            const { uploadId, key } = uploadInfoRef.current;
            const partNumber = partNumberRef.current;

            // Get presigned URL
            const urlRes = await fetch(
                `${constants.BASE_URL}/video-kyc/case/recording/url?key=${encodeURIComponent(
                    key
                )}&uploadId=${uploadId}&partNumber=${partNumber}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const urlJson = await urlRes.json();
            const presignedUrl = urlJson.data.url;

            // Upload to S3
            const putRes = await fetch(presignedUrl, {
                method: "PUT",
                body: blob,
            });

            if (!putRes.ok) throw new Error("Part upload failed");

            const etag = putRes.headers.get("etag");

            // Save part metadata
            partsRef.current.push({
                ETag: etag,
                PartNumber: partNumber,
            });

            partNumberRef.current += 1;
        },
        [token]
    );

    /* -------------------------------------------------------
       3. FLUSH BUFFER WHEN ≥5MB OR ON STOP
    ------------------------------------------------------- */
    const flushBuffer = useCallback(
        async (isFinal = false) => {
            if (pendingSizeRef.current === 0) return;

            // If not final and buffer <5MB → don't upload yet
            if (!isFinal && pendingSizeRef.current < MIN_PART_SIZE) return;

            // Combine all pending chunks
            const mergedBlob = new Blob(pendingBufferRef.current, {
                type: "video/webm",
            });

            // Upload as a part
            await uploadPart(mergedBlob);

            // Reset buffers
            pendingBufferRef.current = [];
            pendingSizeRef.current = 0;
        },
        [uploadPart]
    );

    /* -------------------------------------------------------
       4. START RECORDING
    ------------------------------------------------------- */
    const startRecording = useCallback(
        async (stream) => {
            if (!stream) throw new Error("No stream to record");

            await initMultipart();

            stoppingRef.current = false;
            pendingBufferRef.current = [];
            pendingSizeRef.current = 0;
            partNumberRef.current = 1;
            partsRef.current = [];

            const recorder = new MediaRecorder(stream, {
                mimeType: "video/webm; codecs=vp8,opus",
            });

            recorderRef.current = recorder;
            setRecording(true);

            recorder.ondataavailable = async (event) => {
                if (stoppingRef.current) return;

                if (event.data && event.data.size > 0) {
                    pendingBufferRef.current.push(event.data);
                    pendingSizeRef.current += event.data.size;

                    // Flush if ≥5MB
                    await flushBuffer(false);
                }
            };

            recorder.onerror = (e) => {
                console.error("Recorder error:", e.error);
            };

            recorder.onstop = () => {
                setRecording(false);
            };

            // Small interval so chunks accumulate adaptively
            recorder.start(10000); // 10-second chunks
        },
        [initMultipart, flushBuffer]
    );

    /* -------------------------------------------------------
       5. STOP RECORDING & COMPLETE MULTIPART UPLOAD
    ------------------------------------------------------- */
    const stopRecording = useCallback(
        async (params = "") => {
            console.log("Ending call with  record:", params);

            try {
                stoppingRef.current = true;

                const recorder = recorderRef.current;
                if (recorder && recorder.state === "recording") {
                    recorder.stop();

                    await new Promise((resolve) => {
                        recorder.onstop = resolve;
                    });
                }

                // Final flush (even <5MB allowed)
                await flushBuffer(true);

                const { uploadId, key } = uploadInfoRef.current;

                // Sort parts (required by AWS)
                partsRef.current.sort((a, b) => a.PartNumber - b.PartNumber);

                // Complete multipart upload
                const completeRes = await fetch(
                    `${constants.BASE_URL}/video-kyc/case/recording/complete`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            uploadId,
                            key,
                            parts: partsRef.current,
                        }),
                    }
                );
                // if (!completeRes.ok) throw new Error("Failed to complete upload");
                recorderRef.current = null;
                pendingBufferRef.current = [];
                pendingSizeRef.current = 0;
                partsRef.current = [];
                uploadInfoRef.current = null;

                if (currentTime >= expiryTime) {
                    console.log("Expired");
                } else {
                    console.log("Not Expired");
                    if (params?.data?.missingFiles && params?.data?.missingFiles?.length > 0) {
                        // showFailure("Recording completed but some files are missing. Please contact support.");
                        navigate(`/case-bucket`);
                        return;
                    }
                    navigate(`/cases/cases-list/report/${caseId}`);
                }
                // if (!isNaN(expiryTime) && currentTime < expiryTime) {
                //     console.log("Not Expired");
                //     navigate(`/cases/cases-list/report/${caseId}`);
                // } else {
                //     console.log("Expired");
                // }
                // navigate(`/cases/cases-list/report/${caseId}`);
                if (!completeRes.ok) {
                    // navigate(`case-bucket`);
                    // throw new Error("Failed to complete upload");
                    return;
                }
            } catch (err) {
                console.error("stopRecording failed:", err);
                // navigate(`/cases/cases-list/report/${caseId}`);
                navigate(`/case-bucket`);
            }
        },
        [caseId, flushBuffer, token, currentTime, expiryTime]
    );

    /* -------------------------------------------------------
       HOOK API
    ------------------------------------------------------- */
    return {
        startRecording,
        stopRecording,
        recording,
        recorderRef,
    };
}

// import { useCallback, useRef, useState } from "react";
// import constants from "../../utils/config";
// import useLoginStore from "../../store/Login/useLoginStore";
// import { useNavigate } from "react-router-dom";
// import fixWebmDuration from "fix-webm-duration";

// const MIN_PART_SIZE = 5 * 1024 * 1024;

// export default function useS3MultipartRecorder(caseId, expiresAt) {
//     const expiryTime = new Date(expiresAt).getTime();

//     const currentTime = Date.now();
//     const recorderRef = useRef(null);
//     const navigate = useNavigate();

//     const fullChunksRef = useRef([]); // ✅ NEW (full video)

//     const partNumberRef = useRef(1);
//     const partsRef = useRef([]);
//     const uploadInfoRef = useRef(null);

//     const [recording, setRecording] = useState(false);
//     const token = useLoginStore.getState().loginDetails?.data?.accessToken;
// //  Stores blobs until they reach ≥5MB
//     const pendingBufferRef = useRef([]);
//  const stoppingRef = useRef(false);
//     // Track accumulated buffer size
//     const pendingSizeRef = useRef(0);
//     /* INIT */
//     const initMultipart = useCallback(async () => {
//         const res = await fetch(`${constants.BASE_URL}/video-kyc/case/recording/create/${caseId}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ caseId }),
//         });

//         const data = await res.json();
//         uploadInfoRef.current = data.data;
//         console.log("Multipart upload initialized:", data.data);
//     }, [caseId, token]);

//     /* UPLOAD PART (with retry) */
//     const uploadPart = useCallback(async (blob, partNumber, retry = 3) => {
//         try {
//             const { uploadId, key } = uploadInfoRef.current;

//             const urlRes = await fetch(
//                 `${constants.BASE_URL}/video-kyc/case/recording/url?key=${encodeURIComponent(
//                     key
//                 )}&uploadId=${uploadId}&partNumber=${partNumber}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             const { data } = await urlRes.json();

//             const putRes = await fetch(data.url, {
//                 method: "PUT",
//                 body: blob,
//             });

//             if (!putRes.ok) throw new Error("Upload failed");

//             const etag = putRes.headers.get("etag");

//             partsRef.current.push({
//                 ETag: etag,
//                 PartNumber: partNumber,
//             });

//         } catch (err) {
//             if (retry > 0) {
//                 console.log(`Retrying part ${partNumber}`);
//                 return uploadPart(blob, partNumber, retry - 1);
//             }
//             throw err;
//         }
//     }, [token]);

//     /* SPLIT + UPLOAD */
//     const uploadInParts = useCallback(async (blob) => {
//         let partNumber = 1;

//         for (let i = 0; i < blob.size; i += MIN_PART_SIZE) {
//             const part = blob.slice(i, i + MIN_PART_SIZE);
//             await uploadPart(part, partNumber);
//             partNumber++;
//         }
//     }, [uploadPart]);

//     /* START RECORDING */
//     const startRecording = useCallback(async (stream) => {
//           if (!stream) throw new Error("No stream to record");
//         await initMultipart();

//         fullChunksRef.current = [];
//         partsRef.current = [];
//         partNumberRef.current = 1;

//         const recorder = new MediaRecorder(stream, {
//             mimeType: "video/webm;codecs=vp8,opus",
//         });

//         recorderRef.current = recorder;
//         setRecording(true);

//         recorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 fullChunksRef.current.push(event.data); // ✅ FIX
//             }
//         };

//         recorder.onstop = async () => {
//             setRecording(false);

//             try {
//                 // ✅ FULL VIDEO
//                 const blob = new Blob(fullChunksRef.current, {
//                     type: "video/webm",
//                 });

//                 // ✅ FIX DURATION
//                 const fixedBlob = await fixWebmDuration(blob);

//                 // ✅ UPLOAD AFTER FIX
//                 await uploadInParts(fixedBlob);

//                 const { uploadId, key } = uploadInfoRef.current;

//                 partsRef.current.sort((a, b) => a.PartNumber - b.PartNumber);

//                 await fetch(`${constants.BASE_URL}/video-kyc/case/recording/complete`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify({
//                         uploadId,
//                         key,
//                         parts: partsRef.current,
//                     }),
//                 });

//                 navigate(`/cases/cases-list/report/${caseId}`);

//             } catch (err) {
//                 console.error("Upload failed:", err);
//                 navigate(`/case-bucket`);
//             }
//         };

//         // ❗ IMPORTANT CHANGE
//         recorder.start(); // ✅ NO timeslice
//     }, [initMultipart, uploadInParts, token, caseId]);

//     /* STOP */
//     const stopRecording = useCallback(
//         async (params = "") => {
//             console.log("Ending call with  record:", params);

//             try {
//                 stoppingRef.current = true;

//                 const recorder = recorderRef.current;
//                 if (recorder && recorder.state === "recording") {
//                     recorder.stop();

//                     await new Promise((resolve) => {
//                         recorder.onstop = resolve;
//                     });
//                 }

//                 // Final flush (even <5MB allowed)
//                 // await flushBuffer(true);

//                 // Sort parts (required by AWS)
//                 partsRef.current.sort((a, b) => a.PartNumber - b.PartNumber);

//                 // Complete multipart upload

//                 // if (!completeRes.ok) throw new Error("Failed to complete upload");
//                 recorderRef.current = null;
//                 pendingBufferRef.current = [];
//                 pendingSizeRef.current = 0;
//                 partsRef.current = [];
//                 uploadInfoRef.current = null;

//                 if (currentTime >= expiryTime) {
//                     console.log("Expired");
//                 } else {
//                     console.log("Not Expired");
//                     if (params?.data?.missingFiles && params?.data?.missingFiles?.length > 0) {
//                         // showFailure("Recording completed but some files are missing. Please contact support.");
//                         navigate(`/case-bucket`);
//                         return;
//                     }
//                     navigate(`/cases/cases-list/report/${caseId}`);
//                 }
//                 // if (!isNaN(expiryTime) && currentTime < expiryTime) {
//                 //     console.log("Not Expired");
//                 //     navigate(`/cases/cases-list/report/${caseId}`);
//                 // } else {
//                 //     console.log("Expired");
//                 // }
//                 // navigate(`/cases/cases-list/report/${caseId}`);

//             } catch (err) {
//                 console.error("stopRecording failed:", err);
//                 // navigate(`/cases/cases-list/report/${caseId}`);
//                 navigate(`/case-bucket`);
//             }
//         },
//         [caseId, token, expiryTime,navigate]
//     );

//     return {
//         startRecording,
//         stopRecording,
//         recording,
//         recorderRef,
//     };
// }

// import { useCallback, useRef, useState } from "react";
// import constants from "../../utils/config";
// import useLoginStore from "../../store/Login/useLoginStore";
// import { useNavigate } from "react-router-dom";
// import fixWebmDuration from "fix-webm-duration";

// const MIN_PART_SIZE = 5 * 1024 * 1024;

// export default function useS3MultipartRecorder(caseId, expiresAt) {
//     const expiryTime = new Date(expiresAt).getTime();

//     //     const currentTime = Date.now();
//     const recorderRef = useRef(null);
//     const navigate = useNavigate();

//     const fullChunksRef = useRef([]);

//     const partNumberRef = useRef(1);
//     const partsRef = useRef([]);
//     const uploadInfoRef = useRef(null);

//     const [recording, setRecording] = useState(false);
//     const token = useLoginStore.getState().loginDetails?.data?.accessToken;

//     /* INIT */
//     const initMultipart = useCallback(async () => {
//         const res = await fetch(`${constants.BASE_URL}/video-kyc/case/recording/create/${caseId}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ caseId }),
//         });

//         const data = await res.json();
//         uploadInfoRef.current = data.data;
//     }, [caseId, token]);

//     /* UPLOAD PART (with retry) */
//     const uploadPart = useCallback(
//         async (blob, partNumber, retry = 3) => {
//             try {
//                 const { uploadId, key } = uploadInfoRef.current;

//                 const urlRes = await fetch(
//                     `${constants.BASE_URL}/video-kyc/case/recording/url?key=${encodeURIComponent(
//                         key
//                     )}&uploadId=${uploadId}&partNumber=${partNumber}`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }
//                 );

//                 const { data } = await urlRes.json();
//                 console.log(`Uploading part ${partNumber} to S3...`);
//                 const putRes = await fetch(data.url, {
//                     method: "PUT",
//                     body: blob,
//                 });

//                 if (!putRes.ok) throw new Error("Upload failed");

//                 const etag = putRes.headers.get("etag");

//                 partsRef.current.push({
//                     ETag: etag,
//                     PartNumber: partNumber,
//                 });
//             } catch (err) {
//                 if (retry > 0) {
//                     console.log(`Retrying part ${partNumber}`);
//                     return uploadPart(blob, partNumber, retry - 1);
//                 }
//                 throw err;
//             }
//         },
//         [token]
//     );

//     /* SPLIT + UPLOAD */
//     const uploadInParts = useCallback(
//         async (blob) => {
//             let partNumber = 1;

//             for (let i = 0; i < blob.size; i += MIN_PART_SIZE) {
//                 const part = blob.slice(i, i + MIN_PART_SIZE);
//                 await uploadPart(part, partNumber);
//                 partNumber++;
//             }
//         },
//         [uploadPart]
//     );

//     const startRecording = useCallback(
//         async (stream) => {
//             await initMultipart();

//             fullChunksRef.current = [];
//             partsRef.current = [];
//             partNumberRef.current = 1;

//             const recorder = new MediaRecorder(stream, {
//                 mimeType: "video/webm;codecs=vp8,opus",
//             });

//             recorderRef.current = recorder;
//             setRecording(true);

//             recorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     fullChunksRef.current.push(event.data);
//                 }
//             };

//             recorder.onstop = async () => {
//                 setRecording(false);

//                 try {

//                     const blob = new Blob(fullChunksRef.current, {
//                         type: "video/webm",
//                     });

//                     const fixedBlob = await fixWebmDuration(blob);

//                     await uploadInParts(fixedBlob);

//                     const { uploadId, key } = uploadInfoRef.current;

//                     partsRef.current.sort((a, b) => a.PartNumber - b.PartNumber);

//                     await fetch(`${constants.BASE_URL}/video-kyc/case/recording/complete`, {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                         body: JSON.stringify({
//                             uploadId,
//                             key,
//                             parts: partsRef.current,
//                         }),
//                     });

//                     navigate(`/cases/cases-list/report/${caseId}`);
//                 } catch (err) {
//                     console.error("Upload failed:", err);
//                     navigate(`/case-bucket`);
//                 }
//             };

//             recorder.start(); // ✅ NO timeslice
//         },
//         [initMultipart, uploadInParts, token, caseId, navigate]
//     );

//     /* STOP */
//     const stopRecording = useCallback(
//         (params = "") => {
//             const recorder = recorderRef.current;
//             if (recorder && recorder.state === "recording") {
//                 recorder.stop();
//             }

//             if (currentTime >= expiryTime) {
//                 console.log("Expired");
//             } else {
//                 console.log("Not Expired");
//                 if (params?.data?.missingFiles && params?.data?.missingFiles?.length > 0) {
//                     // showFailure("Recording completed but some files are missing. Please contact support.");
//                     navigate(`/case-bucket`);
//                     return;
//                 }
//                 navigate(`/cases/cases-list/report/${caseId}`);
//             }
//         },
//         [caseId, navigate, expiryTime]
//     );

//     return {
//         startRecording,
//         stopRecording,
//         recording,
//         recorderRef,
//     };
// }
