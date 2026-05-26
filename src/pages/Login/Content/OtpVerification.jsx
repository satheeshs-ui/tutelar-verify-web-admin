import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppStore } from "../../../store/app.store";
import userProfileStore from "../../../store/UserProfile/userProfileStore";
import useLoginStore from "../../../store/Login/useLoginStore";
import config from "../../../utils/config";

const OtpVerificationPage = () => {
    const { VerifyMfaLogIn, SendMfaOtp, btnLoading } = useLoginStore();
    const location = useLocation();
    const setUserDetails = useAppStore((state) => state.setUserDetails);
    const { getUserProfile } = userProfileStore();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    const recaptchaRef = useRef(null);

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
        // const token = await recaptchaRef.current?.executeAsync();
        const payload = {
            mfaMethod: location?.state?.mfaMethod,
            email: location?.state?.email,
            // recaptchaToken: token,
        };

        SendMfaOtp(payload).then((res) => {
            if (res?.data?.success) {
                setTimer(30);
                setOtp(Array(6).fill(""));
                inputRefs.current[0]?.focus();
            }
        });
    };

    const handleButtonClick = async () => {
        const token = await recaptchaRef.current?.executeAsync();

        const payload = {
            email: location?.state?.email,
            mfaMethod: location?.state?.mfaMethod,
            inputCode: Number(otp.join("")),
            token: location?.state?.token,
            recaptchaToken: token,
        };

        VerifyMfaLogIn(payload).then(async (res) => {
            if (res?.data?.success) {
                if (res?.data?.data?.accessToken) {
                    const profileData = await getUserProfile();
                    if (profileData?.data?.data) {
                        setUserDetails(profileData.data.data);
                    }
                }
            }
        });
    };

    const isOtpComplete = otp.every(Boolean);

    return (
        <div className=" p-6 bg-white w-full">
            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={config.S3_UPLOADER.RECAPTCHA_SITE_KEY}
                badge="bottomright"
            />
            <div className="text-[#101828] text-[32px] mb-6">{`Verify Your ${location?.state?.mfaMethod}`}</div>
            <p className="text-[#6A7174] text-sm md:text-lg mb-6">
                {location?.state?.mfaMethod === "totp"
                    ? "Please check your authenticator app and enter the 6-digit code to continue."
                    : `Enter the 6-digit code sent to ${location?.state?.mfaMethod}`}
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
                    onNotify={handleButtonClick}
                    disabled={btnLoading || !isOtpComplete}
                />
            </div>

            {location?.state?.mfaMethod !== "totp" && (
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
            )}
        </div>
    );
};

export default OtpVerificationPage;
