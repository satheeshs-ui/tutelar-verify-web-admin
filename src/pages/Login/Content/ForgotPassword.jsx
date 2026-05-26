import React, { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotSchema } from "../Validation/forgotSchema";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { showFailure, showSuccess } from "../../../utils";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useAuthStore from "../../../store/auth.store";
import AntdInput from "../../../components/ui/AntdInput";
import config from "../../../utils/config";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword, btnLoading } = useAuthStore();
    const recaptchaRef = useRef(null);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data) => {
        const token = await recaptchaRef.current?.executeAsync();
        const res = await forgotPassword({ ...data, recaptchaToken: token });
        if (res.data.success) {
            showSuccess(res.data.message);
            navigate("/reset-password", {
                state: { email: data.email },
            });
        } else {
            showFailure(res.data.message);
        }
    };

    return (
        <div className="flex items-center p-6 w-full">
            <Form layout="vertical" className="w-full" onFinish={() => handleSubmit(onSubmit)()}>
                <div className="text-[#101828] text-[32px] font-medium">Forgot Password</div>
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
                            onValueChange={(data) => field.onChange(data.value.trim())}
                        />
                    )}
                />

                <div className="mt-4">
                    <PrimaryButton label="Verify Email" htmlType="submit" disabled={btnLoading} />
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
            </Form>
        </div>
    );
};

export default ForgotPassword;
