import VideoKycScreen from "../../components/ui/VideoKycScreen";
import CallSuccessPage from "../CallSuccessPage";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CaseExpiredPage from "../CaseExpired";
import useCaseStore from "../../store/Case/useCaseStore";
import AlreadyConnect from "../../components/ui/Modal/AlreadyConnect";
import { stopCamera } from "../../utils";

const MeetScreen = () => {
    const { caseId } = useParams();
    const { caseDetails, getCaseDetails, errorCode, connectionError } = useCaseStore();

    const { caseStatus } = caseDetails;
    useEffect(() => {
        if (caseId && caseStatus !== "completed") {
            getCaseDetails(caseId);
        }
    }, [caseId, caseStatus, getCaseDetails]);

    if (
        connectionError?.messageCode == "C1019" ||
        connectionError?.messageCode == "C1022" ||
        connectionError?.messageCode == "C1023"
    ) {
        // 1022 - assigned agent must attend .
        // 1019 - Both agent and customer are already in the call. Please wait until they leave..
        // 1023 - already another agent is attending
        stopCamera(window.localStream);
        return <AlreadyConnect open={connectionError?.message} />;
    }

    return errorCode === 410 ? (
        <CaseExpiredPage />
    ) : caseStatus !== "completed" ? (
        <div className="overflow-scroll w-full h-screen">
            <VideoKycScreen />
        </div>
    ) : (
        <CallSuccessPage />
    );
};

export default MeetScreen;
