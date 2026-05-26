import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { showFailure, showSuccess } from "../../../utils";
import ReCAPTCHA from "react-google-recaptcha";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { resetSchema } from "../Validation/resetSchema";
import useLoginStore from "../../../store/Login/useLoginStore";
import config from "../../../utils/config";
import AntdInput from "../../../components/ui/AntdInput";
import useAuthStore from "../../../store/auth.store";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword, btnLoading } = useAuthStore();
    const { resendOTPForgotPassword } = useLoginStore();

    const [openPassword, setOpenPassword] = useState(true);
    const [openConfirmPassword, setOpenConfirmPassword] = useState(true);
    const [verifyOTP, setverifyOTP] = useState(true);
    const email = location?.state?.email;
    const recaptchaRef = useRef(null);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);

    if (!email) {
        navigate("/login");
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        const res = await resetPassword({
            email,
            otp: Number(otp.join("")),

            newPassword: data.password,
        });

        if (res?.data?.success) {
            showSuccess(res.data.message);
            navigate("/login");
        } else {
            showFailure(res.data.message);
        }
    };
    const handlePasswordToggle = (name) => {
        if (name === "confirmPassword") {
            setOpenConfirmPassword((prev) => !prev);
        } else {
            setOpenPassword((prev) => !prev);
        }
    };

    useEffect(() => {
        if (timer <= 0) return;

        const countdown = setTimeout(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(countdown);
    }, [timer]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleResend = async () => {
        const token = await recaptchaRef.current?.executeAsync();
        const payload = {
            email: location?.state?.email,
            recaptchaToken: token,
        };

        resendOTPForgotPassword(payload).then((res) => {
            if (res?.data?.success) {
                setTimer(30);
                setOtp(Array(6).fill(""));
                inputRefs.current[0]?.focus();
            }
        });
    };

    const handleButtonClick = () => {
        setverifyOTP(false);
    };
    const isOtpComplete = otp.every(Boolean);

    return (
        <div className="flex items-center p-6 bg-white w-full">
            <Form layout="vertical" className="w-full" onFinish={() => handleSubmit(onSubmit)()}>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={config.S3_UPLOADER.RECAPTCHA_SITE_KEY}
                    badge="bottomright"
                />
                {verifyOTP ? (
                    <div>
                        <div className="text-3xl font-semibold mb-2">{`Verify Your Email`}</div>
                        <p className="text-primary-black-11 text-sm md:text-lg mb-6">
                            {`Enter the 6-digit code sent to Email`}
                        </p>
                        <div className="flex justify-center gap-3 sm:gap-4 mt-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-10 h-12 sm:w-[58px] sm:h-[58px] text-center text-xl font-semibold border border-[#E2E8F0] rounded-2xl focus:border-[#0E3A66]! focus:ring-1 focus:ring-[#0E3A66]! outline-none transition-all"
                                />
                            ))}
                        </div>
                        <div className="mt-[34px]">
                            <PrimaryButton
                                label="Verify"
                                onNotify={() => handleButtonClick("verify")}
                                disabled={btnLoading || !isOtpComplete}
                            />
                        </div>

                        <div className="text-center mt-4 text-primary-black-11 text-base">
                            {timer > 0 ? (
                                <span>Resend Code in 00:{timer}s</span>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    className="cursor-pointer font-medium transition-all"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-3xl font-semibold mb-6">Reset Password</div>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <AntdInput
                                    {...field}
                                    label="Password"
                                    placeholder="Enter your password"
                                    labelCss="text-[#40444C] text-[14px] font-medium"
                                    prefixIcon="lockIcon"
                                    suffixIcon={openPassword ? "closeeyeIcon" : "openPasswordIcon"}
                                    type={openPassword ? "password" : "text"}
                                    isMandatory
                                    error={errors.password?.message}
                                    onValueChange={(data) => field.onChange(data.value.trim())}
                                    handlePassword={() => handlePasswordToggle("password")}
                                />
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <AntdInput
                                    {...field}
                                    label="Confirm Password"
                                    placeholder="Enter your confirm password"
                                    labelCss="text-[#40444C] text-[14px] font-medium"
                                    prefixIcon="lockIcon"
                                    suffixIcon={
                                        openConfirmPassword ? "closeeyeIcon" : "openPasswordIcon"
                                    }
                                    type={openConfirmPassword ? "password" : "text"}
                                    error={errors.confirmPassword?.message}
                                    isMandatory
                                    onValueChange={(data) => field.onChange(data.value.trim())}
                                    handlePassword={() => handlePasswordToggle("confirmPassword")}
                                />
                            )}
                        />

                        <div className="mt-4">
                            <PrimaryButton
                                label="Reset Password"
                                onNotify={() => handleSubmit(onSubmit)()}
                                disabled={btnLoading}
                            />
                        </div>
                        <div
                            className="flex items-center mt-8 cursor-pointer w-fit"
                            onClick={() => navigate("/signin")}
                        >
                            <ArrowLeftOutlined className="text-[16px] cursor-pointer" />

                            <span className="text-[#475467] font-semibold text-sm ml-1.5">
                                {" "}
                                Back to log in
                            </span>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};

export default ResetPassword;
