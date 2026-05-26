import ApiCall from "../../../config/api/axiosInstance";
import { showSuccess } from "../../../utils";

const CREATE_ROLE = "video-kyc/roles/client";
const UPDATE_ROLE = "video-kyc/roles/client";
const GET_ROLE_LIST = "video-kyc/roles/client";
const GET_ROLE_DETAILS = "video-kyc/roles/client";

const RoleService = (set) => {
    const handleWriteApi = async (apiCall, successMessage, callback) => {
        set({ btnloading: true, error: null });
        try {
            const res = await apiCall();
            set({ btnloading: false });

            const msg =
                res?.message || res?.data?.message || successMessage || "Operation Successfull";
            showSuccess(msg);
            callback && callback(res);
        } catch (error) {
            set({ btnloading: false });
            throw error;
        }
    };

    const handleReadApi = async (apiCall) => {
        set({ isLoading: true, error: null });

        try {
            const res = await apiCall();
            set({ isLoading: false });
            return res;
        } catch (error) {
            set({ isLoading: false });
            set({ errorCode: error?.response?.data?.errorCode || null });
            set({ connectionError: error?.response?.data });

            throw error;
        }
    };

    return {
        createRole: (newData, callback) =>
            handleWriteApi(
                () => ApiCall.post(CREATE_ROLE, newData),
                "Role Created Successfully",
                callback
            ),

        // UPDATE (edit save)
        updateRole: (roleId, data, callback) =>
            handleWriteApi(
                () => ApiCall.put(`${UPDATE_ROLE}/update/${roleId}`, data),
                "Role Updated Successfully",
                callback
            ),

        // GET DETAILS
        getRoleDetails: (roleId) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(`${GET_ROLE_DETAILS}/${roleId}`);

                const role = res?.data?.data?.roleDetails || {};

                set({ roleDetails: role });

                return res;
            }),

        getRoleList: (filters) =>
            handleReadApi(async () => {
                const res = await ApiCall.get(GET_ROLE_LIST, { params: filters });

                set({ roleList: res?.data?.data?.rolesList || [] });

                return res;
            }),
    };
};
export default RoleService;
