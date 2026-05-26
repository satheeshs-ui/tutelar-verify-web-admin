import React, { useState, useRef, useEffect } from "react";
import { TopModal } from "../../../components/ui/Modal/TopModal";
import SwitchField from "../../../components/ui/SwitchField";
import { useAppStore } from "../../../store/app.store";
import { maskEmail, maskMobileNumber } from "../../../utils";
import userProfileStore from "../../../store/UserProfile/userProfileStore";
import ImageLoader from "../../../components/ui/ImageLoader";

const MFAScreen = ({ data }) => {
    const setUserDetails = useAppStore((state) => state.setUserDetails);
    const [modalPopup, setModalPopup] = useState(false);
    const [disableModalPopup, setDisableModalPopup] = useState(false);

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const [Datatype, setDataType] = useState({});
    const [timer, setTimer] = useState(30);
    const [altWay, setAltWay] = useState(false);
    const [authQR, setAuthQR] = useState({});
    const [profileData, setProfileData] = useState(data);
    const [isMFAEnabled, setIsMFAEnabled] = useState(profileData?.isMfaEnabled);

    const [enabled, setEnabled] = useState(false);
    const { SetupMfa, Mfaverify, getUserProfile, ChangeMFA, SendOtpMfa, btnLoading } =
        userProfileStore();

    const get_numbner = maskMobileNumber(profileData?.mobile);
    const mfaData = [
        {
            icon: "SMSbasedOTP",
            label: "SMS based OTP",
            description:
                "Secure your account with SMS-based verification. Receive OTPs on your registered mobile number for safer login.",
            afterVerifyText: `SMS-based OTP authentication is currently active and linked to your registered mobile number: ${get_numbner}`,
            type: "sms",
            value: get_numbner,
            isVerified: profileData?.mfaConfig?.sms?.isVerified,
            enabled: profileData?.mfaConfig?.sms?.isEnabled,
        },
        {
            icon: "MailBasedOTP",
            label: "Mail based OTP",
            description:
                "Add extra protection with email-based OTP. Verification codes will be sent to your registered email.",
            afterVerifyText: `Mail-based OTP authentication is currently active and linked to your registered email address:  ${maskEmail(profileData?.email)}`,
            type: "email",
            value: maskEmail(profileData?.email),
            isVerified: profileData?.mfaConfig?.email?.isVerified,
            enabled: profileData?.mfaConfig?.email?.isEnabled,
        },
        {
            icon: "OTPAuth",
            label: "OTP Authenticator",
            description:
                "Improve security using an Authenticator app. Generate time-based OTPs without network access.",
            afterVerifyText: `Authenticator-based OTP is currently active and linked to your configured authenticator app (Google or Microsoft Authenticator).`,
            type: "totp",
            isVerified: profileData?.mfaConfig?.totp?.isVerified,
            enabled: profileData?.mfaConfig?.totp?.isEnabled,
        },
    ];

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        }
    }, [timer]);

    const handleClose = () => {
        setModalPopup(false);

        setAltWay(false);
        setTimer(30);
        setOtp(Array(6).fill(""));
        setDisableModalPopup(false);
    };

    const handleSetup = async (data, item) => {
        setDataType(data);
        const newData = {
            mfaMethod: data.type,
        };
        if (item === "Disabled") {
            setDisableModalPopup(true);
        } else {
            setModalPopup(true);

            SetupMfa(newData, (res) => {
                if (res?.data?.success) {
                    setTimer(30);
                    setOtp(Array(6).fill(""));
                    inputRefs.current[0]?.focus();
                    if (data.type === "totp") {
                        setAuthQR({
                            image: res?.data?.data?.qrCode,
                            code: res?.data?.data?.secret,
                        });
                    }
                }
            });
        }
    };

    const handleResendOtp = (data) => {
        setDataType(data);
        const newData = {
            mfaMethod: data.type,
        };
        SendOtpMfa(newData).then((res) => {
            if (res.success) {
                setTimer(30);
                setOtp(Array(6).fill(""));
                inputRefs.current[0]?.focus();
                if (data.type === "totp") {
                    setAuthQR({
                        image: res?.data?.qrCode,
                        code: res?.data?.secret,
                    });
                }
            }
        });
    };

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

    const handleVerify = (item) => {
        const data = {
            mfaMethod: item,
            inputCode: Number(otp.join("")),
        };
        Mfaverify(data).then((res) => {
            if (res?.data?.success) {
                getUserProfile().then((res) => {
                    if (res.data?.success) {
                        setProfileData(res?.data?.data?.userDetails);
                        setUserDetails(res?.data?.data);
                    }
                });
                handleClose();
            }
        });
    };

    const handleDisable = () => {
        const diabledata = {
            mfaMethod: Datatype?.type,
            // is_enabled: false,
        };

        ChangeMFA(diabledata).then((res) => {
            if (res?.data?.success) {
                getUserProfile().then((res) => {
                    if (res?.data?.success) {
                        setProfileData(res.data?.data?.userDetails);
                        setIsMFAEnabled(res?.data?.data?.userDetails?.isMfaEnabled);
                        setUserDetails(res?.data?.data);
                    }
                });
                handleClose();
            }
        });
    };

    const methods = profileData?.mfaConfig;
    const allEnabled = methods && Object?.values(methods).some((item) => item.isVerified);

    const handleToggle = (val) => {
        setEnabled(val.enabled);
        setDisableModalPopup(true);
        setDataType(val);
    };
    const isOtpComplete = otp.every((digit) => digit !== "");
    const handleEnableChange = () => {
        ChangeMFA({}).then((res) => {
            if (res?.data?.success) {
                getUserProfile().then((res) => {
                    if (res?.data?.success) {
                        setProfileData(res.data?.data?.userDetails);
                        setIsMFAEnabled(res?.data?.data?.userDetails?.isMfaEnabled);
                        setUserDetails(res?.data?.data);
                    }
                });
                handleClose();
            }
        });
    };

    return (
        <>
            {allEnabled && (
                <div className="flex justify-between items-center bg-[#F9FAFB] p-6 rounded-[10px] mt-4">
                    <div>
                        <p className="text-[#0F172B] font-semibold text-[15px] mb-1">
                            Enable MFA Check
                        </p>
                        <p className="text-[#6A7282] text-[13px]">
                            Turn on MFA to safeguard your account by requiring a second verification
                            method during login or sensitive actions.
                        </p>
                    </div>
                    <div>
                        <SwitchField
                            name="mfaStatus"
                            label=""
                            enabled={isMFAEnabled}
                            setEnabled={(v) => handleEnableChange(v)}
                            error=""
                            disabled={btnLoading}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  gap-6 py-6 pl-6 max-[500px]:text-[10px]">
                {mfaData?.map((item, i) => (
                    <div
                        key={i}
                        className="border border-[#EBEBEB] rounded-2xl py-6 pl-6 pr-6 sm:pr-40 bg-[#FFFFFF] "
                    >
                        <ImageLoader imageKey={item.icon} />
                        <div className="">
                            <p className="text-primary-black-15 mb-3.5 font-bold text-lg max-[500px]:text-[13px]">
                                {item.label}
                            </p>
                            <p className="text-[#45556C] font-medium text-sm mb-5 max-[500px]:text-[10px]">
                                {item?.isVerified ? item.afterVerifyText : item.description}
                            </p>
                        </div>
                        <div className="setup-btn">
                            {item?.isVerified ? (
                                <button
                                    className={`${item.enabled ? "text-white! bg-primary" : "text-[#EC3237] bg-[#FEF2F2]"}  font-bold text-base  rounded-lg p-2.5 cursor-pointer`}
                                    onClick={() => handleToggle(item)}
                                    disabled={btnLoading}
                                >
                                    {item.enabled ? "Enabled " : "Disabled"}
                                </button>
                            ) : (
                                <button
                                    className={`text-white! bg-primary font-bold text-base  rounded-lg p-2.5 cursor-pointer`}
                                    onClick={() => handleSetup(item, "Set Up Now")}
                                >
                                    Set Up Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {modalPopup && (
                <TopModal isOpen={modalPopup} onClose={handleClose} closeBtn={true}>
                    <div>
                        {Datatype.type === "totp" ? (
                            <>
                                <div className="text-center w-full">
                                    <div className=" flex justify-center mb-3">
                                        <ImageLoader
                                            imageKey={"authverifyIcon"}
                                            className="bg-[linear-gradient(180deg,#2873BF_0%,#155DFC_100%)]  px-5 pt-5 pb-3 rounded-2xl"
                                        />
                                    </div>
                                    <p
                                        className="text-[#0E3A66]
       text-[20px] font-bold mt-4"
                                    >
                                        {"Setup authenticator app for MFA"}
                                    </p>

                                    <p className="text-[#45556C] font-medium text-[16px] mt-3">
                                        You will need a{" "}
                                        <span className="text-[#145AF0]">
                                            Google, Microsoft authenticator,etc.
                                        </span>{" "}
                                        on your Phone device.
                                    </p>
                                    <p className="text-[#303030] font-bold text-[16px] mt-9">
                                        Scan the QR code into your app.
                                    </p>
                                    <div className="flex justify-center mt-3.5 items-center ">
                                        <div className="setup-qr-code text-center my-3 ">
                                            <img
                                                src={authQR?.image}
                                                alt="QR Code"
                                                className="border border-[#E2E8F0] bg-white rounded-2xl"
                                            />
                                        </div>
                                    </div>

                                    {altWay ? (
                                        <div className="flex">
                                            <div className="text-[#303030] text-base font-bold">
                                                {" "}
                                                Account:{" "}
                                            </div>
                                            <div className="text-[#303030] text-base font-medium mx-[5px] border-r border-[#D4D4D4] pr-[5px]">
                                                {profileData?.email}
                                            </div>
                                            <div className="text-[#303030] text-base font-bold">
                                                Key:{" "}
                                            </div>
                                            <div className="text-[#303030] text-base font-medium mx-[5px] text-wrap">
                                                {authQR?.code}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center ">
                                            <p
                                                className="text-[#155DFC] font-bold text-[16px] mt-5 cursor-pointer w-fit"
                                                onClick={() => setAltWay(true)}
                                            >
                                                Can't scan the barcode?
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-9 border-t border-[#DFDFDF]">
                                    <p className="text-[#303030] text-[16px] font-bold mt-[30px] text-center pt-5">
                                        Enter the 6 digit authentication code generated by your app
                                    </p>
                                    <div className="flex justify-center gap-3 sm:gap-4 pt-5">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handleChange(e.target.value, index)
                                                }
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="w-10 h-12 sm:w-[58px] sm:h-[58px] bg-white text-center text-xl font-semibold border border-[#E2E8F0] rounded-2xl focus:border-primary! focus:ring-1 focus:ring-primary! outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    <div
                                        className={`${isOtpComplete ? "bg-primary text-[#fff] cursor-pointer" : "bg-primary-black-12 opacity-60 cursor-not-allowed"} flex justify-center mt-10  rounded-2xl py-4 `}
                                        onClick={() => isOtpComplete && handleVerify(Datatype.type)}
                                    >
                                        <button
                                            className={`${isOtpComplete ? "cursor-pointer text-white" : "text-[#0E3A66] cursor-not-allowed"} flex items-center  font-bold text-[15px]`}
                                        >
                                            Verify & Continue{" "}
                                            <ImageLoader
                                                imageKey={
                                                    isOtpComplete
                                                        ? "rightArrowIconImage"
                                                        : "rightArrowicon"
                                                }
                                                className="w-5 h-5 ml-[5px]"
                                            />
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center mt-[13px] text-[#90A1B9] font-medium text-[13px]">
                                        <ImageLoader
                                            imageKey={"disabledBadge"}
                                            className="w-5 h-5 mr-1"
                                        />{" "}
                                        Secured with end-to-end encryption
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="overflow-auto">
                                <div className="text-center w-full">
                                    <div className=" flex justify-center mb-3">
                                        <ImageLoader
                                            imageKey={
                                                Datatype.type === "email"
                                                    ? "verifymailIcon"
                                                    : Datatype.type === "sms"
                                                      ? "smsIcon"
                                                      : "authverifyIcon"
                                            }
                                            className="bg-[linear-gradient(180deg,#2873BF_0%,#155DFC_100%)]  px-5 pt-5 pb-3 rounded-2xl"
                                        />
                                    </div>
                                    <p
                                        className="bg-[linear-gradient(to_bottom,#0E3A66_0%,#155DFC_50%,#0E3A66_100%)]
       bg-clip-text text-transparent text-[18px] font-bold mt-4"
                                    >
                                        {Datatype.type === "email"
                                            ? "Verify Your Mail"
                                            : Datatype.type === "sms"
                                              ? "Verify Your Number"
                                              : "Setup authenticator app for MFA"}
                                    </p>

                                    <p className="text-[#45556C] font-medium text-[15px] mt-3">
                                        Enter the verification code sent to
                                    </p>
                                    <div className="flex justify-center mt-[7px] items-center">
                                        <p className="mr-2 border border-[#155DFC33] p-3 bg-[#6293fb33] rounded-4xl text-[#155DFC] font-bold text-[15px]">
                                            {Datatype.type === "email"
                                                ? maskEmail(Datatype.value)
                                                : Datatype.type === "sms"
                                                  ? maskMobileNumber(Datatype.value)
                                                  : ""}
                                        </p>
                                        <ImageLoader
                                            imageKey={"successbadgeIcon"}
                                            className="w-6 h-6"
                                        />{" "}
                                    </div>
                                </div>
                                <div className="mt-9">
                                    <div className="flex justify-center gap-3 sm:gap-4">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handleChange(e.target.value, index)
                                                }
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="w-10 h-12 sm:w-[58px] sm:h-[58px] bg-white text-center text-xl font-semibold border border-[#E2E8F0] rounded-2xl focus:border-primary! focus:ring-1 focus:ring-primary! outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    <div className="text-center mt-[38px] text-primary-black-11 text-base">
                                        {timer > 0 ? (
                                            <span>Resend Code in 00:{timer}s</span>
                                        ) : (
                                            <div className="flex justify-center">
                                                <button
                                                    className=" text-[#155DFC] font-bold text-[15px] underline text-center cursor-pointer"
                                                    onClick={() => handleResendOtp(Datatype)}
                                                >
                                                    Resend Code
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={`${isOtpComplete ? "bg-primary text-[#fff] cursor-pointer" : "bg-primary-black-12 cursor-not-allowed opacity-60"} flex justify-center mt-4  rounded-2xl py-4 `}
                                        onClick={() => isOtpComplete && handleVerify(Datatype.type)}
                                    >
                                        <button
                                            className={`${isOtpComplete ? "text-white cursor-pointer" : "text-[#0E3A66] cursor-not-allowed"} flex items-center  font-bold text-[15px]`}
                                        >
                                            Verify & Continue
                                            <ImageLoader
                                                imageKey={
                                                    isOtpComplete
                                                        ? "rightArrowIconImage"
                                                        : "rightArrowicon"
                                                }
                                                className="w-5 h-5 ml-[5px]"
                                            />
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center mt-[13px] text-[#90A1B9] font-medium text-[13px]">
                                        <ImageLoader
                                            imageKey={"disabledBadge"}
                                            className="w-5 h-5 mr-1"
                                        />
                                        Secured with end-to-end encryption
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TopModal>
            )}

            {disableModalPopup && (
                <TopModal isOpen={disableModalPopup} onClose={handleClose} closeBtn={false}>
                    <div className="pt-[25px] px-2">
                        <p className="text-[#0F172B] font-bold text-lg mb-[9px]">{`${enabled ? "Disable" : "Enable"}  ${Datatype?.type?.toUpperCase()} based OTP?`}</p>
                        <p className="text-[#45556C] text-sm mb-[17px]">{`Are you sure you want to ${enabled ? "disable" : "enable"} ${Datatype?.type?.toUpperCase()}-based OTP?`}</p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="text-primary-theme-6 border border-[#CAD5E2] bg-white rounded-lg py-2 px-[15px] text-sm font-semibold mr-2.5 cursor-pointer"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={`text-[#FFFFFF] ${enabled ? "bg-[#E7000B]" : "bg-[#0E3A66]"} text-[#FFFFFF]! rounded-lg py-2 px-[15px] text-sm font-semibold cursor-pointer`}
                                onClick={handleDisable}
                                disabled={btnLoading}
                            >
                                {enabled ? "Disable" : "Enable"}
                            </button>
                        </div>
                    </div>
                </TopModal>
            )}
        </>
    );
};

export default MFAScreen;
