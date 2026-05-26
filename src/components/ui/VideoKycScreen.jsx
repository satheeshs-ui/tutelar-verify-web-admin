import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ImageLoader from "./ImageLoader";
import useWebRTC from "../hooks/useWebRTC";
import UseRefreshProtection from "./UseRefreshProtection";
import { useParams } from "react-router-dom";
import { useBucketStore } from "../../store/bucket.store";
import DocumentVerificationScreen from "./DocumentVerificationScreen";
import useLoginStore from "../../store/Login/useLoginStore";
import { showFailure } from "../../utils";
import constants from "../../utils/config";
import { useAppStore } from "../../store/app.store";
import { useNavigate } from "react-router-dom";
import VideoKycChatUI from "./VideoKycChatScreen";
import { MessageCircle, MessageCircleOff } from "lucide-react";
import SessionExpired from "./SessionExpired";
import PermissionDeniedModal from "./PermissionDeniedModal";
import SessionTimer from "./SessionTimer";
import AgentScheduleModal from "./Modal/AgentScheduleModal";
import useAgentStore from "../../store/Case/useCaseStore";
import LottieLoader from "./LottieUnique/LottieLoader";
export default function VideoKycScreen() {
    const { caseId } = useParams();
    const { clickedCustomerName } = useBucketStore();
    const [cutCallModal, setCutCallModal] = useState(false);
    const [cutCallConfirmModal, setCutCallConfirmModal] = useState(false);
    const { userDetails } = useAppStore().userDetails || {};
    const {
        caseCompletedStatus,
        sessionExpired,
        sessionTime,
        attendCase,
        caseDetails,
        redirectionPending,
        // updateUser,
    } = useAgentStore();
    const { scheduledDateTime } = caseDetails;
    const [isSchedulePending, setIsSchedulePending] = useState(false);

    useEffect(() => {
        if (!scheduledDateTime) return;

        const scheduledTime = new Date(scheduledDateTime);
        const now = new Date();

        if (now < scheduledTime) {
            setIsSchedulePending(true);

            const timeout = scheduledTime.getTime() - now.getTime();

            const timer = setTimeout(() => {
                setIsSchedulePending(false);
                window.location.reload();
            }, timeout);

            return () => clearTimeout(timer);
        } else {
            setIsSchedulePending(false);
        }
    }, [scheduledDateTime]);

    const [maximized, setMaximized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const {
        localVideoRef,
        remoteVideoRef,
        micOn,
        camOn,
        connected,
        toggleMic,
        toggleCamera,
        endCall,
        peerStatus,
        startCall,
        // ready,
        screenRef,
        remoteAudioRef,
        //  isRecording,
        // endingCall,
        agentDisconnect,
        permissionDenied,
        connectionError,
    } = useWebRTC({
        caseId,
        role: "agent",
        agentId:
            userDetails?.userDetails?.role === "agent" ? userDetails?.userDetails?.userId : null,
    });

    const { showModal, setShowModal, confirmRefresh, disableProtection } = UseRefreshProtection(
        () => {
            // startCall();
            endCall();
        }
    );

    const endCallRef = useRef(endCall);

    useLayoutEffect(() => {
        if (!caseId) return;
        const agentAttendCase = async () => {
            await attendCase(caseId);
        };

        agentAttendCase();
    }, [caseId]);

    useEffect(() => {
        disableProtection();
    }, [connectionError]);

    useEffect(() => {
        endCallRef.current = endCall;
        setCutCallConfirmModal(false);
    }, [endCall]);

    useEffect(() => {
        if (peerStatus === "ended") {
            setCutCallConfirmModal(false);
        }
    }, [peerStatus]);

    const circleColor = "#1F2937";

    const initial = useMemo(
        () => clickedCustomerName?.charAt(0).toUpperCase() || "U",
        [clickedCustomerName]
    );

    const canvasToFile = (canvas, fileName) => {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const file = new File([blob], fileName, { type: "image/png" });
                resolve(file);
            }, "image/png");
        });
    };

    const getFileType = (type) => {
        if (!type) return "";

        return type.toUpperCase();
    };

    const getCaptureData = async (action, nextStatus, setCaptureDocs) => {
        try {
            const video = remoteVideoRef?.current;

            const fileType = action;
            if (!video || !video.videoWidth) {
                alert("Video stream not ready");
                return;
            }
            await setCaptureDocs((prev) => ({
                ...prev,
                [action]: {
                    ...prev[action],
                    status: "In progress...",
                },
            }));

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (!videoWidth || !videoHeight) {
                throw new Error("Video not ready");
            }

            canvas.width = videoWidth;
            canvas.height = videoHeight;

            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

            const fileName = `${action}_${Date.now()}.png`;
            const file = await canvasToFile(canvas, fileName);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileType", fileType);
            const token = useLoginStore.getState().loginDetails?.data?.accessToken;
            const caseToken = sessionStorage.getItem("caseToken");
            const res = await fetch(`${constants.BASE_URL}/video-kyc/file/save/${caseId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-case-token": caseToken,
                },
                body: formData,
            });

            const json = await res.json();

            if (json.success) {
                await setCaptureDocs((prev) => ({
                    ...prev,
                    [action]: {
                        ...prev[action],
                        status: nextStatus === "verified" ? "pending" : "verified",
                        file: json?.data,
                    },
                }));
            } else {
                const messageCode = json?.messageCode;

                await setCaptureDocs((prev) => ({
                    ...prev,
                    [action]: {
                        ...prev[action],
                        status: "pending",
                    },
                }));
                if (messageCode == "C1017") {
                    window.location.href = "/access-forbidden";
                    return;
                } else {
                    showFailure(json.message);
                }
            }
        } catch (error) {
            console.error("Capture error:", error);
        }
    };

    const handledisconnectCall = () => {
        setCutCallModal(true);
    };

    const handlecallConfirm = async () => {
        const res = await caseCompletedStatus(caseId, () => {});

        if (!res.success) {
            endCall(res);

            return;
        }

        if (
            !res.success &&
            (peerStatus === "Customer disconnected" ||
                (peerStatus === "Call disconnected" && !res?.success))
        ) {
            endCall(res);
        } else if (res?.success) {
            setCutCallModal(false);
            endCall(res);
        } else {
            setCutCallConfirmModal(true);
            setCutCallModal(false);
        }
    };

    const handlecallDisconnect = async () => {
        agentDisconnect();
        setCutCallConfirmModal(false);
        //confirmRefresh();
        navigate("/case-bucket");
    };
    const showConnectionStatus = (peerStatus) => {
        switch (peerStatus) {
            case "waiting":
                return { text: "Connect to Customer…", color: "orange" };
            case "joined":
                return { text: "Customer available to connect", color: "#00FF65" };
            case "disconnected":
                return { text: "Customer disconnected", color: "red" };
            case "connected":
                return { text: "Connected", color: "#00FF65" };
            case "Customer disconnected":
                return { text: "Customer not available", color: "red" };
            case "Call disconnected":
                return { text: "Call disconnected", color: "red" };
            default:
                return { text: null, color: "" };
        }
    };
    const { text, color } = showConnectionStatus(peerStatus);
    const toggleChat = () => {
        setMaximized(!maximized);
    };

    if (redirectionPending) {
        return <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-screen overflow-hidden bg-[#FFFFFF]!">
            <div className="col-span-12 lg:col-span-8 h-screen flex flex-col overflow-hidden">
                <div className="px-5 pt-5 shrink-0" ref={screenRef}>
                    <div className={`relative w-full h-full! rounded-3xl bg-[#081F24]! `}>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl lg:h-[55vh] object-cover"
                        />
                        <audio ref={remoteAudioRef} autoPlay playsInline></audio>

                        <div className="absolute  top-4 right-4 w-44 h-28 rounded-xl overflow-hidden border border-white/20 backdrop-blur-sm">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            {!camOn && (
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md py-1 px-2.5 rounded-full text-white text-xl font-bold shadow-lg text-center"
                                    style={{ backgroundColor: circleColor }}
                                >
                                    {initial}
                                </div>
                            )}

                            {connected && (
                                <div className="absolute top-1 right-1 text-xs px-2 py-1 rounded-full flex items-center justify-center text-white! drop-shadow bg-black/50 ">
                                    <p className="w-2! h-2! bg-red-500! rounded mr-2 mb-0!"></p>
                                    <p className="mb-0!">Rec</p>
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-6 flex justify-center items-center gap-5 w-full">
                            <div className="bg-[#00000080] py-4 px-6 flex items-center justify-center rounded-full shadow-lg gap-5">
                                <button
                                    onClick={toggleMic}
                                    disabled={!connected}
                                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center text-white
                                         ${micOn ? "bg-[#2C2C2E]" : "bg-red-600"} ${connected ? "hover:bg-white/30" : "opacity-40 cursor-not-allowed"}`}
                                >
                                    <ImageLoader imageKey={micOn ? "audioIcon" : "micOffIcon"} />
                                </button>

                                <button
                                    onClick={toggleCamera}
                                    disabled={!connected}
                                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center text-white
                                         ${camOn ? "bg-[#2C2C2E]" : "bg-red-600"} ${connected ? "hover:bg-white/30" : "opacity-40 cursor-not-allowed"}`}
                                >
                                    <ImageLoader imageKey={camOn ? "videoIcon" : "videoOffIcon"} />
                                </button>
                                <button
                                    onClick={toggleChat}
                                    className={`relative w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center text-white
                                        ${maximized ? "bg-[#2C2C2E]" : "bg-red-600"}
                                        hover:bg-white/30 transition-all duration-150`}
                                >
                                    {maximized ? (
                                        <MessageCircle className="w-6 h-6" />
                                    ) : (
                                        <MessageCircleOff className="w-6 h-6" />
                                    )}

                                    {!maximized && unreadCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px]
                                                px-1 text-xs rounded-full bg-red-500 text-white
                                                flex items-center justify-center"
                                        >
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {peerStatus === "connected" ||
                                peerStatus === "Call disconnected" ||
                                peerStatus === "Customer disconnected" ? (
                                    <>
                                        <button
                                            onClick={handledisconnectCall}
                                            className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700"
                                        >
                                            <ImageLoader imageKey={"phoneOnIcon"} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={startCall}
                                            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 cursor-pointer"
                                        >
                                            Start Call
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-4 left-4 p-2 text-white text-sm">
                            <p style={{ color }} className="font-semibold">
                                {text}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[#CDD0D1] h-0 mt-10 mx-4">
                    <DocumentVerificationScreen
                        getCaptureData={getCaptureData}
                        connected={connected}
                        getFileType={getFileType}
                        docs={true}
                    />
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-5 w-80 text-center">
                            <h3 className="font-semibold text-lg">Refresh Page?</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                If you refresh this page, the call will be disconnected.
                            </p>

                            <div className="flex justify-center gap-3 mt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmRefresh}
                                    className="px-4 py-2 bg-red-600 text-white! rounded"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {sessionExpired && <SessionExpired />}
                {sessionTime && <SessionTimer expiresAt={sessionTime} />}
                {permissionDenied.location && (
                    <PermissionDeniedModal
                        title="Location Access Required"
                        description="To continue Video KYC, location access is mandatory."
                        instructions={
                            <>
                                <ul className="text-left list-disc pl-5 space-y-1">
                                    <li>
                                        Click the <b>lock icon</b> in the address bar
                                    </li>
                                    <li>
                                        Set <b>Location</b> permission to <b>Allow</b>
                                    </li>
                                    <li>
                                        Click <b>Reload</b>
                                    </li>
                                </ul>
                            </>
                        }
                    />
                )}
                {permissionDenied.media && (
                    <PermissionDeniedModal
                        title="Camera & Microphone Access Required"
                        description="To continue Video KYC, media access is mandatory."
                        instructions={
                            <ul className="text-left list-disc pl-5 space-y-1">
                                <li>
                                    Click the <b>lock icon</b> in the address bar
                                </li>
                                <li>
                                    Allow <b>Camera</b> and <b>Microphone</b> access
                                </li>
                                <li>
                                    Click <b>Reload</b>
                                </li>
                            </ul>
                        }
                    />
                )}
                {cutCallModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-5 w-80 text-center">
                            <h3 className="font-semibold text-lg">End Video Call?</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                If you disconnect this call, it cannot be resumed. You will need to
                                start a new call to continue.
                            </p>

                            <div className="flex justify-center gap-3 mt-4">
                                <button
                                    onClick={() => setCutCallModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    // onClick={endCall}
                                    onClick={handlecallConfirm}
                                    className="px-4 py-2 bg-red-600 text-white! rounded"
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {cutCallConfirmModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-5 w-80 text-center">
                            <h3 className="font-semibold text-lg">Confirm End Video Call?</h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Once you disconnect, this call cannot be resumed. You must start a
                                new call to proceed. Customer file submission is incomplete.
                            </p>

                            <div className="flex justify-center gap-3 mt-4">
                                <button
                                    onClick={() => setCutCallConfirmModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handlecallDisconnect}
                                    className="px-4 py-2 bg-red-600 text-white! rounded"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="col-span-12 lg:col-span-4 h-full">
                <DocumentVerificationScreen
                    getCaptureData={getCaptureData}
                    connected={connected}
                    getFileType={getFileType}
                    docs={false}
                />
            </div>{" "}
            {isSchedulePending && (
                <AgentScheduleModal
                    open={isSchedulePending}
                    scheduledDateTime={scheduledDateTime}
                />
            )}
            <button
                onClick={() => setMaximized(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-b from-[#057E73] to-[#32889F] text-white shadow-lg flex items-center justify-center hover:scale-105 transition cursor-pointer"
            >
                <ImageLoader imageKey={"message"} className="w-6 h-6" />
                {!maximized && unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px]
                                                px-1 text-xs rounded-full bg-red-500 text-white
                                                flex items-center justify-center"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>
            <div className={`${maximized ? "w-[25%]" : ""} h-screen`}>
                <VideoKycChatUI
                    maximized={maximized}
                    setMaximized={setMaximized}
                    unreadCount={unreadCount}
                    setUnreadCount={setUnreadCount}
                />
            </div>
        </div>
    );
}
