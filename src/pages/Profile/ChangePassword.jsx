import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Form } from "antd";
import ModalPopUp from "../../components/ui/ModalPopup";
import AntdInput from "../../components/ui/AntdInput";

import { PrimaryButton } from "../../components/buttons/PrimaryButton";

const ChangePasswordModal = ({ open, onSubmit, control, errors, handleSubmit }) => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!open) return null;
    return (
        <ModalPopUp open={open} onCancel={null} width={600} zIndex={9999}>
            {" "}
            <div className="relative mb-4 flex items-center justify-center">
                <p className="text-lg font-semibold text-[#2B354E] m-0 p-0">
                    Force Change Password
                </p>
            </div>
            <Form layout="vertical" className="w-full max-w-2xl" onFinish={handleSubmit(onSubmit)}>
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
                            onValueChange={(data) => field.onChange(data.value.trim())}
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
                            onValueChange={(data) => field.onChange(data.value.trim())}
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
                            suffixIcon={showConfirmPassword ? "closeeyeIcon" : "openPasswordIcon"}
                            type={showConfirmPassword ? "text" : "password"}
                            isMandatory
                            error={errors.confirmPassword?.message}
                            onValueChange={(data) => field.onChange(data.value.trim())}
                            handlePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    )}
                />

                <div className="flex items-end justify-end mt-6">
                    <div className="flex gap-3">
                        <div className="w-[140px]">
                            <PrimaryButton label="Save" iconLeft="saveicon" htmlType="submit" />
                        </div>
                    </div>
                </div>
            </Form>
        </ModalPopUp>
    );
};

export default ChangePasswordModal;
