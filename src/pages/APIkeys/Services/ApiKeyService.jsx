import ApiCall from "../../../config/api/axiosInstance";
import { cleanParams, showSuccess } from "../../../utils";

const GENERATE_API_KEY = "video-kyc/api-key/generate";
const FETCH_API_KEY_LIST = "video-kyc/api-key/list";

const ApiKeyService = (set) => {
    const execute = async ({ apiCall, loadingKey, successMessage, onSuccess }) => {
        set({ [loadingKey]: true, error: null });

        try {
            const res = await apiCall();
            set({ [loadingKey]: false });

            if (successMessage) {
                const msg = res?.message || res?.data?.message || successMessage;

                showSuccess(msg);
            }

            onSuccess?.(res);
            return res;
        } catch (error) {
            set({ [loadingKey]: false });
            throw error;
        }
    };

    return {
        generateApiKey: (payload, callback) =>
            execute({
                loadingKey: "btnLoading",
                successMessage: "API key created successfully",
                apiCall: () => ApiCall.post(GENERATE_API_KEY, payload),
                onSuccess: callback,
            }),

        fetchApiKeys: (params) =>
            execute({
                loadingKey: "isLoading",
                apiCall: () => {
                    const cleanedParams = cleanParams(params);
                    return ApiCall.get(FETCH_API_KEY_LIST, cleanedParams);
                },
                onSuccess: (res) => {
                    set({
                        apiKeyListData: res?.data?.data?.keys || [],
                        totalPages: res?.data?.data?.total || 0,
                    });
                },
            }),
    };
};

export default ApiKeyService;
