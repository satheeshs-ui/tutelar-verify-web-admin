import { post } from "../../../config/api/api.service";
import { setCookie, showSuccess } from "../../../utils";
const CREATE_LOGIN_PATH = "video-kyc/auth/login";
const SEND_MFA_OTP = "video-kyc/auth/send-mfa-otp";
const VERIFY_MFA_LOGIN = "video-kyc/auth/authenticate-mfa";
const LoginService = (set) => {
    const handleApiCall = async (endpoint, newData, successMessage, callback) => {
        set({ btnLoading: true, error: null });

        try {
            const res = await post(endpoint, newData);

            if (res == null || res == undefined) {
                set({ btnLoading: false, error: null });
                throw new Error("No response from server");
            }

            if (res?.data?.success) {
                const mfaMethods = res?.data?.data?.enabledMfaMethods;

                if (!Array.isArray(mfaMethods) || mfaMethods.length === 0) {
                    setCookie("accessToken", res.data?.data?.accessToken); // Store access token in cookie for 1 day
                    setCookie("isBreak", false);

                    set({
                        loginDetails: res.data,
                        authChecked: res.data?.data?.isPasswordExpired ? false : true,
                        forcePasswordChange: res?.data?.data?.forcePasswordChange || false,
                        btnLoading: false,
                    });
                } else {
                    set({
                        loginDetails: {},
                        authChecked: false,
                        btnLoading: false,
                    });
                }

                showSuccess(res?.data?.message || successMessage);
                callback && callback(res);
                return res;
            }

            return false;
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message || error?.message || "Something went wrong.";

            set({ error: errorMsg, btnLoading: false, loginDetails: {}, authChecked: false });

            throw error;
        }
    };

    const handleVerifyMfaLogin = async (endpoint, newData, successMessage, callback) => {
        set({ btnLoading: true, error: null });

        try {
            const res = await post(endpoint, newData);

            if (res == null || res == undefined) {
                set({ btnLoading: false, error: null });
                throw new Error("No response from server");
            }

            if (res?.data?.success) {
                set({
                    btnLoading: false,
                });

                showSuccess(res?.data?.message || successMessage);
                callback && callback(res);
                return res;
            }

            return false;
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message || error?.message || "Something went wrong.";

            set({ error: errorMsg, btnLoading: false });

            throw error;
        }
    };

    return {
        createLoginData: (newData, callback) =>
            handleApiCall(CREATE_LOGIN_PATH, newData, "Login successful", callback),
        SendMfaOtp: async (newData, callback) =>
            handleVerifyMfaLogin(SEND_MFA_OTP, newData, "Sent Mfa otp successful", callback),

        VerifyMfaLogIn: async (newData, callback) =>
            handleApiCall(VERIFY_MFA_LOGIN, newData, "Verified mfa login successful", callback),

        resendOTPForgotPassword: async (newData, callback) =>
            handleVerifyMfaLogin(
                "video-kyc/auth/send-reset-otp",
                newData,
                "Resent otp for forgot password successful",
                callback
            ),
    };
};

export default LoginService;
