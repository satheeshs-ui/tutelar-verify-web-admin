import ApiCall from "../../../config/api/axiosInstance";
import { cleanParams } from "../../../utils";

const HISTORY_LOGS = "video-kyc/user/device-history";

const HistoryService = (set) => {
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
        fetchDeviceHistory: (params) =>
            handleReadApi(async () => {
                const cleanedParams = cleanParams(params); // remove undefined/empty
                const res = await ApiCall.get(HISTORY_LOGS, {
                    params: cleanedParams,
                }); // flat params
                set({ deviceHistoryList: res?.data?.data || [] });
                return res;
            }),
    };
};

export default HistoryService;
