import ApiCall from "../../../config/api/axiosInstance";
import { removeCookie, showFailure, showSuccess } from "../../../utils";

const CHANGEDPASSWORD = "video-kyc/auth/change-password";
const VERIFY_PASSWORD = "video-kyc/auth/verify-password";
const LOGOUT = "video-kyc/auth/logout";
const GET_PROFILE = "video-kyc/auth/profile";
const CHANGEMFA = "video-kyc/user/toggle-mfa";
const SETUP_MFA = "/video-kyc/user/setup-mfa";
const MFA_VERIFY = "/video-kyc/user/verify-mfa";
const SEND_MFA_OTP = "/video-kyc/user/send-mfa-otp";
const ProfileService = (set) => {
    const changePassword = async (newData, callback) => {
        try {
            set({ btnLoading: true, error: null });

            const res = await ApiCall.post(CHANGEDPASSWORD, newData);

            if (res?.data?.success) {
                showSuccess(res.data.message || "Password changed successfully");
                callback?.(res);
            }

            return res;
        } catch (error) {
            set({ error: error?.message || "Something went wrong" });
            throw error;
        } finally {
            set({ btnLoading: false });
        }
    };
    const verifyPassword = async (data, environment = "test", callback) => {
        try {
            set({ btnLoading: true, error: null });

            const res = await ApiCall.post(`${VERIFY_PASSWORD}?environment=${environment}`, data);

            if (res?.data?.success) {
                showSuccess(res.data.message || "Password verified");
                callback?.(res);
            }

            return res;
        } catch (error) {
            set({ error: error?.message || "Something went wrong" });
            throw error;
        } finally {
            set({ btnLoading: false });
        }
    };

    const logoutUser = async () => {
        try {
            set({ btnLoading: true, error: null });

            const res = await ApiCall.post(LOGOUT);

            if (res?.data?.success) {
                localStorage.removeItem("auth-storage");
                localStorage.removeItem("app-storage");
                removeCookie("accessToken");
                removeCookie("isBreak");
                showSuccess(res?.data?.message || "Logged out successfully");
                set({ btnLoading: false, error: null });
            }
        } catch (error) {
            set({ btnLoading: false, error: null });
            showFailure(error?.message || "Failed to logout. Please try again.");
        }

        window.location.replace("/signin");
    };

    const getUserProfile = async () => {
        try {
            set({ isLoading: true, error: null });

            const res = await ApiCall.get(GET_PROFILE);

            set({ userData: res?.data?.data || null });

            return res;
        } catch (error) {
            set({ error: error?.message || "Failed to fetch profile" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    };

    const ChangeMFA = async (newData = {}, callback) => {
        set({ btnLoading: true, error: null });
        try {
            const response = await ApiCall.patch(CHANGEMFA, newData);
            set({
                btnLoading: false,
            });

            showSuccess(response?.data?.message || "MFA enabled successfully.");
            callback && callback(response);

            return response;
        } catch (error) {
            const errorMsg =
                error?.message || error?.response?.message || "Failed to change MFA setting.";
            set({ error: errorMsg, btnLoading: false });

            throw error;
        }
    };
    const SetupMfa = async (newData = {}, callback) => {
        set({ btnLoading: true, error: null });

        try {
            const response = await ApiCall.post(SETUP_MFA, newData);
            if (!response?.data?.success) {
                throw response;
            }

            set({ btnLoading: false });

            showSuccess(
                response?.data?.message || "OTP sent. Please verify to complete MFA setup."
            );
            callback && callback(response);
            return response;
        } catch (error) {
            const errorMsg = error?.message || error?.response?.message || "Failed to set up MFA";

            set({ error: errorMsg, btnLoading: false });
            throw error;
        }
    };

    const SendOtpMfa = async (newData = {}, callback) => {
        set({ btnLoading: true, error: null });
        try {
            const response = await new Promise((resolve, reject) => {
                ApiCall.post(SEND_MFA_OTP, newData, (res) => {
                    if (res?.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                });
            });

            set({
                btnLoading: false,
            });

            showSuccess(response?.data?.message || "Failed to send otp.");
            callback && callback(response);
            return response;
        } catch (error) {
            const errorMsg = error?.message || error?.response?.message || "Failed to send otp.";
            set({ error: errorMsg, btnLoading: false });

            throw error;
        }
    };

    const Mfaverify = async (newData = {}, callback) => {
        set({ btnLoading: true, error: null });
        try {
            const response = await ApiCall.post(MFA_VERIFY, newData);
            set({
                btnLoading: false,
            });

            showSuccess(response?.data?.message || "Verification successful.");
            callback && callback(response);
            return response;
        } catch (error) {
            const errorMsg =
                error?.message || error?.response?.message || "MFA verification failed";
            set({ error: errorMsg, btnLoading: false });
            throw error;
        }
    };

    return {
        changePassword,
        verifyPassword,
        logoutUser,
        getUserProfile,
        SetupMfa,
        Mfaverify,
        ChangeMFA,
        SendOtpMfa,
    };
};

export default ProfileService;
