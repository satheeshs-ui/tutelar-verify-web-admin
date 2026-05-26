import ApiCall from "../../../config/api/axiosInstance";
import { cleanParams } from "../../../utils";

const ENTITY_LIST = "video-kyc/entity-document/list";
const ENTITY_UPDATE = "video-kyc/entity-document/edit";

const EntityService = (set) => {
    const handleReadApi = async (apiCall) => {
        set({ isLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ isLoading: false });
            return res;
        } catch (error) {
            set({ errorCode: error?.response?.data?.errorCode || null });
            set({ connectionError: error?.response?.data });
            set({ isSummaryVerificationPending: error?.response?.data?.messageCode === "C1011" });
            throw error;
        }
    };

    return {
        getEntityList: (params) =>
            handleReadApi(async () => {
                const cleanedParams = cleanParams(params);
                const res = await ApiCall.get(ENTITY_LIST, {
                    params: cleanedParams,
                });
                set({ entityList: res?.data?.data || [] });
                return res;
            }),
        updateEntity: (data, callback = null) =>
            handleReadApi(async () => {
                const res = await ApiCall.put(ENTITY_UPDATE, data);
                if (callback) callback(res);
                return res;
            }),
    };
};

export default EntityService;
