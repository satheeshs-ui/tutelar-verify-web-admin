import ApiCall from "../../../config/api/axiosInstance";
import { cleanParams } from "../../../utils";

const ACTIVITY_LOGS = "video-kyc/user/login-activity";

const AcxtivityService = (set) => {
    const handleReadApi = async (apiCall) => {
        set({ isLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ isLoading: false });
            return res;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    };

    return {
        fetchLoginActivity: (params) =>
            handleReadApi(async () => {
                const cleanedParams = cleanParams(params);
                const res = await ApiCall.get(ACTIVITY_LOGS, {
                    params: cleanedParams,
                });
                set({ activityList: res?.data?.data || [] });
                return res;
            }),
    };
};

export default AcxtivityService;
