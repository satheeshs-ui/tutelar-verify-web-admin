import React, { useRef, useState } from "react";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import useLoginStore from "../../../store/Login/useLoginStore";
import { maskEmail, maskMobileNumber } from "../../../utils";
import config from "../../../utils/config";
import ImageLoader from "../../../components/ui/ImageLoader";

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { SendMfaOtp, btnLoading } = useLoginStore();
    const recaptchaRef = useRef(null);

    const authList = [
        {
            label: "Email",
            value: maskEmail(location?.state?.userDetail?.email),
            originalKey: "email",
            icon: "emailIcon",
            isSelect: false,
        },
        {
            label: "Phone",
            value: maskMobileNumber(location?.state?.userDetail?.mobile),
            originalKey: "sms",
            icon: "phoneIcon",
            isSelect: false,
        },
        {
            label: "Authenticator App",
            value: "Check your authenticator app for the OTP",
            originalKey: "totp",
            icon: "authappIcon",
            isSelect: false,
        },
    ];

    const [authData, setAuthData] = useState(authList);

    const handleSelect = (_, index) => {
        const updated = authData.map((item, i) => ({
            ...item,
            isSelect: i === index,
        }));
        setAuthData(updated);
    };
    const handleButtonClick = async () => {
        // const token = await recaptchaRef.current?.executeAsync();
        const selected = authData.find((item) => item.isSelect);
        if (!selected) return;

        const payload = {
            mfaMethod: selected.originalKey,
            email: location?.state?.userDetail?.email,
            // recaptchaToken: token,
        };

        if (selected?.originalKey === "totp") {
            navigate("/otp-verification", {
                state: {
                    email: location?.state?.userDetail?.email,
                    mfaMethod: selected.originalKey,
                    token: location?.state?.token,
                },
            });
            return;
        }
        SendMfaOtp(payload).then((res) => {
            if (res?.data?.success) {
                navigate("/otp-verification", {
                    state: {
                        email: location?.state?.userDetail?.email,
                        mfaMethod: selected.originalKey,
                        token: location?.state?.token,
                    },
                });
            }
        });
    };

    const hasSelected = authData.some((item) => item.isSelect);

    return (
        <div className=" p-6 w-full">
            <div className="text-[#101828] text-[32px] font-medium mb-6">Authentication Method</div>

            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={config.S3_UPLOADER.RECAPTCHA_SITE_KEY}
                badge="bottomright"
            />

            {authData.map(
                (item, i) =>
                    location.state?.enabledMfaMethods?.includes(item.originalKey) && (
                        <div
                            key={i}
                            className={`border ${
                                item.isSelect ? "border-[#0F172A]" : "border-[#D0D5DD80]"
                            } rounded-2xl bg-[#F9FAFBCC] mb-4 flex p-[15px] items-center cursor-pointer`}
                            onClick={() => handleSelect(item, i)}
                        >
                            <div className="mr-3 bg-white p-[13px] rounded-[14px]">
                                <ImageLoader imageKey={item.icon} className="w-5 h-5" />
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between items-center">
                                    <p className="text-[#344054] text-sm">{item.label}</p>
                                    <ImageLoader imageKey="rightarrowIcon" className="w-4 h-4" />
                                </div>
                                <div className="text-[#0F172A] text-xs mt-1">{item.value}</div>
                            </div>
                        </div>
                    )
            )}

            <div className="mt-[34px]">
                <PrimaryButton
                    label="Continue"
                    onNotify={handleButtonClick}
                    disabled={btnLoading || !hasSelected}
                />
            </div>

            <div
                className="flex items-center mt-8 cursor-pointer w-fit"
                onClick={() => navigate("/signin")}
            >
                <ImageLoader imageKey="leftArrowIcon" className="w-4 h-4" />
                <span className="text-[#475467] font-semibold text-sm ml-1.5">Back to log in</span>
            </div>
        </div>
    );
};

export default AuthenticationPage;
