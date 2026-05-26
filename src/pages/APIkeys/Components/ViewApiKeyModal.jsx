import { Check, Copy } from "lucide-react";
import userProfileStore from "../../../store/UserProfile/userProfileStore";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import AntdInput from "../../../components/ui/AntdInput";

const ViewApiKeyModal = ({ state, setState, environment }) => {
    const [copiedField, setCopiedField] = useState({
        username: false,
        password: false,
    });
    const [openPassword, setOpenPassword] = useState(true);

    const { verifyPassword, btnLoading } = userProfileStore();
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            password: "",
        },
    });

    const closeModal = () => {
        setState({ open: false });
        setCopiedField({
            username: false,
            password: false,
        });
    };

    const handleVerifyPassword = async (password) => {
        await verifyPassword({ password }, environment, (res) => {
            setState((s) => ({
                ...s,
                verified: true,
                username: res.data.data.username,
                secret: res.data.data.password,
            }));
        });
    };

    const handlePassword = () => {
        setOpenPassword(!openPassword);
    };

    const onVerifySubmit = async ({ password }) => {
        await handleVerifyPassword(password);
    };

    const copyToClipboard = (text, field) => {
        setCopiedField((prev) => ({
            ...prev,
            [field]: true,
        }));

        return navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10000">
            <div className="bg-white rounded-lg w-[420px] p-6">
                <h2 className="text-lg font-semibold mb-4 max-[500px]:text-[14px]">
                    {state.verified ? "API Credentials" : "Verify Password"}
                </h2>

                {!state.verified && (
                    <form>
                        <p className="text-sm text-gray-500 mb-3">
                            Please enter your password to view the API key
                        </p>

                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required",
                            }}
                            render={({ field, fieldState }) => (
                                <AntdInput
                                    {...field}
                                    label="Password"
                                    placeholder="Enter password"
                                    prefixIcon="lockIcon"
                                    suffixIcon={openPassword ? "closeeyeIcon" : "openPasswordIcon"}
                                    type={openPassword ? "password" : "text"}
                                    labelCss="text-[#40444C] text-[14px] font-medium"
                                    error={fieldState.error?.message}
                                    onValueChange={(data) => field.onChange(data.value)}
                                    handlePassword={handlePassword}
                                />
                            )}
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <PrimaryButton
                                label="Cancel"
                                variant="secondary"
                                onNotify={closeModal}
                            />

                            <PrimaryButton
                                label={btnLoading ? "Verifying..." : "Verify"}
                                disabled={btnLoading}
                                onNotify={handleSubmit(onVerifySubmit, () => {})}
                            />
                        </div>
                    </form>
                )}

                {state.verified && (
                    <>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Username</p>

                            <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                                <span className="text-sm font-mono truncate">{state.username}</span>

                                {copiedField.username ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Copy
                                        className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-800"
                                        onClick={() => copyToClipboard(state.username, "username")}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">API Password</p>

                            <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                                <span className="text-sm font-mono truncate">{state.secret}</span>

                                {copiedField.password ? (
                                    <Check className="w-8 h-8 text-green-600" />
                                ) : (
                                    <Copy
                                        className="w-8 h-8 cursor-pointer text-gray-600 hover:text-gray-800"
                                        onClick={() => copyToClipboard(state.secret, "password")}
                                    />
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">
                            Copy and store this key securely. It won’t be shown again.
                        </p>

                        <div className="flex justify-end">
                            <PrimaryButton
                                label="Close"
                                variant="secondary"
                                onNotify={() => {
                                    reset();
                                    closeModal();
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewApiKeyModal;
