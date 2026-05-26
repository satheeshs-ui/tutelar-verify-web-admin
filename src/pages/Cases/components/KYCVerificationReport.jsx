import React from "react";
import { CheckCircle, CircleX } from "lucide-react";
import { VerificationChecks } from "./VerificationChecks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkValue, formatDuration, removeUnderScore, showDateTime } from "../../../utils";
import { Button, Modal, Rate, Tag } from "antd";

import ModalPopUp from "../../../components/ui/ModalPopup";
import { Input, Tabs } from "antd";
import { TooltipCellOrFirstObject } from "../../../components/ui/TooltipCell";
import LottieLoader from "../../../components/ui/LottieUnique/LottieLoader";
import { DeviceInfoCard } from "../../../components/ui/DeviceInfoCard";
import ChatHistory from "../../../components/ui/ChatHistory";
import { PreviewImage } from "../../../components/ui/PreviewImage";
import CaseLogs from "./CaseLogs";
import useCaseStore from "../../../store/Case/useCaseStore";
import { Card } from "../../../components/ui/Card";
import CaseVerificationPending from "../../../components/ui/CaseVerificationPending";
import { FaCheck } from "react-icons/fa";
import { LocationInfoCard } from "../../../components/ui/LocationInfoCard";
import ImageLoader from "../../../components/ui/ImageLoader";
import { getInitial } from "../../../utils";
import { formatDateTime } from "../../../utils";
import { useHeaderStore } from "../../../store/Header/useHeaderStore";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import DownloadButton from "./DownloadButton";
import ViewLocationMap from "../../../components/ui/ViewLocationMap";

const { TextArea } = Input;

const KYCVerificationReport = () => {
    const STATUS_CONFIG = {
        pending: {
            label: "Pending",

            className: "bg-[#F79009] rounded-[30px] text-pending text-white text-lowercase",

            icon: (
                <span className="w-2 h-2 bg-[#F79009] border-2 border-white box-border rounded-full"></span>
            ),
        },
        approved: {
            label: "APPROVED",
            className: "bg-emerald-50 text-emerald-700",
            icon: <CheckCircle />,
        },
        agent_approved: {
            label: "AGENT APPROVED",
            className: "bg-blue-50 text-blue-700",
            icon: <CheckCircle />,
        },
        auditor_approved: {
            label: "AUDITOR APPROVED",
            className: "bg-purple-50 text-purple-700",
            icon: <CheckCircle />,
        },
        rejected: {
            label: "REJECTED",
            className: "bg-red-3 text-red-12",
            icon: <CircleX />,
        },
    };
    const { caseId } = useParams();
    const { setHeader, clearHeader } = useHeaderStore();

    const {
        getCaseReport,
        reportDetail,
        sendStatus,
        btnLoading,
        isLoading,
        setRedirectionPending,
        isSummaryVerificationPending,
        CaseReportDownload,
    } = useCaseStore();

    const reviewStatus = reportDetail?.reviewStatus ?? "pending";

    const [intentStatus, setIntentStatus] = useState(null);

    const status = reviewStatus;

    const currentStatus = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

    const [clickedReason, setClickedReason] = useState("");

    const [disableModalPopup, setDisableModalPopup] = useState(false);
    const [logsOpen, setLogsOpen] = useState(false);

    useEffect(() => {
        if (caseId) {
            setRedirectionPending(false);
            getCaseReport(caseId);
        }
    }, [caseId, getCaseReport]);

    const handleClose = () => {
        setDisableModalPopup(false);
    };

    const handleOpen = (nextStatus) => {
        setIntentStatus(nextStatus);
        setDisableModalPopup(true);
    };

    const handleOpenLogs = () => {
        setLogsOpen(true);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const openStageModal = () => {
        setIsModalOpen(true);
    };

    const openCustomerReviewModal = () => {
        setIsCustomerModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsCustomerModalOpen(false);
    };
    const { entity } = reportDetail;

    const reviewStages = reportDetail?.reviewStages || {};
    const hasReviewStages = Object.keys(reviewStages)?.length > 0;

    const customerreviewStages = reportDetail?.agentReview || {};
    const hasCustomerReviewStages = Object.keys(customerreviewStages)?.length > 0;

    const steps = Object.entries(reportDetail?.reviewStages || {}).map(([role, value]) => ({
        key: role,
        title: `${role.charAt(0).toUpperCase() + role.slice(1)} Review`,
        decision: value?.agentDecision || value?.auditorDecision || value?.checkerDecision,
        name:
            value?.agentDetails?.name || value?.auditorDetails?.name || value?.checkerDetails?.name,
        comment: value?.comments,
        date: value?.decisionedAt,
    }));

    const handleDownloadPdf = async () => {
        await CaseReportDownload(caseId);
    };

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    {reportDetail?.isUserApprovalLegit && (
                        <>
                            <div>
                                <PrimaryButton
                                    label={"Approve"}
                                    onNotify={() => handleOpen("approved")}
                                    // iconLeft={"cancelIcon"}
                                />
                            </div>

                            <div>
                                <SecondaryButton
                                    label={"Reject"}
                                    onNotify={() => handleOpen("rejected")}
                                    iconLeft={"cancelIcon"}
                                />
                            </div>
                        </>
                    )}

                    <SecondaryButton label={" Case Activity"} onNotify={() => handleOpenLogs()} />

                    <div>
                        <DownloadButton handleDownloadPdf={handleDownloadPdf} load={btnLoading} />
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, reportDetail, status, btnLoading]);

    const onSubmit = async () => {
        const payloadData = {
            status: intentStatus,
            reason: clickedReason,
        };

        const response = await sendStatus(payloadData, caseId);

        if (response?.success) {
            getCaseReport(caseId);
            setDisableModalPopup(false);
            setClickedReason("");
            setIntentStatus(null);
        }
    };

    const handleOnchange = (e) => {
        setClickedReason(e.target.value);
    };

    const getScoreColor = (percentage = 0) => {
        if (percentage < 50) return "text-[#F04438]";
        if (percentage < 75) return "text-orange-500";
        return "text-[#18667C]";
    };

    const getScoreTextColor = (percentage = 0) => {
        if (percentage < 50) return "!text-[#F04438] !text-[16px] !border-[#F04438]";
        if (percentage < 75) return "text-orange-500 text-[16px] !border-orange-500";
        return "text-[#17B26A] text-[16px] !border-[#17B26A]";
    };

    if (isSummaryVerificationPending) {
        return <CaseVerificationPending caseId={caseId} />;
    }

    const { TabPane } = Tabs;

    const uploadedSelfie = reportDetail?.verificationResult?.faceVerificationResult?.uploadedSelfie;
    const aadhaarPhoto = reportDetail?.verificationResult?.faceVerificationResult?.digilockerPhoto;

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

    const reportSections = reportDetail?.deviceInfo?.agentDeviceInfo?.gpsLocation;

    return isLoading ? (
        <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
    ) : (
        <>
            <div className="min-h-screen">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="shadow-sm bg-linear-to-b from-[#18667C] to-[#135263] p-2 rounded-[14px]">
                                <ImageLoader imageKey="CaseIcon" />
                            </div>

                            <div className="text-[18px] font-semibold text-[#6A7174]">
                                Case ID_<span className="text-primary-black-15!">{caseId}</span>
                            </div>

                            <span
                                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ${currentStatus?.className}`}
                            >
                                {currentStatus?.icon}
                                {currentStatus?.label}
                            </span>
                            {hasReviewStages && (
                                <Button onClick={openStageModal}>View Review Stages</Button>
                            )}

                            {hasCustomerReviewStages && (
                                <Button onClick={openCustomerReviewModal}>Customer Review</Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between bg-white rounded-2xl p-4 mt-7 border border-[#CDD0D1] gap-4">
                    {" "}
                    <div>
                        <div className="flex gap-3">
                            <div className="">
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <ImageLoader imageKey="CaseScoreIcon" />
                                    </div>
                                    <div className="py-4">
                                        <h2 className="text-[#16262B] text-[16px] max-[500px]:text-[14px]">
                                            Overall Verification Score
                                        </h2>
                                        <p className="text-[#9CA1A2] text-[12px] max-[500px]:text-[10px]">
                                            AI-Powered Verification Analysis
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p
                                        className={`text-3xl font-bold mb-3 max-[500px]:text-[17px] ${getScoreColor(
                                            reportDetail?.verificationResult?.finalPercentage
                                        )}`}
                                    >
                                        {reportDetail?.verificationResult?.finalPercentage ?? 0}%
                                    </p>

                                    <p
                                        className={`flex items-center  gap-2 ${getScoreTextColor(reportDetail?.verificationResult?.finalPercentage)}`}
                                    >
                                        <FaCheck className="border! bg-white rounded-full p-1" />
                                        <span className="max-[500px]:text-[13px] capitalize">
                                            {`${reportDetail?.verificationResult?.confidence?.toLowerCase()} Confidence Score`}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {!reportDetail?.verificationResult?.faceVerificationResult?.matchResult
                                ?.matchScore && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {faceMatchImages?.map(({ key, label, image }) => (
                                        <div
                                            key={key}
                                            className="border border-gray-200 rounded-xl bg-white p-3 shadow-sm h-40 w-full sm:w-48"
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
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-7">
                            <div className="bg-[#F9FAFB] rounded-xl p-3">
                                <span className="flex items-center gap-2 text-[#9CA1A2] text-[14px] max-[500px]:text-[13px]">
                                    <ImageLoader imageKey="CreatedIcon" /> Created At
                                </span>
                                <p className="text-[#0B1C20] text-[16px] pt-3 max-[500px]:text-[11px]">
                                    {showDateTime(reportDetail?.createdAt || "-")}
                                </p>
                            </div>
                            <div className="bg-[#F9FAFB] rounded-xl p-3">
                                <span className="flex items-center gap-2 text-[#9CA1A2] text-[14px] max-[500px]:text-[13px]">
                                    <ImageLoader imageKey="CreatedIcon" /> Verification Date
                                </span>
                                <p className="text-[#0B1C20] text-[16px] pt-3 max-[500px]:text-[11px]">
                                    {reportDetail?.scheduledDateTime
                                        ? showDateTime(reportDetail?.scheduledDateTime || "-")
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${
                            entity === "partnership" ? "lg:grid-cols-3" : "lg:grid-cols-5"
                        } gap-4`}
                    >
                        <div className="flex gap-4">
                            <div>
                                {entity === "individual" && aadhaarPhoto && (
                                    <div className="bg-[#F9FAFB] border border-[#D1E0E5] rounded-xl p-5 w-[321px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <ImageLoader imageKey="ScoreContainerIcons" />
                                            <ImageLoader imageKey="ScoreTickIcons" />
                                        </div>
                                        <p className="text-[24px] text-[#18667C] flex items-center gap-3">
                                            {reportDetail?.verificationResult?.faceVerificationResult?.matchResult?.overallPercentage?.toFixed(
                                                2
                                            ) || 0}
                                            %
                                            <span className="text-[#6A7174]! text-[14px]! font-normal">
                                                Face Match
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                {reportDetail?.verificationResult?.aadharVerificationResult &&
                                    Object.keys(
                                        reportDetail?.verificationResult?.aadharVerificationResult
                                    ).length > 0 && (
                                        <div className="bg-[#F9FAFB] border border-[#D1E0E5] rounded-xl p-5 w-[321px]">
                                            <div className="flex items-center justify-between mb-2">
                                                <ImageLoader imageKey="AadhaarScoreIcon" />
                                                <ImageLoader imageKey="ScoreTickIcons" />
                                            </div>
                                            <p className="text-[24px] text-[#18667C] flex items-center gap-3">
                                                {reportDetail?.verificationResult?.aadharVerificationResult?.matchResult?.overallPercentage?.toFixed(
                                                    2
                                                ) || 0}
                                                %
                                                <span className="text-[#6A7174]! text-[14px]! font-normal">
                                                    Aadhaar
                                                </span>
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-5">
                            {/* pan */}
                            {reportDetail?.verificationResult?.panVerificationResult &&
                                Object.keys(reportDetail.verificationResult.panVerificationResult)
                                    .length > 0 && (
                                    <div className="bg-[#F9FAFB] border border-[#D1E0E5] rounded-xl p-5 w-[321px] max-[500px]:w-auto">
                                        <div className="flex items-center justify-between mb-2">
                                            <ImageLoader imageKey="PanScoreIcon" />
                                            <ImageLoader imageKey="ScoreTickIcons" />
                                        </div>

                                        <p className="text-[24px] text-[#18667C] flex items-center gap-3 max-[500px]:text-[17px]">
                                            {reportDetail.verificationResult.panVerificationResult?.matchResult?.overallPercentage?.toFixed(
                                                2
                                            ) ?? 0}
                                            %
                                            <span className="text-[#6A7174] text-[14px] font-normal">
                                                PAN Verification
                                            </span>
                                        </p>
                                    </div>
                                )}
                            <div className="bg-[#F9FAFB] border border-[#D1E0E5] rounded-xl p-5 w-[321px] max-[500px]:w-auto">
                                <div className="flex items-center justify-between mb-2">
                                    <ImageLoader imageKey="CallScoreIcon" />
                                </div>
                                <p className="text-[24px] text-[#18667C] flex items-center gap-3 max-[500px]:text-[17px]">
                                    {formatDuration(reportDetail?.callInfo?.duration?.durationMs)}
                                    <span className="text-[#6A7174]! text-[14px]! font-normal">
                                        Call Duration
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-5">
                    <Tabs defaultActiveKey="1" className="custom-tabs">
                        <TabPane
                            tab={
                                <span className="flex items-center gap-2">
                                    <ImageLoader imageKey="CaseOverviewIcon" />
                                    Overview
                                </span>
                            }
                            key="1"
                        >
                            <div className="grid grid-cols-1! md:grid-cols-2! gap-5 items-stretch">
                                <div className="bg-white rounded-xl border border-[#CDD0D1] p-6 md:p-6 mt-5">
                                    <div className="flex items-center gap-3 mb-6 border-b border-[#CDD0D1] pb-2">
                                        <div>
                                            <ImageLoader imageKey="CustomerInfoIcons" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                            Customer Info
                                        </h2>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Full Name
                                                </label>
                                                <p className="text-gray-900 font-semibold capitalize">
                                                    {checkValue(reportDetail?.customerInfo?.name)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Phone Number
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {reportDetail?.customerInfo?.phone?.number
                                                        ? `${reportDetail.customerInfo.phone.countryCode || ""} ${reportDetail.customerInfo.phone.number || ""}`.trim()
                                                        : "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Date of Birth
                                                </label>
                                                <TooltipCellOrFirstObject
                                                    device={reportDetail?.customerInfo}
                                                    field="dateOfBirth"
                                                    from="date"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Entity Type
                                                </label>
                                                <p className="text-gray-900 font-semibold capitalize">
                                                    {checkValue(
                                                        removeUnderScore(reportDetail?.entity)
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    PAN Number
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {checkValue(reportDetail?.customerInfo?.pan)}
                                                </p>
                                            </div>

                                            {/* <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Aadhaar Number
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {checkValue(reportDetail?.customerInfo?.aadhar)}
                                                </p>
                                            </div> */}

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Address
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {checkValue(
                                                        reportDetail?.customerInfo?.address
                                                    )}
                                                </p>
                                            </div>

                                            {/* <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Postal Code
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {reportDetail?.deviceInfo?.customerDeviceInfo
                                                        ?.gpsLocation?.postalCode || "-"}
                                                </p>
                                            </div> */}

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] block">
                                                    Primary Language
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {checkValue(reportDetail?.languages?.primary)}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] block">
                                                    Secondary Language
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {reportDetail?.languages?.secondary?.length
                                                        ? reportDetail.languages.secondary.join(
                                                              ", "
                                                          )
                                                        : "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-[#6A7174] text-[12px] block">
                                                    Appointment Date & time
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {reportDetail?.scheduledDateTime
                                                        ? showDateTime(
                                                              reportDetail?.scheduledDateTime
                                                          )
                                                        : "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-[#6A7174] text-[12px] mb-1 block">
                                                    Email Address
                                                </label>
                                                <p className="text-gray-900 font-semibold">
                                                    {checkValue(reportDetail?.customerInfo?.email)}
                                                </p>
                                            </div>
                                        </div>

                                        {entity === "partnership" && (
                                            <div className="flex flex-col items-center">
                                                <label className="text-gray-500 text-sm mb-2 block text-center">
                                                    Live Selfie
                                                </label>

                                                <div className="w-44 h-44 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                                    <PreviewImage
                                                        src={
                                                            reportDetail?.verificationResult
                                                                ?.faceVerificationResult
                                                                ?.uploadedSelfie
                                                        }
                                                        containerClass="w-full h-full"
                                                        imageClass="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-[#CDD0D1] p-6 md:p-6 mt-5">
                                    <div className="flex items-center gap-3 border-b border-[#CDD0D1] pb-2 mb-6">
                                        <div>
                                            <ImageLoader imageKey="AgentInfoIcons" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                            Agent Info
                                        </h2>
                                    </div>

                                    <div className="pb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-linear-to-b from-[#18667C] to-[#135263] text-white rounded-full w-[50px] h-[50px] flex items-center justify-center text-[18px]!">
                                                {getInitial(reportDetail?.agentInfo?.name, "first")}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium! text-[#16262B]! capitalize mb-0!">
                                                    {reportDetail?.agentInfo?.name || "-"}
                                                </h3>
                                                <p className="text-[#6A7174] text-sm font-medium">
                                                    Agent ID:{" "}
                                                    <span className="text-[#16262B]!">
                                                        {reportDetail?.agentInfo?.id || "-"}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-[#F3F3F3] rounded-lg px-3 py-4 mt-4">
                                            <p className="text-[#6A7174] text-[12px] uppercase">
                                                Email Address:
                                                <span className="lowercase text-[#16262B]! text-sm font-medium ml-1">
                                                    {reportDetail?.agentInfo?.email}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="border border-[#CDD0D1] bg-[#F9FAFB] rounded-lg mt-5 p-3">
                                            <div className="flex justify-between gap-5 mb-3">
                                                <div className="flex items-center gap-2 text-[#468596] text-[12px]">
                                                    <ImageLoader imageKey="CallStartIcon" />
                                                    Call Started
                                                </div>
                                                <div className="text-[12px] text-[#0B1C20]">
                                                    {formatDateTime(
                                                        reportDetail?.callInfo?.startTime || "-"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between gap-5">
                                                <div className="flex items-center gap-2 text-[#F97066] text-[12px]">
                                                    <ImageLoader imageKey="CallEndIcon" />
                                                    Call Ended
                                                </div>
                                                <div className="text-[12px] text-[#0B1C20]">
                                                    {formatDateTime(
                                                        reportDetail?.callInfo?.endTime || "-"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch mt-4">
                                <div className="lg:col-span-1 bg-white rounded-xl border border-[#CDD0D1] p-6 md:p-6 mb-5">
                                    <div className="flex items-center gap-3 mb-6 border-b border-[#CDD0D1] pb-2">
                                        <div>
                                            <ImageLoader imageKey="DeviceInfoIcon" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                            Customer Device Information
                                        </h2>
                                    </div>
                                    <div className="mb-6 mt-6">
                                        {/* <DeviceInfoCard
                                            deviceInfo={reportDetail.deviceInfo?.agentDeviceInfo}
                                            
                                            mode="report"
                                        /> */}
                                        <DeviceInfoCard
                                            deviceInfo={reportDetail.deviceInfo?.customerDeviceInfo}
                                            mode="report"
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-1 rounded-xl border border-[#CDD0D1] p-6 md:p-6 mb-5">
                                    <div className="flex items-center gap-3 mb-6 border-b border-[#CDD0D1] pb-2">
                                        <div>
                                            <ImageLoader imageKey="LocationIcons" />
                                        </div>
                                        <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                            Location
                                        </h2>
                                    </div>
                                    <div className="">
                                        <div className="">
                                            {/* <LocationInfoCard
                                                deviceInfo={
                                                    reportDetail?.deviceInfo?.agentDeviceInfo
                                                }
                                                mode="report"
                                            /> */}
                                            <LocationInfoCard
                                                deviceInfo={
                                                    reportDetail?.deviceInfo?.customerDeviceInfo
                                                }
                                                mode="report"
                                            />
                                            <ViewLocationMap
                                                lat={reportSections?.lat}
                                                lng={reportSections?.lng}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center gap-2">
                                    <ImageLoader imageKey="CaseVerifyIcon" />
                                    Verification Checks
                                </span>
                            }
                            key="2"
                        >
                            <div className="border border-[#CDD0D1] rounded-xl">
                                <ChatHistory messages={reportDetail?.chatHistory} />

                                <VerificationChecks
                                    verification={reportDetail?.verificationResult}
                                    others={reportDetail?.otherFiles}
                                />
                            </div>
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center gap-2">
                                    <ImageLoader imageKey="CaseFrameIcon" />
                                    Media
                                </span>
                            }
                            key="3"
                        >
                            <div>
                                <div className="space-y-6 mt-6">
                                    {/* <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2 max-[500px]:text-[16px]">
                                            Media Evidence
                                        </h1>
                                        <div className="h-px bg-gray-200" />
                                    </div> */}

                                    <div className="border border-gray-200 p-6 space-y-6 rounded-2xl">
                                        <h2 className="text-2xl font-semibold text-gray-900 max-[500px]:text-[14px]">
                                            Full Video Recording
                                        </h2>

                                        <div className="w-full max-w-4xl mx-auto">
                                            <div className="aspect-4/3 bg-black rounded-2xl overflow-hidden">
                                                <video
                                                    src={reportDetail?.caseRecording}
                                                    controls
                                                    preload="metadata"
                                                    playsInline
                                                    className="w-full h-full object-contain"
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane
                            tab={
                                <span className="flex items-center gap-2">
                                    <ImageLoader imageKey="CaseActivityIcon" />
                                    Case Activity
                                </span>
                            }
                            key="4"
                        >
                            <div>
                                <div>
                                    <div className="lg:col-span-1 md:grid-cols-2! bg-white rounded-xl border border-[#CDD0D1] p-6 md:p-6 my-5">
                                        <div className="flex items-center gap-3 mb-6 border-b border-[#CDD0D1] pb-2">
                                            <div>
                                                <ImageLoader imageKey="CustomerInfoIcons" />
                                            </div>
                                            <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                                Case Information
                                            </h2>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Primary Language
                                                    </label>
                                                    <p className="text-gray-900 font-semibold capitalize">
                                                        {reportDetail?.languages?.primary || "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Secondary Language
                                                    </label>
                                                    <p className="text-gray-900 font-semibold">
                                                        {reportDetail?.languages?.secondary?.length
                                                            ? reportDetail.languages.secondary.join(
                                                                  ", "
                                                              )
                                                            : "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Scheduled DateTime
                                                    </label>
                                                    <p className="text-gray-900 font-semibold">
                                                        <TooltipCellOrFirstObject
                                                            device={reportDetail}
                                                            field="scheduledDateTime"
                                                            from="time"
                                                        />
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Call Started
                                                    </label>
                                                    <TooltipCellOrFirstObject
                                                        device={reportDetail?.callInfo}
                                                        field="startTime"
                                                        from="time"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Call Ended
                                                    </label>
                                                    <p className="text-gray-900 font-semibold">
                                                        <TooltipCellOrFirstObject
                                                            device={reportDetail?.callInfo}
                                                            field="endTime"
                                                            from="time"
                                                        />
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Customer waiting time
                                                    </label>
                                                    <p className="text-gray-900 font-semibold">
                                                        {
                                                            reportDetail?.callInfo?.waitingTime
                                                                ?.customerDurationText
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Agent waiting time
                                                    </label>
                                                    <p className="text-gray-900 font-semibold">
                                                        {
                                                            reportDetail?.callInfo?.waitingTime
                                                                ?.agentDurationText
                                                        }
                                                    </p>
                                                </div>
                                                {/* <div>
                                    <label className="text-gray-500 text-sm mb-1 block">
                                        Aadhaar Number
                                    </label>
                                    <p className="text-gray-900 font-semibold">
                                        {reportDetail?.customerInfo?.aadhar || "-"}
                                    </p>
                                </div> */}
                                                <div>
                                                    <label className="text-gray-500 text-sm mb-1 block">
                                                        Customer Return URL
                                                    </label>
                                                    <p className="text-gray-900 font-semibold">
                                                        {reportDetail?.returnUrl || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2! gap-5 items-stretch">
                                    <div className="lg:col-span-1 bg-white rounded-xl border border-[#CDD0D1] p-6 md:p-6 my-5">
                                        <div className="flex items-center gap-3 mb-6 border-b border-[#CDD0D1] pb-2">
                                            <div>
                                                <ImageLoader imageKey="DeviceInfoIcon" />
                                            </div>
                                            <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                                Agent Device Information
                                            </h2>
                                        </div>
                                        <div className="mb-6 mt-6">
                                            <DeviceInfoCard
                                                deviceInfo={
                                                    reportDetail.deviceInfo?.agentDeviceInfo
                                                }
                                                mode="report"
                                            />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-1 rounded-xl border border-[#CDD0D1] p-6 md:p-6 my-5 ">
                                        <div className="flex items-center gap-3 mb-6 border-b border-[#CDD0D1] pb-2">
                                            <div>
                                                <ImageLoader imageKey="LocationIcons" />
                                            </div>
                                            <h2 className="text-xl font-bold text-[#101828] max-[500px]:text-[15px]">
                                                Location
                                            </h2>
                                        </div>
                                        <div className="">
                                            <div className="">
                                                <LocationInfoCard
                                                    deviceInfo={
                                                        reportDetail?.deviceInfo?.agentDeviceInfo
                                                    }
                                                    mode="report"
                                                />
                                                <ViewLocationMap
                                                    lat={reportSections?.lat}
                                                    lng={reportSections?.lng}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            <ModalPopUp open={disableModalPopup} onCancel={handleClose}>
                <div className="">
                    <p className="text-[#0F172B] font-bold text-lg mb-[9px]">
                        {intentStatus === "approved" ? "Approve" : "Reject"} based verification
                        report?
                    </p>

                    <p className="text-[#45556C] text-sm mb-[17px]">
                        Are you sure you want to{" "}
                        {intentStatus === "approved" ? "approve" : "reject"} this report?
                    </p>

                    <div>
                        <TextArea
                            rows={5}
                            placeholder="Enter the reason"
                            value={clickedReason}
                            onChange={handleOnchange}
                            style={{ resize: "none" }}
                        />
                    </div>

                    <div className="flex justify-end mt-5">
                        <Button type="default" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            className="ml-2!"
                            onClick={onSubmit}
                            disabled={btnLoading}
                            loading={btnLoading}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </ModalPopUp>
            {isModalOpen && (
                <Modal
                    title="Review Workflow"
                    open={isModalOpen}
                    onCancel={closeModal}
                    footer={null}
                    centered
                    width={600}
                >
                    <div className="space-y-6">
                        {steps && steps.filter((s) => s.key !== "agent").length > 0 ? (
                            steps
                                .filter((s) => s.key !== "agent")
                                .map((s, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        {/* Status Dot */}
                                        <div
                                            className={`mt-2 w-3 h-3 rounded-full ${
                                                s.decision === "approved"
                                                    ? "bg-green-500"
                                                    : s.decision === "rejected"
                                                      ? "bg-red-500"
                                                      : "bg-yellow-500"
                                            }`}
                                        />

                                        {/* Content */}
                                        <div className="flex-1 border-b pb-4 last:border-b-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold text-gray-800">
                                                    {s.title}
                                                </h4>

                                                <Tag
                                                    color={
                                                        s.decision === "approved"
                                                            ? "green"
                                                            : s.decision === "rejected"
                                                              ? "red"
                                                              : "gold"
                                                    }
                                                >
                                                    {s.decision?.toUpperCase()}
                                                </Tag>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1">
                                                Reviewed by:{" "}
                                                <span className="font-medium capitalize">
                                                    {s.name}
                                                </span>
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1 capitalize">
                                                {s.comment || "No comments provided"}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-2">
                                                {s.date ? new Date(s.date).toLocaleString() : "—"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="text-center text-gray-500 py-6">No data found</p>
                        )}
                    </div>
                </Modal>
            )}

            {isCustomerModalOpen && (
                <Modal
                    title="Customer Review"
                    open={isCustomerModalOpen}
                    onCancel={closeModal}
                    footer={null}
                    centered
                    width={600}
                >
                    <div className="space-y-6">
                        {reportDetail?.agentReview?.comments ? (
                            <div>
                                <div className="flex justify-center mb-4">
                                    <Rate value={reportDetail?.agentReview?.rating} disabled />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 capitalize">
                                        {reportDetail?.agentReview?.comments}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-6">No data found</p>
                        )}
                    </div>
                </Modal>
            )}
            {logsOpen && (
                <CaseLogs
                    open={logsOpen}
                    onClose={() => setLogsOpen(false)}
                    items={reportDetail?.caseLogs || []}
                />
            )}
        </>
    );
};
export default KYCVerificationReport;
