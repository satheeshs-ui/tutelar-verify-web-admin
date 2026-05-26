import ApiCall from "../../../config/api/axiosInstance";
import { cleanParams, showSuccess } from "../../../utils";

const CREATE_CASE = "video-kyc/case/create";
const CASE_LIST = "video-kyc/case/list";
const GET_CASE_DETAILS = "video-kyc/case/detail";
const CASE_REPORT = "video-kyc/case/report";
const ATTEND_CASE = "video-kyc/case/attend";
const STATUS_CASE_REPORT = "video-kyc/case/review";
const CASE_COMPLETED_STATUS = "video-kyc/case/complete-case";
const DOCUMENT_UPLOAD = "video-kyc/file/uploads";
const DEVICE_UPDATE = "video-kyc/case-device";
const FETCH_DEVICE = "video-kyc/case-device/detail";
const DEFAULT_SLOTS = "video-kyc/user/agent/default/slots";
const SELECT_SLOT = "video-kyc/user/agent/shift-available";
const AGENT_SLOT_LIST = "video-kyc/user/agent/slots";
const CASE_REPORT_PDF = "video-kyc/case/report/download";
const CaseService = (set) => {
    const handleWriteApi = async (apiCall, successMessage, callback) => {
        set({ btnLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ btnLoading: false });

            const msg =
                res?.message || res?.data?.message || successMessage || "Operation successful";
            showSuccess(msg);
            callback && callback(res);
            return res;
        } catch (error) {
            set({ btnLoading: false });
            throw error;
        }
    };

    const handleReadApi = async (apiCall) => {
        set({ isLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ isLoading: false, isSummaryVerificationPending: false });
            return res;
        } catch (error) {
            set({ isLoading: false });
            set({ reportDetail: {} });
            set({ errorCode: error?.response?.data?.errorCode || null });
            set({ connectionError: error?.response?.data });
            set({ isSummaryVerificationPending: error?.response?.data?.messageCode === "C1011" });
            throw error;
        }
    };

    const handleStatus = async (apiCall) => {
        set({ btnLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ btnLoading: false });

            return res.data;
        } catch (error) {
            set({ btnLoading: false });

            throw error;
        }
    };

    const caseCompletedStatusApi = async (apiCall, callback) => {
        set({ btnLoading: true, error: null, redirectionPending: true });

        try {
            const res = await apiCall();

            if (typeof callback === "function") {
                callback(res);
            }

            set({ btnLoading: false });

            return res;
        } catch (error) {
            if (typeof callback === "function") {
                callback(error);
            }

            set({ btnLoading: false, errorCode: error?.response?.data?.errorCode || null });

            return error?.response?.data;
        }
    };

    const handleReportDownloadApi = async (apiCall) => {
        set({ btnLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ btnLoading: false, isSummaryVerificationPending: false });
            return res;
        } catch (error) {
            set({ btnLoading: false });
            set({ reportDetail: {} });
            set({ errorCode: error?.response?.data?.errorCode || null });
            set({ connectionError: error?.response?.data });
            set({ isSummaryVerificationPending: error?.response?.data?.messageCode === "C1011" });
            throw error;
        }
    };

    return {
        sendStatus: (newData, caseId, callback) =>
            handleStatus(
                () => ApiCall.patch(`${STATUS_CASE_REPORT}/${caseId}`, newData),
                "",
                callback
            ),
        createCase: (newData, callback) =>
            handleWriteApi(
                () => ApiCall.post(CREATE_CASE, newData),
                "User created successfully",
                callback
            ),

        getCaseList: (params) =>
            handleReadApi(async () => {
                const cleanedParams = cleanParams(params);
                const res = await ApiCall.get(CASE_LIST, {
                    params: cleanedParams,
                });
                set({ caseList: res?.data?.data || [] });
                return res;
            }),
        attendCase: (caseId, callback = null) =>
            handleReadApi(async () => {
                const res = await ApiCall.put(`${ATTEND_CASE}/${caseId}`);
                set({ agentToken: res?.data?.data.agentToken || "" });
                sessionStorage.setItem("caseToken", res?.data?.data.agentToken);
                if (callback) callback(res);
                return res;
            }),

        getCaseDetails: (caseId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${GET_CASE_DETAILS}/${caseId}`);
                set({
                    caseDetails: res?.data?.data || {},
                    sessionTime: res?.data?.data?.expiresAt,
                });
                return res;
            }),

        getCaseReport: (caseId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${CASE_REPORT}/${caseId}`);
                set({ reportDetail: res?.data?.data || {} });
                return res;
            }),
        caseCompletedStatus: (caseId, callback) =>
            caseCompletedStatusApi(async () => {
                const res = await ApiCall.patch(`${CASE_COMPLETED_STATUS}/${caseId}`, {});
                if (callback) callback(res);

                set({ caseCompletedStatusData: res || {} });

                return res;
            }),

        getDocumentUpload: (caseId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${DOCUMENT_UPLOAD}/${caseId}`);
                set({ documentUpload: res?.data?.data || {} });
                return res;
            }),
        fetchCustomerDevice: (caseId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${FETCH_DEVICE}/customer/${caseId}`);
                set({ customerDevice: res?.data?.data || {} });
                return res;
            }),
        updateAgentDevice: (caseId, payload) =>
            handleReadApi(async () => {
                const res = await ApiCall.post(`${DEVICE_UPDATE}/agent/${caseId}`, payload);

                return res;
            }),

        getAgentSlotList: (agentId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${AGENT_SLOT_LIST}/${agentId}`);
                set({ agentSlotList: res?.data?.data || [] });
                return res;
            }),
        getDefaultSlotList: () =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${DEFAULT_SLOTS}`);
                set({ agentSlotList: res?.data?.data || [] });
                return res;
            }),
        getAvailableSlots: (agentId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${SELECT_SLOT}/${agentId}`);
                set({ availableSlots: res?.data?.data || {} });
                return res;
            }),

        // CaseReportDownload: (caseId) =>
        //     handleReadApi(async () => {
        //         const res = await ApiCall.get(`${CASE_REPORT_PDF}/${caseId}`);

        //         return res;
        //     }),
        CaseReportDownload: (caseId) =>
            handleReportDownloadApi(async () => {
                const res = await ApiCall.get(`${CASE_REPORT_PDF}/${caseId}`);
                window.open(res?.data?.data?.downloadUrl, "_blank");

                return res;
            }),
    };
};

export default CaseService;
