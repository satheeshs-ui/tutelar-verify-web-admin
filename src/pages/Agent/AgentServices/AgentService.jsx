import ApiCall from "../../../config/api/axiosInstance";
import { cleanParams, showSuccess } from "../../../utils";

const CREATE_USER = "video-kyc/user";
const UPDATE_USER = "video-kyc/user/agent";
const AGENT_LIST = "video-kyc/user/agents";
const ROLE_LIST = "video-kyc/roles/client";
const GET_USER_DETAILS = "video-kyc/user";
const USER_UNBLOCK = "/video-kyc/auth/unblock";
const FETCH_TURN_CREDENTIALS = "video-kyc/turn/credential";
const SHIFT_LIST = "/agent-shift/list";

const AgentService = (set) => {
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
        set({ isLoading: true, btnLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ isLoading: false, btnLoading: false });
            return res;
        } catch (error) {
            set({ isLoading: false, btnLoading: false });
            throw error;
        }
    };

    const handlePostMethod = async (apiCall, callback) => {
        set({ btnLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ btnLoading: false });
            const msg = res?.message || res?.data?.message;
            showSuccess(msg);

            callback && callback(res);
            return res;
        } catch (error) {
            set({ btnLoading: false });
            throw error;
        }
    };
    return {
        createAgent: (newData, callback) =>
            handleWriteApi(
                () => ApiCall.post(CREATE_USER, newData),
                "User created successfully",
                callback
            ),

        updateUser: (userId, newData, callback) =>
            handleWriteApi(
                () => ApiCall.patch(`${UPDATE_USER}/${userId}`, newData),
                "User updated successfully",
                callback
            ),
        fetchTurnCreds: (callback) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${FETCH_TURN_CREDENTIALS}`);

                if (callback) callback(res);
                set({
                    turnCredentials: res?.data || {},
                });

                return res;
            }),
        getRoleList: (params) =>
            handleReadApi(async () => {
                const cleanedParams = cleanParams(params);
                const res = await ApiCall.get(ROLE_LIST, cleanedParams);
                set({ agentList: res?.data?.data || [] });
                return res;
            }),

        getAgentList: (params) =>
            handleReadApi(async () => {
                const cleanedParams = cleanParams(params); // remove undefined/empty
                const res = await ApiCall.get(AGENT_LIST, {
                    params: cleanedParams,
                }); // flat params
                set({ agentList: res?.data?.data || [] });
                return res;
            }),

        getAgentDetails: (userId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${GET_USER_DETAILS}/${userId}`);
                set({ agentDetails: res?.data?.data || {} });
                return res;
            }),

        unblockAgentAccount: (userId, data, callback) =>
            handlePostMethod(() => ApiCall.post(`${USER_UNBLOCK}/${userId}`, data), callback),

        getShiftList: () =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${SHIFT_LIST}`);
                set({ shiftList: res?.data?.data || {} });
                return res;
            }),
    };
};

export default AgentService;
