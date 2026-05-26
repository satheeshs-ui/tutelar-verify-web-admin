import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import AntdInput from "../../../components/ui/AntdInput";
import { loginSchema } from "../Validation/loginSchema";

import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { useAppStore } from "../../../store/app.store";
import userProfileStore from "../../../store/UserProfile/userProfileStore";
import useLoginStore from "../../../store/Login/useLoginStore";
import config from "../../../utils/config";
import ImageLoader from "../../../components/ui/ImageLoader";

const Login = () => {
    const navigate = useNavigate();
    const { createLoginData, btnLoading, SendMfaOtp } = useLoginStore();
    const recaptchaRef = useRef(null);
    const [openPassword, setOpenPassword] = useState(true);
    const setUserDetails = useAppStore((state) => state.setUserDetails);
    const { getUserProfile } = userProfileStore();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handlePasswordToggle = () => {
        setOpenPassword((prev) => !prev);
    };

    const onSubmit = async (data) => {
        const token = await recaptchaRef.current?.executeAsync();

        createLoginData({ ...data, recaptchaToken: token })
            .then(async (res) => {
                if (res.data?.success) {
                    if (res?.data?.data?.isPasswordExpired) {
                        navigate("/reset-password", {
                            state: { email: res?.data?.data?.email },
                        });
                        return;
                    }
                    if (res?.data?.data?.enabledMfaMethods?.length > 0) {
                        if (res?.data?.data?.enabledMfaMethods?.length === 1) {
                            navigate("/otp-verification", {
                                state: {
                                    email: data?.email,
                                    mfaMethod: res?.data?.data?.enabledMfaMethods[0],
                                    token: res.data?.data?.mfaToken,
                                },
                            });

                            const result = {
                                mfaMethod: res?.data?.data?.enabledMfaMethods[0],
                                email: data?.email,
                            };

                            if (res?.data?.data?.enabledMfaMethods[0] !== "totp") {
                                SendMfaOtp(result).then(() => {});
                            }
                        } else {
                            navigate("/authentication", {
                                state: {
                                    enabledMfaMethods: res.data?.data?.enabledMfaMethods,
                                    userDetail: res.data?.data?.userDetail,
                                    token: res.data?.data?.mfaToken,
                                },
                            });
                        }
                    } else if (res?.data?.data?.accessToken) {
                        const profileData = await getUserProfile();
                        if (profileData?.data?.data) {
                            setUserDetails(profileData.data.data);
                        } else {
                            userProfileStore.getState().logoutUser();
                        }
                    }
                }
            })
            .catch((error) => {
                console.log("Login error:", error);
            });
    };

    const handleForgot = () => {
        navigate("/auth/forgot-password");
    };

    return (
        <div className="flex items-center p-6 bg-white w-full">
            <Form layout="vertical" className="w-full" onFinish={() => handleSubmit(onSubmit)()}>
                <div className="text-[#101828] text-[32px] font-medium flex items-center gap-2">
                    Welcome back <ImageLoader imageKey={"vkStar"} />
                </div>
                <p className="text-[#6A7174] text-[16px] font-normal">
                    Enter your credentials to access the dashboard
                </p>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={config.S3_UPLOADER.RECAPTCHA_SITE_KEY}
                    badge="bottomright"
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <AntdInput
                            {...field}
                            label="Email"
                            placeholder="Enter your email address"
                            prefixIcon="emailIcon"
                            isMandatory
                            error={errors.email?.message}
                            onValueChange={(data) => field.onChange(data.value)}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <AntdInput
                            {...field}
                            label="Password"
                            placeholder="Enter your password"
                            prefixIcon="lockIcon"
                            suffixIcon={openPassword ? "closeeyeIcon" : "openPasswordIcon"}
                            type={openPassword ? "password" : "text"}
                            isMandatory
                            error={errors.password?.message}
                            onValueChange={(data) => field.onChange(data.value.trim())}
                            handlePassword={handlePasswordToggle}
                        />
                    )}
                />

                <div className="flex justify-end my-2">
                    <p
                        className="text-[#18667C] text-sm cursor-pointer font-normal"
                        onClick={handleForgot}
                    >
                        Forgot Password?
                    </p>
                </div>

                <div className="">
                    <PrimaryButton
                        label={btnLoading ? "Signing In..." : "Sign In"}
                        htmlType="submit"
                        disabled={btnLoading}
                    />
                </div>
            </Form>
        </div>
    );
};

export default Login;
