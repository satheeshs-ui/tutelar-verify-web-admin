import { Form } from "antd";
import { Controller } from "react-hook-form";
import ModalPopUp from "../../components/ui/ModalPopup";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import AntdInput from "../../components/ui/AntdInput";

export default function AgentModal({
    open,
    onClose,
    onSubmit,
    control,
    errors,
    handleSubmit,
    userId,
}) {
    return (
        <ModalPopUp open={open} onCancel={onClose} width={600}>
            <div className="p-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                    {userId ? "Edit" : "Add"} Agent
                </h2>

                <Form
                    layout="vertical"
                    className="w-full"
                    //   onFinish={handleSubmit(onSubmit)}
                >
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Agent Name"
                                prefixIcon="nameIcon"
                                placeholder="Enter name"
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                isMandatory
                                error={errors.name?.message}
                                onValueChange={(data) => field.onChange(data.value)}
                                value={field.value || undefined}
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email format",
                            },
                        }}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Email"
                                placeholder="Enter email"
                                prefixIcon="emailIcon"
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                isMandatory
                                value={field.value || undefined}
                                error={errors.email?.message}
                                onValueChange={(data) => field.onChange(data.value.trim())}
                            />
                        )}
                    />

                    <Controller
                        name="mobile"
                        control={control}
                        rules={{
                            required: "Mobile number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Mobile number must be 10 digits",
                            },
                        }}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Mobile Number"
                                placeholder="Enter mobile number"
                                prefixIcon="phoneIconProfile"
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                isMandatory
                                error={errors.mobile?.message}
                                onValueChange={(data) => {
                                    const value = data.value.replace(/\D/g, "");
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Role"
                                placeholder="Agent"
                                disabled
                                labelCss="text-[#40444C] text-[14px] font-medium"
                                isMandatory
                            />
                        )}
                    />

                    <div className="">
                        <PrimaryButton
                            label={userId ? "Edit Agent" : "Create Agent"}
                            onNotify={handleSubmit(onSubmit)}
                        />
                    </div>
                </Form>
            </div>
        </ModalPopUp>
    );
}
