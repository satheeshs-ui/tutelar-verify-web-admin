import { Camera, RotateCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ModalPopUp from "./ModalPopup";
import { useParams, useSearchParams } from "react-router-dom";
import { DeviceInfoCard } from "./DeviceInfoCard";
import NetworkSpeed from "./NetworkSpeed";
import useAgentStore from "../../store/Case/useCaseStore";
import ImageLoader from "./ImageLoader";
import { get } from "../../config/api/api.service";
import { removeUnderScore } from "../../utils";

const DOCUMENT_CONFIG = {
    PAN: { type: "PAN", side: "front" },
    AADHAR: { type: "AADHAR", side: "front" },
    AADHAR_BACK: { type: "AADHAR", side: "back" },
    SELFIE: { type: "SELFIE", side: null },
};

export default function DocumentVerificationScreen({
    getCaptureData,
    connected,
    getFileType,
    docs,
}) {
    const {
        getDocumentUpload,
        documentUpload,
        fetchCustomerDevice,
        customerDevice,
        agentToken,
        caseDetails,
    } = useAgentStore();
    const { entity } = caseDetails;

    const [open, setOpen] = useState(false);
    const [openUrl, setOpenUrl] = useState("");
    const { caseId } = useParams();
    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");

    const [docVerification, setDocVerification] = useState({});
    const [entityDocs, setEntityDocs] = useState([]);

    useEffect(() => {
        const fetchEntityDocs = async () => {
            try {
                const res = await get(
                    `video-kyc/entity-document/list?entityType=${entity}&sourceType=capture`
                );
                setEntityDocs(res?.data?.data?.[0]?.documents || []);
            } catch (err) {
                console.error(err);
            }
        };

        if (entity) fetchEntityDocs();
    }, [entity]);

    const [captureDocs, setCaptureDocs] = useState({
        pan_front: { file: null, status: "pending" },
        aadhar_front: { file: null, status: "pending" },
        aadhar_back: { file: null, status: "pending" },
        selfie_front: { file: null, status: "pending" },
    });

    const uploadedDocs = documentUpload?.documents?.filter((d) => d.sourceType === "upload") || [];

    const capturedDocsFromAPI = useMemo(
        () => documentUpload?.documents?.filter((d) => d.sourceType === "capture") || [],
        [documentUpload]
    );

    const dynamicCaptureData = useMemo(() => {
        const defaultDocs = [
            {
                label: "Face Match",
                mandatory: true,
                documentType: "SELFIE",
                documentSide: null,
            },
        ];

        const mergedDocs = [...defaultDocs, ...entityDocs];

        return mergedDocs.map((doc) => {
            const config = DOCUMENT_CONFIG[doc.documentType] || {
                type: doc.documentType,
                side: doc.side || null,
            };

            const key = getFileType(config?.type, config?.side);
            const expectedFileType = getFileType(config?.type, config?.side);

            const apiCaptureDoc = capturedDocsFromAPI.find((d) => d.fileType === expectedFileType);

            const localDoc = captureDocs[key];

            const file = localDoc?.file?.signedUrl || apiCaptureDoc?.signedUrl || null;

            return {
                label: doc.documentName || doc.label, // 🔥 handle both
                mandatory: doc.mandatory ?? true,
                documentType: config?.type,
                documentSide: config?.side,
                status: file ? "verified" : "pending",
                file,
            };
        });
    }, [entityDocs, captureDocs, capturedDocsFromAPI, getFileType]);

    useEffect(() => {
        if (caseId && agentToken) {
            getDocumentUpload(caseId);
            fetchCustomerDevice(caseId);
        }
    }, [caseId, agentToken, fetchCustomerDevice, getDocumentUpload]);

    useEffect(() => {
        let interval;

        const isVerificationComplete = (data) => {
            if (!data) return false;

            return Object.values(data).every((doc) => {
                const ocrOk = doc?.ocr && !doc?.ocr?.error;
                const identityOk = doc?.identity && !doc?.identity?.error;

                return ocrOk && identityOk;
            });
        };

        const fetchDocVerification = async () => {
            try {
                const res = await get(`video-kyc/document/list/${caseId}`);
                const newData = res?.data?.data || {};

                setDocVerification((prev) => {
                    const isSame = JSON.stringify(prev) === JSON.stringify(newData);

                    return isSame ? prev : newData;
                });

                if (isVerificationComplete(newData)) {
                    clearInterval(interval);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (caseId && agentToken) {
            fetchDocVerification();
            interval = setInterval(fetchDocVerification, 10000);
        }

        return () => clearInterval(interval);
    }, [caseId, agentToken]);

    const VerificationCard = ({ title, data, loading }) => {
        if (loading) {
            return (
                <div className="flex-1 border border-[#CDD0D1] rounded-xl p-4 bg-gray-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-xs text-gray-500">Processing...</p>
                    </div>
                </div>
            );
        }

        if (data?.error) {
            return (
                <div className="flex-1 border border-red-200 rounded-xl p-4 bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500 text-sm font-semibold">
                            Verification Failed
                        </span>
                    </div>

                    <p className="text-xs text-red-600">
                        {data.error.message || "Something went wrong"}
                    </p>
                </div>
            );
        }

        if (!data) return null;

        const entries = Object.entries(data);

        return (
            <div className="flex-1 border border-[#CDD0D1] rounded-xl p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="bg-[#F3E8FF] p-1 rounded">
                        <ImageLoader imageKey="FrameIcon" className="w-5 h-5" />
                    </div>
                    {title}
                </div>

                <div className="space-y-3 mt-3">
                    {entries.map(([key, value]) => {
                        if (!value) return null;

                        return (
                            <div key={key}>
                                <p className="text-gray-500 text-xs capitalize mb-1">
                                    {key.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm font-medium">{String(value)}</p>
                                <div className="border-b border-[#CDD0D1] mt-2" />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const DocumentGuidelines = () => {
        const tips = [
            "Ensure the document is clearly visible and not blurred",
            "Capture the entire document within the frame",
            "Avoid glare or reflections on the document",
            "Use good lighting for better clarity",
            "Ensure details are readable (Name, Number, Photo)",
        ];

        return (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-[10px] p-4">
                <p className="text-[#1e3a8a] font-semibold text-[15px] mb-2">
                    Document Capture Guidelines
                </p>
                <ul className="list-disc pl-5 text-[#1e40af] text-[13px] space-y-1">
                    {tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const customerInfo = [
        {
            label: "Case ID",
            value: caseId || "-",
        },
        {
            label: "Name",
            value: name || "-",
        },
    ];
    const getActionKey = (type, side) => {
        return getFileType(type, side);
    };

    const handleCapture = async (documentType, documentSide, status) => {
        const action = getActionKey(documentType, documentSide);

        await getCaptureData(action, status, setCaptureDocs);
    };

    const SnapshotCard = ({ custom }) => {
        const isCaptured = !!custom.file;

        const handleDelete = () => {
            setCaptureDocs((prev) => ({
                ...prev,
                [getFileType(custom.documentType, custom.documentSide)]: {
                    ...prev[getFileType(custom.documentType, custom.documentSide)],
                    file: null,
                    status: "pending",
                },
            }));
        };

        return (
            <div
                className={`mb-4 rounded-2xl p-3 border transition-all min-w-[220px]!  ${
                    isCaptured
                        ? "bg-white border-gray-200 shadow-sm"
                        : "bg-[#f9fafb] border-gray-200"
                }`}
            >
                <div
                    className={`w-full h-[100px] rounded-xl flex items-center justify-center overflow-hidden mb-3 ${
                        isCaptured ? "bg-gray-100" : "bg-gray-200"
                    }`}
                    onClick={() => (custom?.file ? onOpenImage(custom?.file) : "")}
                >
                    {isCaptured ? (
                        <img src={custom.file} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-500 text-xs">
                            <Camera className="w-6 h-6 mb-1" />
                            Not Captured
                        </div>
                    )}
                </div>

                <p className="text-center text-sm text-gray-700 mb-3">
                    {custom.label}
                    {custom.mandatory && <span className="text-red-500 ml-1">*</span>}
                </p>

                {isCaptured ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                connected
                                    ? handleCapture(
                                          custom.documentType,
                                          custom.documentSide,
                                          custom.status
                                      )
                                    : ""
                            }
                            className="flex-1 bg-gray-200 text-gray-800 text-xs py-2 rounded-full flex items-center cursor-pointer justify-center gap-2 hover:bg-gray-300"
                        >
                            <ImageLoader imageKey="RetakeIcon" className="w-4 h-4" />
                            Retake
                        </button>

                        <button
                            onClick={handleDelete}
                            className="w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center"
                        >
                            <ImageLoader imageKey="deleteIcon" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() =>
                            connected
                                ? handleCapture(
                                      custom.documentType,
                                      custom.documentSide,
                                      custom.status
                                  )
                                : ""
                        }
                        disabled={!connected}
                        className="w-full bg-[linear-gradient(180deg,#18667C_0%,#135263_100%)] cursor-pointer text-white! text-sm py-2 rounded-full flex items-center justify-center gap-2"
                    >
                        <ImageLoader imageKey="CaptureIcon" className="w-4 h-4" />
                        Capture
                    </button>
                )}
            </div>
        );
    };

    const onClose = () => {
        setOpen(false);
        setOpenUrl("");
    };

    const onOpenImage = (url) => {
        setOpenUrl(url);
        setOpen(true);
    };

    const normalizeType = (type) => {
        if (!type) return "";
        if (type.includes("pan")) return "pan";
        if (type.includes("aadhar")) return "aadhar";
        return type.toLowerCase();
    };

    const getUploadedFileByDocType = (docType) => {
        return uploadedDocs.find((f) => normalizeType(f.fileType) === normalizeType(docType));
    };

    const Filecount = dynamicCaptureData?.filter((item) => item.file !== null).length;
    return (
        <div
            className={`w-full bg-white h-screen overflow-y-auto ${docs ? "" : "p-6"}  flex flex-col`}
        >
            {docs ? (
                <>
                    <div className="rounded-[10px] p-4 w-full! overflow-hidden!">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-primary p-2 rounded-xl">
                                    <ImageLoader imageKey="shieldIcon" className="w-6 h-6" />
                                </div>
                                <div className="mt-2!">
                                    <p className="text-[#111827] font-semibold text-[16px] ">
                                        KYC Documents Snapshots
                                    </p>
                                    <p className="text-[#2C3436] text-[12px]">
                                        AI-Powered Verification
                                    </p>
                                </div>
                            </div>
                            <div className="text-[16px] font-medium">
                                <span className="text-primary">{Filecount}</span>{" "}
                                <span className="text-[#90A1B9] ">
                                    / {dynamicCaptureData?.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-5! w-full! overflow-x-auto">
                            {dynamicCaptureData?.map((custom, index) => (
                                <SnapshotCard key={index} custom={custom} />
                            ))}
                        </div>
                    </div>
                    <ModalPopUp open={open} onCancel={onClose} width={500}>
                        <div className="mt-6 rounded-[5px] w-[300px] h-[200px] overflow-hidden">
                            <img src={openUrl} />
                        </div>
                    </ModalPopUp>
                </>
            ) : (
                <>
                    <NetworkSpeed />

                    <div>{DocumentGuidelines()}</div>
                    <div>
                        <DeviceInfoCard deviceInfo={customerDevice} mode="video-call" />
                    </div>
                    <div className="mb-4 bg-gray-50 rounded-[10px] mt-6  border border-[#CDD0D1]">
                        <div className="flex items-center justify-between border-b border-[#CDD0D1] pb-3 px-4 pt-4">
                            <div>
                                {" "}
                                <p className="text-[#111827] font-semibold text-[16px]">
                                    Customer Information
                                </p>
                            </div>
                            <div>
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-1.5 text-white! capitalize rounded-full text-xs font-semibold bg-primary`}
                                >
                                    {removeUnderScore(entity)}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            {customerInfo &&
                                customerInfo.map((item, i) => (
                                    <div key={i} className="flex mt-2 gap-3">
                                        <p className="text-[#4b5563] text-[14px]">{item.label}:</p>
                                        <p className="text-primary-black-15 text-[14px] capitalize">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="mt-6 space-y-6">
                        {Object.entries(docVerification).map(([docType, docData]) => {
                            const ocr = docData?.ocr;
                            const identity = docData?.identity;
                            const file = getUploadedFileByDocType(docType);
                            const isMatched =
                                ocr &&
                                identity &&
                                !ocr?.error &&
                                !identity?.error &&
                                JSON.stringify(ocr)
                                    .toLowerCase()
                                    .includes((identity?.name_on_document || "").toLowerCase());

                            return (
                                <div
                                    key={docType}
                                    className="border border-[#CDD0D1] rounded-2xl  bg-white p-4"
                                >
                                    <div className="w-full flex justify-between items-center mb-4 border-b border-[#CDD0D1] pb-3">
                                        <div>
                                            <p className="font-semibold text-lg">
                                                {docType.replace("_", " ")}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                OCR & Digilocker validation
                                            </p>
                                        </div>

                                        {isMatched && (
                                            <span className="px-3 py-1 text-green-600 border border-green-500 rounded-full text-xs">
                                                ✓ Matched
                                            </span>
                                        )}
                                    </div>
                                    {file && (
                                        <div className="flex items-center justify-between border border-[#CDD0D1] rounded-xl p-3 bg-gray-50 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    {file.fileKey?.includes(".pdf") ? (
                                                        <ImageLoader
                                                            imageKey="FileUploadIcon"
                                                            className="w-10 h-10"
                                                        />
                                                    ) : (
                                                        <ImageLoader
                                                            imageKey="gallery"
                                                            className="w-10 h-10"
                                                        />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {file.fileKey.split("/").pop()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                onClick={() =>
                                                    window.open(file.signedUrl, "_blank")
                                                }
                                                className="w-6 h-6 flex items-center justify-center cursor-pointer"
                                            >
                                                <div>
                                                    <ImageLoader
                                                        imageKey="FileEyeIcon"
                                                        className="w-10 h-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <VerificationCard
                                            title="OCR Extracted Data"
                                            data={ocr}
                                            loading={!identity && !ocr}
                                        />
                                        <VerificationCard
                                            title="Identity API Response"
                                            data={identity}
                                            loading={!identity && !ocr}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
