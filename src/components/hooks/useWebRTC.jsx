import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../../socket";
import useS3MultipartRecorder from "./useS3MultipartRecorder";
import useCaseStore from "../../store/Case/useCaseStore";
import useAgentStore from "../../store/Agent/useAgentStore";

export default function useWebRTC({ caseId, role, agentId }) {
    const {
        getCaseDetails,
        caseDetails,
        updateAgentDevice,
        setCustomerDevice,
        sessionExpired,
        setSessionExpired,
        agentToken,
        customerDevice,
        connectionError,
        setConnectionError,
    } = useCaseStore();
    const { expiresAt } = caseDetails;
    console.log(expiresAt, "getCaseDetails");

    const { fetchTurnCreds } = useAgentStore();
    console.log(customerDevice, "customerDevice");
    const customerDeviceRef = useRef(customerDevice);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const pendingCandidatesRef = useRef([]);

    const pcRef = useRef(null);
    const streamRef = useRef(null);
    const socketRef = useRef(socket);
    const recordingStartedRef = useRef(false);
    const screenRef = useRef(null);

    // Add these refs for proper bidirectional handling
    const remoteStreamRef = useRef(null);
    const isNegotiatingRef = useRef(false);

    const [ready, setReady] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [connected, setConnected] = useState(false);
    const [peerStatus, setPeerStatus] = useState("waiting");
    //const [connectionError, setConnectionError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState({
        media: false,
        location: false,
    });
    const lastLocationRef = useRef(null);

    const [iceConfig, setIceConfig] = useState(null);

    useEffect(() => {
        const loadTurnCreds = async () => {
            try {
                const res = await fetchTurnCreds();

                setIceConfig({
                    iceTransportPolicy: "relay",
                    iceCandidatePoolSize: 10,
                    iceServers: res?.data?.data?.iceServers || [],
                    // [
                    //     { urls: "stun:65.1.16.235:3478" },
                    //     {
                    //         urls: [
                    //             "turn:65.1.16.235:3478?transport=udp",
                    //             "turn:65.1.16.235:3478?transport=tcp",
                    //         ],
                    //         // username: res.data.data.username,
                    //         // credential: res.data.data.credential,
                    //         username: "test",
                    //         credential: "test123",
                    //     },
                    // ],
                });
            } catch (err) {
                console.error("Failed to fetch TURN credentials", err);
            }
        };

        loadTurnCreds();
    }, []);

    useEffect(() => {
        customerDeviceRef.current = customerDevice;
    }, [customerDevice]);

    const { startRecording, stopRecording } = useS3MultipartRecorder(caseId, expiresAt);

    /* ------------------------------------------------------
       INITIALIZE MEDIA + PEER CONNECTION
    ------------------------------------------------------ */
    const createRecordingStream = async () => {
        const remoteStream = remoteStreamRef.current;
        const localStream = streamRef.current;

        if (!remoteStream) return null;

        /* -------------------------------------------------
           1. CREATE VIDEO MERGE CANVAS
        ------------------------------------------------- */

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const remoteVideo = document.createElement("video");
        const localVideo = document.createElement("video");

        remoteVideo.srcObject = remoteStream;
        localVideo.srcObject = localStream;

        remoteVideo.muted = true;
        localVideo.muted = true;

        //TODO: If we handle the error while play remote/local video, agent should refresh the page and start the call again.
        await remoteVideo.play().catch(() => {});
        await localVideo.play().catch(() => {});

        //This width & height should be same as actual video's resolution.
        const width = 640;
        const height = 480;

        canvas.width = width;
        canvas.height = height;

        /* -------------------------------------------------
           2. DRAW LOOP (Merge + Watermark)
        ------------------------------------------------- */

        function drawFrame() {
            ctx.clearRect(0, 0, width, height);

            /* ---------------------------------
               1. Remote Fullscreen
            --------------------------------- */
            ctx.drawImage(remoteVideo, 0, 0, width, height);

            const bottomMargin = 40;
            const sideMargin = 20;

            /* ---------------------------------
               2. Watermark (Rounded Box)
            --------------------------------- */

            const watermarkWidth = 420;
            const watermarkHeight = 100;
            const watermarkX = sideMargin;
            const watermarkY = height - watermarkHeight - bottomMargin;
            const watermarkRadius = 16;

            ctx.save();

            // Rounded watermark background
            ctx.beginPath();
            ctx.moveTo(watermarkX + watermarkRadius, watermarkY);
            ctx.lineTo(watermarkX + watermarkWidth - watermarkRadius, watermarkY);
            ctx.quadraticCurveTo(
                watermarkX + watermarkWidth,
                watermarkY,
                watermarkX + watermarkWidth,
                watermarkY + watermarkRadius
            );
            ctx.lineTo(watermarkX + watermarkWidth, watermarkY + watermarkHeight - watermarkRadius);
            ctx.quadraticCurveTo(
                watermarkX + watermarkWidth,
                watermarkY + watermarkHeight,
                watermarkX + watermarkWidth - watermarkRadius,
                watermarkY + watermarkHeight
            );
            ctx.lineTo(watermarkX + watermarkRadius, watermarkY + watermarkHeight);
            ctx.quadraticCurveTo(
                watermarkX,
                watermarkY + watermarkHeight,
                watermarkX,
                watermarkY + watermarkHeight - watermarkRadius
            );
            ctx.lineTo(watermarkX, watermarkY + watermarkRadius);
            ctx.quadraticCurveTo(watermarkX, watermarkY, watermarkX + watermarkRadius, watermarkY);
            ctx.closePath();

            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
            ctx.fill();

            ctx.fillStyle = "#f1f3f4";
            ctx.font = "14px 'Segoe UI', Roboto, system-ui";

            const now = new Date().toISOString();
            const device = customerDeviceRef.current;
            const lat = device?.gpsLocation?.lat ?? "N/A";
            const lng = device?.gpsLocation?.lng ?? "N/A";

            ctx.fillText(`UTC Time : ${now}`, watermarkX + 20, watermarkY + 80);
            ctx.fillText(`Latitude : ${lat}`, watermarkX + 20, watermarkY + 30);
            ctx.fillText(`Longitude: ${lng}`, watermarkX + 20, watermarkY + 55);

            ctx.restore();

            /* ---------------------------------
               3. Local Video PiP (Edge Rounded)
            --------------------------------- */

            const smallWidth = 150;
            const smallHeight = 100;
            const pipX = width - smallWidth - sideMargin;
            const pipY = height - smallHeight - bottomMargin;
            const pipRadius = 18;

            ctx.save();

            // Proper rounded rectangle path
            ctx.beginPath();
            ctx.moveTo(pipX + pipRadius, pipY);
            ctx.lineTo(pipX + smallWidth - pipRadius, pipY);
            ctx.quadraticCurveTo(pipX + smallWidth, pipY, pipX + smallWidth, pipY + pipRadius);
            ctx.lineTo(pipX + smallWidth, pipY + smallHeight - pipRadius);
            ctx.quadraticCurveTo(
                pipX + smallWidth,
                pipY + smallHeight,
                pipX + smallWidth - pipRadius,
                pipY + smallHeight
            );
            ctx.lineTo(pipX + pipRadius, pipY + smallHeight);
            ctx.quadraticCurveTo(pipX, pipY + smallHeight, pipX, pipY + smallHeight - pipRadius);
            ctx.lineTo(pipX, pipY + pipRadius);
            ctx.quadraticCurveTo(pipX, pipY, pipX + pipRadius, pipY);
            ctx.closePath();
            ctx.clip();

            // Draw video inside rounded clip
            ctx.drawImage(localVideo, pipX, pipY, smallWidth, smallHeight);

            // Agent Tag INSIDE clipped area
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            ctx.fillRect(pipX, pipY + smallHeight - 28, smallWidth, 28);

            ctx.fillStyle = "#ffffff";
            ctx.font = "12px 'Segoe UI', Roboto, system-ui";
            ctx.fillText("Agent", pipX + 12, pipY + smallHeight - 8);

            ctx.restore();

            requestAnimationFrame(drawFrame);
        }

        drawFrame();

        const canvasStream = canvas.captureStream(30);

        /* -------------------------------------------------
           3. AUDIO MIXING (REMOTE + LOCAL MIC)
        ------------------------------------------------- */

        const audioContext = new AudioContext();

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        const destination = audioContext.createMediaStreamDestination();

        // Remote audio
        if (remoteStream.getAudioTracks().length) {
            const remoteSource = audioContext.createMediaStreamSource(remoteStream);
            remoteSource.connect(destination);
        }

        // Local mic
        if (localStream?.getAudioTracks().length) {
            const localSource = audioContext.createMediaStreamSource(localStream);
            localSource.connect(destination);
        }

        /* -------------------------------------------------
           4. FINAL RECORDING STREAM
        ------------------------------------------------- */

        const finalStream = new MediaStream();

        // Single merged video track
        canvasStream.getVideoTracks().forEach((track) => {
            finalStream.addTrack(track);
        });

        // Single mixed audio track
        destination.stream.getAudioTracks().forEach((track) => {
            finalStream.addTrack(track);
        });

        return finalStream;
    };

    const getLocation = () =>
        new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                return reject(new Error("Geolocation not supported"));
            }

            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                    }),
                (err) => reject(err),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });

    const getBatteryInfo = async () => {
        if ("getBattery" in navigator) {
            const battery = await navigator.getBattery();
            return {
                isCharging: battery.charging,
                level: Math.round(battery.level * 100),
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
            };
        }
        return null;
    };

    const getNetworkInfo = () => {
        const connection =
            navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
            };
        }
        return null;
    };

    useEffect(() => {
        if (!caseId || !agentToken) return;
        let isMounted = true;

        const initialize = async () => {
            try {
                // Get local media stream
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        channelCount: 1,
                        sampleRate: 48000,
                        sampleSize: 16,
                    },
                    video: {
                        facingMode: "user",
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 },
                    },
                });

                if (!isMounted) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                streamRef.current = stream;

                // Attach local video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play().catch(() => {});
                }

                getLocation()
                    .then(async (location) => {
                        updateAgentDevice(caseId, {
                            longitude: location.lng,
                            latitude: location.lat,
                            accuracy: location.accuracy,
                            network: getNetworkInfo(),
                            battery: await getBatteryInfo(),
                        });
                    })
                    .catch((err) => {
                        if (err.code === 1) {
                            setPermissionDenied({
                                location: true,
                            });
                            return;
                        }
                    });

                // Create Peer Connection
                const pc = new RTCPeerConnection(iceConfig);
                pcRef.current = pc;

                // CRITICAL: Add local tracks to peer connection
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });

                // Handle incoming remote tracks
                pc.ontrack = async (event) => {
                    if (!remoteStreamRef.current) {
                        remoteStreamRef.current = new MediaStream();
                    }

                    // Add track to remote stream
                    remoteStreamRef.current.addTrack(event.track);

                    // Update video elements with the complete remote stream
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStreamRef.current;
                        remoteVideoRef.current.play().catch(() => {});
                    }

                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = remoteStreamRef.current;
                        remoteAudioRef.current.play().catch(() => {});
                    }

                    // Start recording when we have both audio and video
                    if (
                        !recordingStartedRef.current &&
                        remoteStreamRef.current.getVideoTracks().length > 0 &&
                        remoteStreamRef.current.getAudioTracks().length > 0
                    ) {
                        recordingStartedRef.current = true;
                        // startRecording(remoteStreamRef.current);
                        const recordingStream = await createRecordingStream();
                        startRecording(recordingStream);
                        // if (caseId) {
                        //     const res = await getCaseDetails(caseId).then((data) => {
                        //     });

                        // }
                    }

                    setConnected(true);

                    setPeerStatus("connected");
                };

                // ICE candidates
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socketRef.current.emit("ice-candidate", {
                            candidate: event.candidate,
                        });
                    }
                };

                // Connection state monitoring
                pc.onconnectionstatechange = () => {
                    if (pc.connectionState === "connected") {
                        console.log("✅ Agent connected to peer");
                    }
                };

                setReady(true);
            } catch (err) {
                console.error("Media init failed:", err);
                if (err.name === "NotAllowedError") {
                    setPermissionDenied({ media: true });
                }
                setReady(false);
            }
        };

        void initialize();

        return () => {
            isMounted = false;

            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;

            pcRef.current?.close();
            pcRef.current = null;

            remoteStreamRef.current = null;
            recordingStartedRef.current = false;
        };
    }, [caseId, iceConfig, startRecording, getCaseDetails, caseDetails, agentToken]);

    useEffect(() => {
        if (!caseId || !agentToken) return;

        let intervalId;

        const fetchAndUpdateLocation = async () => {
            try {
                const location = await getLocation();

                const current = {
                    lat: location.lat,
                    lng: location.lng,
                };

                lastLocationRef.current = current;

                updateAgentDevice(
                    caseId,
                    {
                        latitude: location.lat,
                        longitude: location.lng,
                        accuracy: location.accuracy,
                        network: getNetworkInfo(),
                        battery: await getBatteryInfo(),
                    },
                    (res) => {
                        if (res.data?.data.errorCode === 410) {
                            clearInterval(intervalId);
                            return;
                        }
                    }
                );
            } catch (err) {
                if (err?.code === 1) {
                    setPermissionDenied({ location: true });
                }
            }
        };

        intervalId = setInterval(fetchAndUpdateLocation, 60_000);

        return () => {
            clearInterval(intervalId);
        };
    }, [caseId, agentToken]);

    /* ------------------------------------------------------
       END CALL
    ------------------------------------------------------ */
    const endCall = useCallback(
        (params = "") => {
            console.log("Ending call with params:", params);
            stopRecording(params);
            recordingStartedRef.current = false;

            socketRef.current.emit("call-disconnect");

            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;

            pcRef.current?.close();
            pcRef.current = null;

            remoteStreamRef.current = null;

            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
            if (localVideoRef.current) localVideoRef.current.srcObject = null;

            setConnected(false);
            setReady(false);
            setPeerStatus("ended");
        },
        [caseId, role, stopRecording]
    );

    useEffect(() => {
        if (sessionExpired) {
            endCall();
        }
    }, [sessionExpired, endCall]);

    const handleSessionExpired = () => {
        setSessionExpired(true);
    };

    const handleError = (err) => {
        console.error("Socket exception:", err);

        //if (err?.messageCode == "C1019") {
        // unauthorised access
        setConnectionError(err);
        // window.location.href = "/access-forbidden";
        //}
    };

    /* ------------------------------------------------------
       SOCKET EVENTS
    ------------------------------------------------------ */
    useEffect(() => {
        if (!caseId || !ready || !agentToken) return;

        const currentSocket = socketRef.current;

        const handleConnect = () => {
            currentSocket.emit("join-room");
            const timer = setTimeout(() => {
                currentSocket.emit("check-room");
                clearTimeout(timer);
            }, 100);
        };

        if (!currentSocket.connected) {
            currentSocket.auth = {
                token: agentToken,
            };
            currentSocket.connect();
        }

        const peerJoined = (peerDetail) => {
            if (peerDetail?.role === "customer") {
                setPeerStatus("joined");
            }
        };

        const handleCustomerDevice = ({ deviceInfo = null }) => {
            if (deviceInfo) {
                setCustomerDevice(deviceInfo);
                return;
            }
        };

        // Handle answer from customer
        const handleAnswer = async ({ sdp }) => {
            if (!pcRef.current) return;

            const pc = pcRef.current;

            // Don't process answer if already connected
            if (pc.signalingState === "stable" && pc.connectionState === "connected") {
                return;
            }

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));

                // Apply queued ICE candidates
                for (const candidate of pendingCandidatesRef.current) {
                    try {
                        await pc.addIceCandidate(candidate);
                    } catch (err) {
                        console.warn("Error adding queued ICE candidate:", err);
                    }
                }
                pendingCandidatesRef.current = [];
            } catch (err) {
                console.error("Error setting remote answer:", err);
                // Try to recover by restarting the connection
                if (err.toString().includes("InvalidStateError")) {
                    console.log("Attempting to recover from invalid state...");
                }
            }
        };

        // Handle ICE candidates
        const handleCandidate = async ({ candidate }) => {
            if (!candidate || !pcRef.current) return;

            const pc = pcRef.current;

            // Queue candidates if remote description isn't set
            if (!pc.remoteDescription || pc.remoteDescription.type === "") {
                pendingCandidatesRef.current.push(candidate);
                return;
            }

            try {
                await pc.addIceCandidate(candidate);
            } catch (err) {
                console.warn("addIceCandidate error:", err);
            }
        };

        const closePeerConnection = () => {
            setPeerStatus("Customer disconnected");

            // navigate(`case-bucket`);
            // endCall();
        };

        const callEnd = () => {
            setPeerStatus("Call disconnected");
            currentSocket.emit("check-room");
            // endCall();
        };

        const roomStatusHandle = (roomDetail) => {
            if (roomDetail?.customerPresent) {
                //startCall();
                setPeerStatus("joined");
            } else {
                setPeerStatus("Customer disconnected");
            }
        };
        currentSocket.on("connect", handleConnect);
        currentSocket.on("connect_error", handleError);
        currentSocket.on("exception", handleError);

        currentSocket.on("customer-answer", handleAnswer);
        currentSocket.on("customer-device", handleCustomerDevice);
        currentSocket.on("ice-candidate", handleCandidate);
        currentSocket.on("call-disconnect", callEnd);
        currentSocket.on("customer-disconnected", closePeerConnection);
        currentSocket.on("peer-joined", peerJoined);
        currentSocket.on("room-status", roomStatusHandle);
        currentSocket.on("session-expired", handleSessionExpired);

        return () => {
            currentSocket.off("connect", handleConnect);

            currentSocket.off("customer-answer", handleAnswer);
            currentSocket.off("customer-device", handleCustomerDevice);
            currentSocket.off("ice-candidate", handleCandidate);
            currentSocket.off("call-disconnect", callEnd);
            currentSocket.off("customer-disconnected", closePeerConnection);
            currentSocket.off("peer-joined", peerJoined);
            currentSocket.off("room-status", roomStatusHandle);
            currentSocket.off("session-expired", handleSessionExpired);
        };
    }, [caseId, role, ready, agentId, endCall, agentToken]);

    /* ------------------------------------------------------
       START CALL (CREATE OFFER)
    ------------------------------------------------------ */
    const startCall = useCallback(async () => {
        if (!ready || !pcRef.current) {
            return;
        }

        if (isNegotiatingRef.current) {
            return;
        }

        isNegotiatingRef.current = true;

        try {
            // Ensure audio is enabled
            const audioTrack = streamRef.current?.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = true;
            }

            // Create offer with proper options
            const offer = await pcRef.current.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
                voiceActivityDetection: true,
            });

            await pcRef.current.setLocalDescription(offer);

            // Notify server
            //socketRef.current.emit("peer-joined", { caseId, role });
            // socketRef.current.emit("offer", { caseId, sdp: offer });
            socketRef.current.emit("agent-call", { sdp: offer });
        } catch (err) {
            console.error("Start Call Error:", err);
        } finally {
            isNegotiatingRef.current = false;
        }
    }, [ready, caseId]);

    /* ------------------------------------------------------
       TOGGLE FUNCTIONS
    ------------------------------------------------------ */
    const toggleMic = useCallback(() => {
        const stream = streamRef.current;
        if (!stream) return false;

        const track = stream.getAudioTracks()[0];
        if (!track) return false;

        track.enabled = !track.enabled;
        setMicOn(track.enabled);

        return track.enabled;
    }, []);

    const toggleCamera = useCallback(() => {
        const stream = streamRef.current;
        if (!stream) return false;

        const track = stream.getVideoTracks()[0];
        if (!track) return false;

        track.enabled = !track.enabled;
        setCamOn(track.enabled);

        return track.enabled;
    }, []);

    const agentDisconnect = useCallback(() => {
        //  socketRef.current.emit("agent-disconnected", { caseId, role });
        endCall();
    }, [endCall]);

    /* ------------------------------------------------------
       RETURN HOOK API
    ------------------------------------------------------ */
    return {
        localVideoRef,
        remoteVideoRef,
        remoteAudioRef,
        ready,
        micOn,
        camOn,
        connected,
        peerStatus,
        startCall,
        toggleMic,
        toggleCamera,
        endCall,
        screenRef,
        agentDisconnect,
        permissionDenied,
        connectionError,
    };
}
