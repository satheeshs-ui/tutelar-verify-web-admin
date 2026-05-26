import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema } from "./Validation/PasswordSchema";
import MFAScreen from "./MFAScreen/MFAScreen";
import ChangePasswordModal1 from "./ChangePassword1";
import { checkValue } from "../../utils";
import { useAppStore } from "../../store/app.store";
import userProfileStore from "../../store/UserProfile/userProfileStore";
import ShiftManagement from "./ShiftManagement/ShiftManagement";

const Profile = () => {
    const [activeTab, setActiveTab] = useState(1);

    const { changePassword, logoutUser } = userProfileStore();
    const { userDetails } = useAppStore()?.userDetails || {};

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const tabList = [
        {
            label: "MFA",
            number: 1,
        },
        {
            label: "Change Password",
            number: 2,
        },
        ...(userDetails?.appUserType === "client"
            ? [
                  {
                      label: "Shift Management",
                      number: 3,
                  },
              ]
            : []),
    ];
    const handleClick = (item) => {
        setActiveTab(item.number);
        reset();
    };

    const submitHandler = (data) => {
        const payload = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        };

        changePassword(payload, (res) => {
            if (res) {
                setTimeout(() => {
                    handleClose();
                    logoutUser({});
                    localStorage.clear();
                    window.location.reload();
                }, 300);
            }
        });
    };

    const handleClose = () => {
        reset();
    };
    const renderComponent = (key) => {
        switch (key) {
            // case 1:
            //     return <GeneralInfoScreen data={userData} />;
            case 1:
                return <MFAScreen data={userDetails} />;
            case 2:
                return (
                    <ChangePasswordModal1
                        onSubmit={submitHandler}
                        control={control}
                        errors={errors}
                        handleSubmit={handleSubmit}
                    />
                );
            case 3:
                return <ShiftManagement data={userDetails} />;

            default:
                return null;
        }
    };

    return (
        <>
            <div className="w-full px-2">
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <div className="flex  items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-[#2B354E] capitalize max-[500px]:text-[14px]">
                            {userDetails?.role} Profile
                        </h2>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap items-start md:items-center gap-4 md:gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-25 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-sm">
                            Image
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2! md:grid-cols-3! gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-500 text-xs font-medium">
                                        Full Name
                                    </label>
                                    <p className="text-sm font-medium text-[#2B354E] capitalize">
                                        {checkValue(userDetails?.name)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-500 text-xs font-medium capitalize">
                                        {userDetails?.role ?? "User"} ID
                                    </label>
                                    <p className="text-sm font-medium text-[#2B354E]">
                                        {checkValue(userDetails?.userId)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-500 text-xs font-medium">
                                        Email Address
                                    </label>
                                    <p className="text-sm font-medium text-[#2B354E]">
                                        {checkValue(userDetails?.email)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-500 text-xs font-medium">
                                        Contact Number
                                    </label>
                                    <p className="text-sm font-medium text-[#2B354E]">
                                        {checkValue(userDetails?.mobile)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-500 text-xs font-medium">
                                        Role
                                    </label>
                                    <p className="text-sm font-medium text-[#2B354E] capitalize">
                                        {checkValue(userDetails?.role)}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-500 text-xs font-medium">
                                        Status
                                    </label>
                                    <span
                                        className={`${
                                            userDetails?.status === "active"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        } text-sm font-semibold capitalize`}
                                    >
                                        {checkValue(userDetails?.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mt-5">
                <div className="flex items-center gap-5 pl-10">
                    {tabList?.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => handleClick(item)}
                            className={`
        pb-2.5 cursor-pointer text-base relative max-[500px]:text-[11px]
        transition-all duration-300 ease-in-out
        ${
            Number(activeTab) === Number(item.number)
                ? "text-primary font-bold"
                : "text-primary-black-11"
        }
      `}
                        >
                            {item.label}

                            <span
                                className={`
          absolute left-0 bottom-0 h-0.5 bg-primary
          transition-all duration-300 ease-in-out
          ${Number(activeTab) === Number(item.number) ? "w-full" : "w-0"}
        `}
                            />
                        </div>
                    ))}
                </div>
                <div>{renderComponent(activeTab)}</div>
            </div>
        </>
    );
};

export default Profile;
