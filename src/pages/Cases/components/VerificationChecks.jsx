import { AlertCircle, AlertTriangle, CheckCircle2, X, XCircle, Check } from "lucide-react";

import { PreviewImage } from "../../../components/ui/PreviewImage";
import useCaseStore from "../../../store/Case/useCaseStore";
import { checkValue, removeUnderScore } from "../../../utils";
import { PreviewPdf } from "../../../components/ui/PreviewPdf";

export function VerificationChecks({ verification, others }) {
    const { reportDetail } = useCaseStore();
    const { entity } = reportDetail;

    return (
        <div className="p-5 flex flex-col gap-8">
            {verification?.faceVerificationResult?.matchResult?.matchScore &&
                verification?.faceVerificationResult &&
                Object.keys(verification?.faceVerificationResult).length > 0 && (
                    <FaceMatchVerification verification={verification} obj={entity} />
                )}

            {entity === "individual" &&
                verification?.aadharVerificationResult &&
                Object.keys(verification?.aadharVerificationResult).length > 0 && (
                    <AadhaarVerification verification={verification} />
                )}
            {verification?.panVerificationResult &&
                Object.keys(verification.panVerificationResult).length > 0 && (
                    <PANOCRVerification verification={verification} />
                )}
            {verification?.cinVerificationResult &&
                Object.keys(verification.cinVerificationResult).length > 0 && (
                    <CINVerification verification={verification} />
                )}

            {verification?.passportVerificationResult &&
                Object.keys(verification.passportVerificationResult).length > 0 && (
                    <PassportVerification verification={verification} />
                )}

            {verification?.drivingLicenseVerificationResult &&
                Object.keys(verification.drivingLicenseVerificationResult).length > 0 && (
                    <DrivingLicenseVerification verification={verification} />
                )}
            {verification?.voterIdVerificationResult &&
                Object.keys(verification.voterIdVerificationResult).length > 0 && (
                    <VoterIdVerification verification={verification} />
                )}

            {verification?.gstVerificationResult &&
                Object.keys(verification.gstVerificationResult).length > 0 && (
                    <GSTVerification verification={verification} />
                )}

            {verification?.deviceVerificationResult &&
                Object.keys(verification.deviceVerificationResult).length > 0 && (
                    <DeviceVerification verification={verification} />
                )}

            {others?.length > 0 && <OthersDocs verification={others} />}
        </div>
    );
}

const getConfidenceStatus = (percentage = 0) => {
    if (percentage >= 85) {
        return {
            label: "Details Verified",
            color: "text-green-700 bg-green-50 border-green-200",
            percentage: "text-green-700",

            Icon: CheckCircle2,
        };
    }

    if (percentage >= 70) {
        return {
            label: "Mostly Verified",
            color: "text-green-700 bg-green-50 border-green-200",
            percentage: "text-green-700",
            Icon: CheckCircle2,
        };
    }

    if (percentage >= 50) {
        return {
            label: "Partially Verified",
            color: "text-orange-700 bg-orange-50 border-orange-200",
            percentage: "text-orange-700",

            Icon: AlertCircle,
        };
    }

    if (percentage >= 30) {
        return {
            label: "Low Confidence",
            color: "text-red-700 bg-red-50 border-red-200",
            percentage: "text-red-700",

            Icon: AlertTriangle,
        };
    }

    return {
        label: "Verification Failed",
        color: "text-red-700 bg-red-50 border-red-200",
        percentage: "text-red-700",
        Icon: XCircle,
    };
};

const ConfidenceIcon = ({ level, status }) => {
    const config = {
        HIGH: {
            bg: "bg-green-500",
            icon: <Check className="w-3 h-3 text-white" />,
            title: "High Match",
        },
        MEDIUM: {
            bg: "bg-amber-400",
            icon: <AlertTriangle className="w-3 h-3 text-white" />,
            title: "Medium Match",
        },
        LOW: {
            bg: "bg-red-500",
            icon: <X className="w-3 h-3 text-white" />,
            title: "Low Match",
        },
    };

    const item = config[level];
    if (status === "failed") {
        return (
            <>
                <span
                    className={`inline-flex items-center justify-center
        w-4 h-4 rounded-full bg-red-500`}
                >
                    <X className="w-3 h-3 text-white" />
                </span>
                <span className="pl-2">{status}</span>
            </>
        );
    }
    if (!item) {
        return <span>-</span>;
    }

    return (
        <>
            <span
                title={item.title}
                className={`inline-flex items-center justify-center
        w-4 h-4 rounded-full ${item.bg}`}
            >
                {item.icon}
            </span>
            <span title={item.title} className="pl-2">
                {item.title}
            </span>
        </>
    );
};
function FaceMatchVerification({ verification, obj }) {
    const uploadedSelfie = verification?.faceVerificationResult?.uploadedSelfie;
    const aadhaarPhoto = verification?.faceVerificationResult?.digilockerPhoto;
    const matchScore = verification?.faceVerificationResult?.matchResult?.matchScore || 0;
    const confidence = verification?.faceVerificationResult?.matchResult?.confidence || "";
    const aadhaarPercentage =
        verification?.faceVerificationResult?.matchResult?.overallPercentage || 0;

    const { label, color, Icon, percentage } = getConfidenceStatus(aadhaarPercentage);
    const faceMatchImages = [
        {
            key: "liveselfie",
            label: "Live Selfie",
            image: uploadedSelfie,
        },
        {
            key: "aadhaarphoto",
            label: "Aadhaar Photo",
            image: aadhaarPhoto,
        },
    ].filter((item) => item.image);

    return (
        <div className="space-y-6">
            {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                Face Match Verification
            </h2> */}
            {/* <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    Face Match Verification
                </div>
            </div> */}
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    {obj === "individual" ? "Face Match Verification" : "Live Selfie"}
                    {obj === "individual" && (
                        <div
                            className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{label}</span>
                        </div>
                    )}
                </div>
                {obj === "individual" && (
                    <div className="flex justify-center items-center gap-3">
                        {confidence !== "" && (
                            <p className="border border-gray-300 rounded-xl px-3 py-1 text-sm font-medium flex items-center gap-2">
                                <ConfidenceIcon
                                    level={confidence}
                                    status={verification?.faceVerificationResult?.status}
                                />
                            </p>
                        )}

                        <p className={`text-center text-xl font-bold ${percentage}`}>
                            {matchScore?.toFixed(2) ?? 0}%
                        </p>
                    </div>
                )}
            </div>

            {obj === "individual" && verification?.faceVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                        {verification?.faceVerificationResult?.error?.message}
                    </span>
                </div>
            )}

            <div className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Live Selfie</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {faceMatchImages?.map(({ key, label, image }) => (
                                <div
                                    key={key}
                                    className="border border-gray-200 rounded-xl bg-white p-3 shadow-sm h-80"
                                >
                                    <PreviewImage
                                        src={image}
                                        label={label}
                                        containerClass="w-full h-full"
                                        imageClass="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Face Match Score</h3>
                        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4 border border-gray-200 shadow-sm h-48 flex flex-col justify-center">
                            <div className="text-center">
                                <p className="text-5xl md:text-6xl font-bold text-blue-600">
                                    {matchScore ?? 0}%
                                </p>
                                <p className="text-gray-500 mt-2 text-sm">Match</p>
                            </div>

                            {confidence && (
                                <div
                                    className={`flex items-center justify-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-full border border-green-200 w-fit mx-auto ${
                                        confidence === "HIGH"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : confidence === "LOW"
                                              ? "bg-red-50 text-red-700 border-red-200"
                                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    }`}
                                >
                                    {confidence === "HIGH" ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : confidence === "LOW" ? (
                                        <XCircle className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-yellow-500" />
                                    )}

                                    <span className="font-medium text-sm">
                                        {confidence ?? "UNKNOWN"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

function AadhaarVerification({ verification }) {
    const aadhaarDBName = verification?.aadharVerificationResult?.database?.name;
    const aadhaarDBDOB = verification?.aadharVerificationResult?.database?.dob;
    const aadhaarDBAddress = verification?.aadharVerificationResult?.database?.address;

    const aadhaarApiName = verification?.aadharVerificationResult?.digilocker?.name;
    const aadhaarApiDOB = verification?.aadharVerificationResult?.digilocker?.dob;
    const aadhaarApiAddress = verification?.aadharVerificationResult?.digilocker?.address;
    const aadhaarPercentage =
        verification?.aadharVerificationResult?.matchResult?.overallPercentage || 0;
    const aadhaarMatchResult = verification?.aadharVerificationResult?.matchResult;

    const { label, color, Icon, percentage } = getConfidenceStatus(aadhaarPercentage);

    return (
        <div className="space-y-6">
            {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700">Aadhaar Verification</h2> */}
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    Aadhaar Verification
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {aadhaarPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>

            <div className="space-y-6 ">
                <div className="grid grid-cols-1 gap-6 min-w-full">
                    <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden min-w-full">
                        {/* Header */}
                        <div className="grid grid-cols-4 bg-gray-100 text-xs font-semibold text-gray-600">
                            <div className="p-3">Field</div>

                            <div className="p-3">Identity API Response</div>
                            <div className="p-3">System Data</div>
                            <div className="p-3">Status</div>
                        </div>

                        {[
                            {
                                label: "Name",
                                api: aadhaarApiName,
                                system: aadhaarDBName,
                                status: aadhaarMatchResult?.nameMatch?.isMatched,
                                confidence: aadhaarMatchResult?.nameMatch?.confidence,
                            },
                            {
                                label: "DOB",
                                api: aadhaarApiDOB,
                                system: aadhaarDBDOB,
                                status: aadhaarMatchResult?.dobMatch?.isMatched,
                                confidence: aadhaarMatchResult?.dobMatch?.confidence,
                            },
                            {
                                label: "Address",
                                api: aadhaarApiAddress,
                                system: aadhaarDBAddress,
                                status: aadhaarMatchResult?.addressMatch?.isMatched,
                                confidence: aadhaarMatchResult?.addressMatch?.confidence,
                            },
                        ].map((row) => (
                            <div
                                key={row.label}
                                className="grid grid-cols-4 border-t border-gray-200 text-sm bg-white"
                            >
                                {/* Field */}
                                <div className="p-3 font-medium text-gray-700">{row.label}</div>

                                <div className="p-3 flex items-start gap-2 border-l border-gray-200">
                                    <div className="flex-1 text-gray-900">{row.api || "-"}</div>
                                </div>

                                <div className="p-3 flex items-start gap-2 border-l border-gray-200">
                                    <div className="flex-1 text-gray-900">{row.system || "-"}</div>
                                </div>

                                <div className="p-3 flex items-start gap-2  border-l border-gray-200">
                                    <div className="flex-1 text-gray-900">
                                        <ConfidenceIcon
                                            level={row.confidence}
                                            status={verification?.aadharVerificationResult?.status}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PANOCRVerification({ verification }) {
    const panImageUpload = verification?.panVerificationResult?.uploadedFile;
    const PanName = verification?.panVerificationResult?.ocr?.name;
    const panNumber = verification?.panVerificationResult?.ocr?.pan;

    const panDBName = verification?.panVerificationResult?.database?.name;
    const panDBNumber = verification?.panVerificationResult?.database?.pan;

    const panIdenitityName = verification?.panVerificationResult?.identity?.name;
    const panIdenitityNumber = verification?.panVerificationResult?.identity?.pan;
    const panMatchResult = verification?.panVerificationResult?.matchResult;
    const overallPercentage = panMatchResult?.overallPercentage;

    const { label, color, Icon, percentage } = getConfidenceStatus(overallPercentage);

    return (
        <div className="space-y-6">
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    PAN OCR Verification{" "}
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {overallPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>
            {verification?.panVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                        {verification?.panVerificationResult?.error?.message}
                    </span>
                </div>
            )}
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Captured Document</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {panImageUpload?.front && (
                                <div>
                                    <p>Front</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={panImageUpload?.front}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {panImageUpload?.back && (
                                <div>
                                    <p>Back</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={panImageUpload?.back}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Data Match Score</h3>

                        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4 border border-gray-200 shadow-sm h-48 flex flex-col justify-center">
                            <p className="text-center text-4xl md:text-5xl font-bold text-indigo-600 max-[500px]:text-[18px]">
                                {overallPercentage ?? 0}%
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                                        overallPercentage ?? 0
                                    )}`}
                                    style={{ width: `${Math.min(100, overallPercentage ?? 0)}%` }}
                                />
                            </div>

                            <div
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border w-fit mx-auto ${color}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{label}</span>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            {/* Header */}
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">OCR data</th>
                                    <th className="p-3 text-left">Identity API response</th>
                                    <th className="p-3 text-left">System Data</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                {[
                                    {
                                        label: "Name",
                                        ocr: PanName,
                                        api: panIdenitityName,
                                        system: panDBName,
                                        status: panMatchResult?.nameMatch?.isMatched,
                                        confidence: panMatchResult?.nameMatch?.confidence,
                                    },
                                    {
                                        label: "PAN",
                                        ocr: panNumber,
                                        api: panIdenitityNumber,
                                        system: panDBNumber,
                                        status: panMatchResult?.panMatch?.isMatched,
                                        confidence: panMatchResult?.panMatch?.confidence,
                                    },
                                ].map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-t border-gray-200 bg-white"
                                    >
                                        {/* Field */}
                                        <td className="p-3 font-medium text-gray-700">
                                            {row.label}
                                        </td>

                                        {/* OCR */}
                                        <td className="p-3">{row.ocr || "-"}</td>

                                        {/* API */}
                                        <td className="p-3">{row.api || "-"}</td>

                                        {/* System */}
                                        <td className="p-3">{row.system || "-"}</td>

                                        {/* Status */}
                                        <td className="p-3">
                                            <ConfidenceIcon
                                                level={row.confidence}
                                                status={verification?.panVerificationResult?.status}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Name Match Score */}
                {/* <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-3 border border-gray-200 shadow-sm h-32 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-700">Name Match Score</p>
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">100%</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: "100%" }} />
          </div>

          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-full border border-green-200 w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Name Matched</span>
          </div>
        </div> */}
            </div>
        </div>
    );
}

function DeviceVerification({ verification }) {
    const customerIp = verification?.deviceVerificationResult?.ipMatch?.customerIp;
    const agentIp = verification?.deviceVerificationResult?.ipMatch?.agentIp;
    const statusCode = verification?.deviceVerificationResult?.ipMatch?.status;
    const statusLabel = verification?.deviceVerificationResult?.ipMatch?.statusLabel;

    let statusConfig;

    switch (statusCode) {
        case "MATCH":
            statusConfig = {
                color: "text-red-700 bg-red-50 border border-red-200",
                Icon: CheckCircle2,
            };
            break;

        case "MISMATCH":
            statusConfig = {
                color: "text-green-700 bg-green-50 border border-green-200",
                Icon: AlertTriangle,
            };
            break;

        case "UNKNOWN":
            statusConfig = {
                color: "text-red-700 bg-red-50 border border-red-200",
                Icon: AlertTriangle,
            };
            break;

        default:
            statusConfig = {
                color: "text-gray-700 bg-gray-50 border border-gray-200",
                Icon: AlertTriangle,
            };
    }

    return (
        <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 max-[500px]:text-[15px]">
                Device Verification
            </h2>

            <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            {/* Header */}
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">Customer</th>
                                    <th className="p-3 text-left">Agent</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                <tr className="border-t border-gray-200 bg-white">
                                    {/* Field */}
                                    <td className="p-3 font-medium text-gray-700">IP Address</td>

                                    {/* Customer */}
                                    <td className="p-3">{customerIp || "-"}</td>

                                    {/* Agent */}
                                    <td className="p-3">{agentIp || "-"}</td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <div
                                            className={`w-fit flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.color}`}
                                        >
                                            <statusConfig.Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PassportVerification({ verification }) {
    const passportImageUpload = verification?.passportVerificationResult?.uploadedFile;
    const PassportName = verification?.passportVerificationResult?.ocr?.name;
    const PassportDob = verification?.passportVerificationResult?.ocr?.dob;
    const PassportNumber = verification?.passportVerificationResult?.ocr?.passportNumber;

    const PassportDBName = verification?.passportVerificationResult?.database?.name;
    const dobDate = verification?.passportVerificationResult?.database?.dob;
    const PassportDataBaseNumber =
        verification?.passportVerificationResult?.database?.passportNumber;

    const PassportIdenitityName = verification?.passportVerificationResult?.identity?.name;
    const dobIdenitity = verification?.passportVerificationResult?.identity?.dob;
    const PassportItentityBaseNumber =
        verification?.passportVerificationResult?.identity?.passportNumber;

    const PassportMatchResult = verification?.passportVerificationResult?.matchResult;
    const overallPercentage = PassportMatchResult?.overallPercentage;

    const { label, color, Icon, percentage } = getConfidenceStatus(overallPercentage);

    return (
        <div className="space-y-6">
            {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700 max-[500px]:text-[14px]">
                Passport Verification
            </h2> */}
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    Passport Verification
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {overallPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>
            {verification?.passportVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {verification?.passportVerificationResult?.error?.message}
                    </span>
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Captured Document</h3>

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl bg-white p-3  h-40 sm:h-48 w-full">
                                <PreviewImage
                                    src={panImageUpload?.front}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl bg-white p-3 h-40 sm:h-48 w-full">
                                <PreviewImage
                                    src={panImageUpload?.back}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>
                        </div> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {passportImageUpload?.front && (
                                <div>
                                    <p>Front</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={passportImageUpload?.front}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {passportImageUpload?.back && (
                                <div>
                                    <p>Back</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={passportImageUpload?.back}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Data Match Score</h3>

                        <div className="bg-linear-to-br border-gray-200 from-gray-50 to-gray-100 rounded-xl p-5 sm:p-6 space-y-4 border h-48 flex flex-col justify-center">
                            <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600">
                                {overallPercentage ?? 0}%
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                                        overallPercentage ?? 0
                                    )}`}
                                    style={{ width: `${Math.min(100, overallPercentage ?? 0)}%` }}
                                />
                            </div>

                            <div
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border w-fit mx-auto ${color}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{checkValue(label)}</span>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">OCR data</th>
                                    <th className="p-3 text-left">Identity API response</th>
                                    <th className="p-3 text-left">System Data</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    {
                                        label: "DOB",
                                        ocr: PassportDob,
                                        api: dobIdenitity,
                                        system: dobDate,
                                        status: PassportMatchResult?.dobMatch?.isMatched,
                                        confidence: PassportMatchResult?.dobMatch?.confidence,
                                    },
                                    {
                                        label: "Name",
                                        ocr: PassportName,
                                        api: PassportIdenitityName,
                                        system: PassportDBName,
                                        status: PassportMatchResult?.nameMatch?.isMatched,
                                        confidence: PassportMatchResult?.nameMatch?.confidence,
                                    },
                                    {
                                        label: "Passport",
                                        ocr: PassportNumber,
                                        api: PassportItentityBaseNumber,
                                        system: PassportDataBaseNumber,
                                        status: PassportMatchResult?.passportMatch?.isMatched,
                                        confidence: PassportMatchResult?.passportMatch?.confidence,
                                    },
                                ].map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-t border-gray-200 bg-white"
                                    >
                                        <td className="p-3 font-medium text-gray-700">
                                            {checkValue(row.label)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.ocr)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.api)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {row.system || "-"}
                                        </td>

                                        <td className="p-3 border-l border-gray-200">
                                            <ConfidenceIcon
                                                level={row.confidence}
                                                status={
                                                    verification?.passportVerificationResult?.status
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
function DrivingLicenseVerification({ verification }) {
    const DrivingLicenseImageUpload = verification?.drivingLicenseVerificationResult?.uploadedFile;
    const LicenseName = verification?.drivingLicenseVerificationResult?.ocr?.name;
    const LicenseDob = verification?.drivingLicenseVerificationResult?.ocr?.dob;
    const LincenseNumber = verification?.drivingLicenseVerificationResult?.ocr?.dlNumber;

    const LicenseDBName = verification?.drivingLicenseVerificationResult?.database?.name;
    const dobDate = verification?.drivingLicenseVerificationResult?.database?.dob;
    const licenseDataBaseNumber =
        verification?.drivingLicenseVerificationResult?.database?.dlNumber;

    const LicenseIdenitityName = verification?.drivingLicenseVerificationResult?.identity?.name;
    const dobIdenitity = verification?.drivingLicenseVerificationResult?.identity?.dob;
    const LicenseItentityBaseNumber =
        verification?.drivingLicenseVerificationResult?.identity?.dlNumber;

    const LicenseMatchResult = verification?.drivingLicenseVerificationResult?.matchResult;
    const overallPercentage = LicenseMatchResult?.overallPercentage;

    const { label, color, Icon, percentage } = getConfidenceStatus(overallPercentage);

    return (
        <div className="space-y-6">
            {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                DrivingLicense Verification
            </h2> */}
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    DrivingLicense Verification
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {overallPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>
            {verification?.drivingLicenseVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {verification?.drivingLicenseVerificationResult?.error?.message}
                    </span>
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Captured Document</h3>

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl bg-white p-3  h-40 sm:h-48 w-full">
                                <PreviewImage
                                    src={DrivingLicenseImageUpload?.front}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl bg-white p-3 h-40 sm:h-48 w-full">
                                <PreviewImage
                                    src={DrivingLicenseImageUpload?.back}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>
                        </div> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {DrivingLicenseImageUpload?.front && (
                                <div>
                                    <p>Front</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={DrivingLicenseImageUpload?.front}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {DrivingLicenseImageUpload?.back && (
                                <div>
                                    <p>Back</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={DrivingLicenseImageUpload?.back}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Data Match Score</h3>

                        <div className="bg-linear-to-br border-gray-200 from-gray-50 to-gray-100 rounded-xl p-5 sm:p-6 space-y-4 border h-48 flex flex-col justify-center">
                            <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600">
                                {overallPercentage ?? 0}%
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                                        overallPercentage ?? 0
                                    )}`}
                                    style={{ width: `${Math.min(100, overallPercentage ?? 0)}%` }}
                                />
                            </div>

                            <div
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border w-fit mx-auto ${color}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{label}</span>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">OCR data</th>
                                    <th className="p-3 text-left">Identity API response</th>
                                    <th className="p-3 text-left">System Data</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    {
                                        label: "Driving License",
                                        ocr: LincenseNumber,
                                        api: LicenseItentityBaseNumber,
                                        system: licenseDataBaseNumber,
                                        status: LicenseMatchResult?.dlMatch?.isMatched,
                                        confidence: LicenseMatchResult?.dlMatch?.confidence,
                                    },
                                    {
                                        label: "DOB",
                                        ocr: LicenseDob,
                                        api: dobIdenitity,
                                        system: dobDate,
                                        status: LicenseMatchResult?.dobMatch?.isMatched,
                                        confidence: LicenseMatchResult?.dobMatch?.confidence,
                                    },
                                    {
                                        label: "Name",
                                        ocr: LicenseName,
                                        api: LicenseIdenitityName,
                                        system: LicenseDBName,
                                        status: LicenseMatchResult?.nameMatch?.isMatched,
                                        confidence: LicenseMatchResult?.nameMatch?.confidence,
                                    },
                                ].map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-t border-gray-200 bg-white"
                                    >
                                        <td className="p-3 font-medium text-gray-700">
                                            {checkValue(row.label)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.ocr)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.api)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.system)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200">
                                            <ConfidenceIcon
                                                level={row.confidence}
                                                status={
                                                    verification?.drivingLicenseVerificationResult
                                                        ?.status
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VoterIdVerification({ verification }) {
    const { district, state } = verification?.voterIdVerificationResult?.ocr || {};
    const VoterIdImageUpload = verification?.voterIdVerificationResult?.uploadedFile;
    const voterName = verification?.voterIdVerificationResult?.ocr?.name;
    const voterAddress = [district, state].filter(Boolean).join(", ");
    const voterId = verification?.voterIdVerificationResult?.ocr?.voterId;

    const voterDBName = verification?.voterIdVerificationResult?.database?.name;
    const voterDBAddress = "-";
    const VoterIdNumber = verification?.voterIdVerificationResult?.database?.dlNumber;

    const VoterIdenitityName = verification?.voterIdVerificationResult?.identity?.name;
    const voterIdentityAddress = [
        verification?.voterIdVerificationResult?.identity?.district,
        verification?.voterIdVerificationResult?.identity?.state,
    ]
        .filter(Boolean)
        .join(", ");
    const VoterItentityBaseNumber = verification?.voterIdVerificationResult?.identity?.voterId;

    const VoterIdMatchResult = verification?.voterIdVerificationResult?.matchResult;
    const overallPercentage = VoterIdMatchResult?.overallPercentage;

    const { label, color, Icon, percentage } = getConfidenceStatus(overallPercentage);

    return (
        <div className="space-y-6">
            {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                Voter Id Verification
            </h2> */}
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    Voter Id Verification
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {overallPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>
            {verification?.voterIdVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {verification?.voterIdVerificationResult?.error?.message}
                    </span>
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Captured Document</h3>

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl bg-white p-3  h-40 sm:h-48 w-full">
                                <PreviewImage
                                    src={VoterIdImageUpload?.front}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl bg-white p-3 h-40 sm:h-48 w-full">
                                <PreviewImage
                                    src={VoterIdImageUpload?.back}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>
                        </div> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {VoterIdImageUpload?.front && (
                                <div>
                                    <p>Front</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={VoterIdImageUpload?.front}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {VoterIdImageUpload?.back && (
                                <div>
                                    <p>Back</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={VoterIdImageUpload?.back}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Data Match Score</h3>

                        <div className="bg-linear-to-br border-gray-200 from-gray-50 to-gray-100 rounded-xl p-5 sm:p-6 space-y-4 border h-48 flex flex-col justify-center">
                            <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600">
                                {overallPercentage ?? 0}%
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                                        overallPercentage ?? 0
                                    )}`}
                                    style={{ width: `${Math.min(100, overallPercentage ?? 0)}%` }}
                                />
                            </div>

                            <div
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border w-fit mx-auto ${color}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{checkValue(label)}</span>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">OCR data</th>
                                    <th className="p-3 text-left">Identity API response</th>
                                    <th className="p-3 text-left">System Data</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    {
                                        label: "Address",
                                        ocr: voterAddress,
                                        api: voterIdentityAddress,
                                        system: voterDBAddress,
                                        status: VoterIdMatchResult?.addressMatch?.isMatched,
                                        confidence: VoterIdMatchResult?.addressMatch?.confidence,
                                    },
                                    {
                                        label: "Name",
                                        ocr: voterName,
                                        api: VoterIdenitityName,
                                        system: voterDBName,
                                        status: VoterIdMatchResult?.nameMatch?.isMatched,
                                        confidence: VoterIdMatchResult?.nameMatch?.confidence,
                                    },
                                    {
                                        label: "voterId",
                                        ocr: voterId,
                                        api: VoterItentityBaseNumber,
                                        system: VoterIdNumber,
                                        status: VoterIdMatchResult?.voterIdMatch?.isMatched,
                                        confidence: VoterIdMatchResult?.voterIdMatch?.confidence,
                                    },
                                ].map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-t border-gray-200 bg-white"
                                    >
                                        <td className="p-3 font-medium text-gray-700">
                                            {checkValue(row.label)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.ocr)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.api)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.system)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200">
                                            <ConfidenceIcon
                                                level={row.confidence}
                                                status={
                                                    verification?.voterIdVerificationResult?.status
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GSTVerification({ verification }) {
    const GSTImageUpload = verification?.gstVerificationResult?.uploadedFile;
    const GSTName = verification?.gstVerificationResult?.ocr?.legalName;
    const GSTAddress = verification?.gstVerificationResult?.ocr?.address;
    const GSTNumber = verification?.gstVerificationResult?.ocr?.gstin;

    const GSTDBName = verification?.gstVerificationResult?.database?.legalName;
    const GSTDBAddress = verification?.gstVerificationResult?.database?.address;
    const GSTDB = verification?.gstVerificationResult?.database?.gstin;

    const GSTIdentityName = verification?.gstVerificationResult?.identity?.legalName;
    const GSTIdentityAddress = verification?.gstVerificationResult?.identity?.address;
    const GSTIdentityNumber = verification?.gstVerificationResult?.identity?.gstin;

    const GSTMatchResult = verification?.gstVerificationResult?.matchResult;
    const overallPercentage = GSTMatchResult?.overallPercentage;

    const { label, color, Icon, percentage } = getConfidenceStatus(overallPercentage);

    return (
        <div className="space-y-6">
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    GST Verification
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {overallPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>
            {/* <h2 className="text-lg md:text-xl font-semibold text-gray-700">GST Verification</h2> */}
            {verification?.gstVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                        {verification?.gstVerificationResult?.error?.message}
                    </span>
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Captured Document</h3>

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="border border-gray-200 rounded-xl bg-white p-3  h:80 w-full">
                                <PreviewImage
                                    src={GSTImageUpload?.front}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl bg-white p-3 h-80 w-full">
                                <PreviewImage
                                    src={GSTImageUpload?.back}
                                    containerClass="w-full h-full"
                                    imageClass="object-cover"
                                />
                            </div>
                        </div> */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {GSTImageUpload?.front && (
                                <div>
                                    <p>Front</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={GSTImageUpload?.front}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {GSTImageUpload?.back && (
                                <div>
                                    <p>Back</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={GSTImageUpload?.back}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Data Match Score</h3>

                        <div className="bg-linear-to-br border-gray-200 from-gray-50 to-gray-100 rounded-xl p-5 sm:p-6 space-y-4 border h-48 flex flex-col justify-center">
                            <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600">
                                {overallPercentage ?? 0}%
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                                        overallPercentage ?? 0
                                    )}`}
                                    style={{ width: `${Math.min(100, overallPercentage ?? 0)}%` }}
                                />
                            </div>

                            <div
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border w-fit mx-auto ${color}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{checkValue(label)}</span>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            {/* Header */}
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">OCR data</th>
                                    <th className="p-3 text-left">Identity API response</th>
                                    <th className="p-3 text-left">System Data</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[
                                    {
                                        label: "Address",
                                        ocr: GSTAddress,
                                        api: GSTIdentityAddress,
                                        system: GSTDBAddress,
                                        status: GSTMatchResult?.addressMatch?.isMatched,
                                        confidence: GSTMatchResult?.addressMatch?.confidence,
                                    },
                                    {
                                        label: "Name",
                                        ocr: GSTName,
                                        api: GSTIdentityName,
                                        system: GSTDBName,
                                        status: GSTMatchResult?.nameMatch?.isMatched,
                                        confidence: GSTMatchResult?.nameMatch?.confidence,
                                    },
                                    {
                                        label: "GST",
                                        ocr: GSTNumber,
                                        api: GSTIdentityNumber,
                                        system: GSTDB,
                                        status: GSTMatchResult?.gstMatch?.isMatched,
                                        confidence: GSTMatchResult?.gstMatch?.confidence,
                                    },
                                ].map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-t border-gray-200 bg-white"
                                    >
                                        <td className="p-3 font-medium text-gray-700">
                                            {checkValue(row.label)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.ocr)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.api)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200 text-gray-900">
                                            {checkValue(row.system)}
                                        </td>

                                        <td className="p-3 border-l border-gray-200">
                                            <ConfidenceIcon
                                                level={row.confidence}
                                                status={verification?.gstVerificationResult?.status}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CINVerification({ verification }) {
    const cinImageUpload = verification?.cinVerificationResult?.uploadedFile;
    const CinName = verification?.cinVerificationResult?.ocr?.companyName;
    const cinNumber = verification?.cinVerificationResult?.ocr?.cin;
    const cinAddress = verification?.cinVerificationResult?.ocr?.address;

    const cinDBName = verification?.cinVerificationResult?.database?.companyName;
    const cinDBNumber = verification?.cinVerificationResult?.database?.cin;
    const cinDBAddress = verification?.cinVerificationResult?.database?.address;

    const cinIdentityName = verification?.cinVerificationResult?.identity?.companyName;
    const cinIdentityNumber = verification?.cinVerificationResult?.identity?.cin;

    const cinIdentityAddress = verification?.cinVerificationResult?.identity?.address;

    const cinMatchResult = verification?.cinVerificationResult?.matchResult;
    const overallPercentage = cinMatchResult?.overallPercentage;

    const { label, color, Icon, percentage } = getConfidenceStatus(overallPercentage);

    return (
        <div className="space-y-6">
            <div className="bg-[#E9F0F2] px-2 py-1 rounded-t-lg! flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700 max-[500px]:text-[13px] flex items-center gap-2">
                    CIN Verification{" "}
                    <div
                        className={`flex items-center justify-center gap-2 px-3 rounded-full border w-fit mx-auto ${color}`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                </div>
                <div>
                    <p className={`text-center text-xl font-bold ${percentage}`}>
                        {overallPercentage?.toFixed(2) ?? 0}%
                    </p>
                </div>
            </div>
            {verification?.panVerificationResult?.error?.message && (
                <div
                    className={` flex gap-3 items-center px-3 py-5 rounded-2xl border text-red-700 bg-red-50 border-red-200`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                        {verification?.panVerificationResult?.error?.message}
                    </span>
                </div>
            )}
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 text-sm">Captured Document</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {cinImageUpload?.front && (
                                <div>
                                    <p>Front</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={cinImageUpload?.front}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {cinImageUpload?.back && (
                                <div>
                                    <p>Back</p>
                                    <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm h-80">
                                        <PreviewImage
                                            src={cinImageUpload?.back}
                                            // label="PAN Card"
                                            containerClass="w-full h-full"
                                            imageClass="object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            {/* Header */}
                            <thead className="bg-[#E9F0F2] text-xs font-semibold text-gray-600">
                                <tr>
                                    <th className="p-3 text-left">Field</th>
                                    <th className="p-3 text-left">OCR data</th>
                                    <th className="p-3 text-left">Identity API response</th>
                                    <th className="p-3 text-left">System Data</th>
                                    <th className="p-3 text-left">Status</th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                {[
                                    {
                                        label: "Cin Number",
                                        ocr: cinNumber,
                                        api: cinIdentityNumber,
                                        system: cinDBNumber,
                                        status: cinMatchResult?.cinMatch?.isMatched,
                                        confidence: cinMatchResult?.cinMatch?.confidence,
                                    },
                                    {
                                        label: "CompanyName",
                                        ocr: CinName,
                                        api: cinIdentityName,
                                        system: cinDBName,
                                        status: cinMatchResult?.nameMatch?.isMatched,
                                        confidence: cinMatchResult?.nameMatch?.confidence,
                                    },
                                    {
                                        label: "Address",
                                        ocr: cinAddress,
                                        api: cinIdentityAddress,
                                        system: cinDBAddress,
                                        status: cinMatchResult?.addressMatch?.isMatched,
                                        confidence: cinMatchResult?.addressMatch?.confidence,
                                    },
                                ].map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-t border-gray-200 bg-white"
                                    >
                                        {/* Field */}
                                        <td className="p-3 font-medium text-gray-700">
                                            {row.label}
                                        </td>

                                        {/* OCR */}
                                        <td className="p-3">{row.ocr || "-"}</td>

                                        {/* API */}
                                        <td className="p-3">{row.api || "-"}</td>

                                        {/* System */}
                                        <td className="p-3">{row.system || "-"}</td>

                                        {/* Status */}
                                        <td className="p-3">
                                            <ConfidenceIcon
                                                level={row.confidence}
                                                status={verification?.cinVerificationResult?.status}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Name Match Score */}
                {/* <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-3 border border-gray-200 shadow-sm h-32 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-700">Name Match Score</p>
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">100%</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: "100%" }} />
          </div>

          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-full border border-green-200 w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Name Matched</span>
          </div>
        </div> */}
            </div>
        </div>
    );
}

function OthersDocs({ verification }) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">Others</h2>
            <div className="border rounded-2xl border-gray-200 max-h-[40vh] overflow-y-auto p-3">
                {verification?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {verification.map((item, i) => (
                            <div
                                key={i}
                                className="border border-gray-200 rounded-xl p-3 bg-white flex flex-col gap-2"
                            >
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">File Type</p>
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {(item?.fileType && removeUnderScore(item?.fileType)) ||
                                                "-"}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs">Uploaded By</p>
                                        <p className="font-semibold text-gray-800">
                                            {checkValue(item?.uploadedBy?.name)}
                                        </p>
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="mt-2">
                                    <p className="text-gray-500 text-xs mb-1">File</p>
                                    <div className="w-full h-[120px] rounded-lg overflow-hidden border border-gray-200">
                                        {item?.fileKey?.endsWith(".pdf") ? (
                                            <PreviewPdf
                                                src={item?.uploadedFile}
                                                containerClass="w-full h-full"
                                            />
                                        ) : (
                                            <PreviewImage
                                                src={item?.uploadedFile}
                                                containerClass="w-full h-full"
                                                imageClass="object-cover w-full h-full"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-6">No data available</div>
                )}
            </div>
        </div>
    );
}
