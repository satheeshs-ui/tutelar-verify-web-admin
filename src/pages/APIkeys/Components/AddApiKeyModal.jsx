import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AntdSelect from "../../../components/ui/AntdSelect";
import DatePickerField from "../../../components/ui/DatePickerField";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import dayjs from "dayjs";
const addApiKeySchema = z.object({
    environment: z.string().min(1, "Environment is required"),
});

const AddApiKeyModal = ({ open, onClose, onSubmit, regenerateKeyEnv }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(addApiKeySchema),
        defaultValues: {
            environment: "",
        },
    });

    const [expiresAt, setExpiresAt] = useState(null);

    useEffect(() => {
        if (open) {
            reset({
                environment: regenerateKeyEnv ?? "",
            });
        }
    }, [open, regenerateKeyEnv, reset]);

    const submitHandler = async (data) => {
        data = { ...data, expiresAt };
        await onSubmit(data);
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-1000">
            <div className="bg-white rounded-lg w-[420px] p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold">
                        {regenerateKeyEnv ? "Regenerate " : "Generate "} API Key
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form>
                    {/* Environment */}
                    <div className="mb-4">
                        <Controller
                            name="environment"
                            control={control}
                            // rules={{ required: "Environment is required" }}
                            render={({ field }) => (
                                <AntdSelect
                                    {...field}
                                    label="Environment"
                                    placeholder="Select environment"
                                    options={[
                                        { label: "Test", value: "test" },
                                        { label: "Live", value: "live" },
                                    ]}
                                    labelCss="text-[#40444C] text-[14px] font-medium"
                                    error={errors.environment?.message}
                                    isMandatory
                                    disabled={!!regenerateKeyEnv}
                                    onValueChange={(data) => field.onChange(data.value)}
                                />
                            )}
                        />
                    </div>

                    <DatePickerField
                        label={"Expires at"}
                        placeholder="Select Date"
                        suffixIcon={"DatePickericon"}
                        value={expiresAt}
                        // onValueChange={(e) => setExpiresAt(e.dateString)}
                        onValueChange={(date, dateString) => setExpiresAt(dateString)}
                        disabledDate={(current) => current && current <= dayjs().endOf("day")}
                    />

                    <div className="mt-5">
                        <PrimaryButton
                            label={isSubmitting ? "Creating..." : "Generate"}
                            onNotify={handleSubmit(submitHandler, () => {})}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddApiKeyModal;
