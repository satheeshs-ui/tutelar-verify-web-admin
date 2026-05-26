import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Form } from "antd";
import AntdInput from "../../components/ui/AntdInput";

const ChangePasswordModal1 = ({ onSubmit, control, errors, handleSubmit }) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <div className="py-6 px-6 ">
            <Form
                layout="vertical"
                className="w-full max-w-2xl border border-[#E6EDFC] rounded-lg p-6 bg-white shadow-md"
                onFinish={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4 p-6">
                    <Controller
                        name="oldPassword"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Current Password"
                                placeholder="Enter your current password"
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                prefixIcon="lockIcon"
                                suffixIcon={showOldPassword ? "closeeyeIcon" : "openPasswordIcon"}
                                type={showOldPassword ? "text" : "password"}
                                isMandatory
                                error={errors.oldPassword?.message}
                                onValueChange={(data) => field.onChange(data.value)}
                                handlePassword={() => setShowOldPassword(!showOldPassword)}
                            />
                        )}
                    />

                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="New Password"
                                placeholder="Enter your new password"
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                prefixIcon="lockIcon"
                                suffixIcon={showNewPassword ? "closeeyeIcon" : "openPasswordIcon"}
                                type={showNewPassword ? "text" : "password"}
                                isMandatory
                                error={errors.newPassword?.message}
                                onValueChange={(data) => field.onChange(data.value)}
                                handlePassword={() => setShowNewPassword(!showNewPassword)}
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
                                placeholder="Enter confirm password"
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                prefixIcon="lockIcon"
                                suffixIcon={
                                    showConfirmPassword ? "closeeyeIcon" : "openPasswordIcon"
                                }
                                type={showConfirmPassword ? "text" : "password"}
                                isMandatory
                                error={errors.confirmPassword?.message}
                                onValueChange={(data) => field.onChange(data.value)}
                                handlePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        )}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="submit"
                            className="px-6 w-fit py-3 rounded-3xl bg-primary text-base transition font-normal text-[#FFFFFF]! cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default ChangePasswordModal1;
