import React, { useCallback, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { DatePicker, Checkbox, Form } from "antd";
import dayjs from "dayjs";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AntdInput from "../../../../../components/ui/AntdInput";
import { createShift, updateShift } from "../../Services/shift.service";
import { useNavigate, useParams } from "react-router-dom";
import { showFailure, showSuccess } from "../../../../../utils";
import { useHeaderStore } from "../../../../../store/Header/useHeaderStore";
import { PrimaryButton } from "../../../../../components/buttons/PrimaryButton";

const { RangePicker } = DatePicker;

const daysMap = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const schema = yup.object().shape({
    name: yup.string().required("Shift name is required"),

    timing: yup
        .array()
        .required("Start & End time is required")
        .test(
            "required-time",
            "Start & End time is required",
            (value) => value && value.length === 2
        )
        .test("valid-time", "End time must be after start time", (value) => {
            if (!value || value.length !== 2) return true;

            return dayjs(value[1]).isAfter(dayjs(value[0]));
        }),

    shiftDays: yup
        .object()
        .required("Working days is required")
        .test("required-days", "Select at least one working day", (value) => {
            if (!value) return false;

            return Object.values(value).some((d) => d?.isPresent === true);
        }),

    is_default: yup.boolean(),
});

export default function AddEditShiftManagement() {
    const { setHeader, clearHeader } = useHeaderStore();

    const navigate = useNavigate();
    const { editId } = useParams();
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            timing: [],
            is_default: false,
            shiftDays: {},
        },
    });

    const shiftDays = useWatch({ control, name: "shiftDays" });

    const toggleDay = (day) => {
        const current = shiftDays?.[day]?.isPresent;

        setValue("shiftDays", {
            ...shiftDays,
            [day]: { isPresent: !current },
        });
    };

    const formatTime = (time) => {
        if (!time) return "-";

        const date = new Date(time);

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };
    const onSubmit = useCallback(
        async (data) => {
            try {
                const payload = {
                    name: data.name,
                    timing: {
                        startTime: formatTime(data.timing[0]),
                        endTime: formatTime(data.timing[1]),
                    },
                    is_default: data.is_default,
                    shiftDays: daysMap.reduce((acc, day) => {
                        acc[day] = {
                            isPresent: data.shiftDays?.[day]?.isPresent || false,
                        };
                        return acc;
                    }, {}),
                };

                let response;

                if (editId) {
                    response = await updateShift(editId, payload);
                } else {
                    response = await createShift(payload);
                }

                const resData = response?.data;

                if (resData?.success === false) {
                    return showFailure(resData);
                }

                showSuccess(resData?.message || "Shift saved successfully");
                navigate(-1);
            } catch (err) {
                showFailure(err?.response?.data?.message || err?.message || "Something went wrong");
            }
        },
        [editId, navigate]
    );

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex items-center gap-3">
                    <div>
                        <PrimaryButton
                            label={editId ? "Update Shift" : "Save Shift"}
                            onNotify={handleSubmit(onSubmit)}
                            iconLeft={"CreateIcon"}
                        />
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader]);

    return (
        <div className="p-4">
            <div className="mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <Form layout="vertical" className="w-full" onFinish={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-6 space-y-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        {...field}
                                        label="Shift Name"
                                        placeholder="Enter shift name"
                                        labelCss="text-[#40444C] text-[14px] font-medium"
                                        isMandatory
                                        error={errors.name?.message}
                                        onValueChange={(data) => field.onChange(data.value)}
                                    />
                                )}
                            />

                            <div className="mt-3">
                                <label className="text-[#40444C] text-[14px] font-medium">
                                    Start & End Time <span className="text-red-500">*</span>
                                </label>

                                <Controller
                                    name="timing"
                                    control={control}
                                    render={({ field }) => (
                                        <RangePicker
                                            {...field}
                                            picker="time"
                                            format="HH:mm"
                                            className="w-full my-1! h-10 rounded-xl"
                                            onChange={(val) => field.onChange(val)}
                                            inputReadOnly
                                        />
                                    )}
                                />

                                <p className="text-rejected text-[14px] my-.1!">
                                    {errors.timing?.message}
                                </p>
                            </div>

                            <Controller
                                name="is_default"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} checked={field.value}>
                                        Set as Default Shift
                                    </Checkbox>
                                )}
                            />
                        </div>

                        <div className="col-span-6">
                            <label className="text-[#40444C] text-[14px] font-medium">
                                Working Days <span className="text-red-500">*</span>
                            </label>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {daysMap.map((day) => {
                                    const active = shiftDays?.[day]?.isPresent;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`cursor-pointer px-4 py-1.5 rounded-full text-sm capitalize! transition-all
                ${active ? "bg-primary text-white! shadow-sm" : "bg-gray-100 hover:bg-gray-200"}`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="text-rejected text-[14px] my-1!">
                                {errors.shiftDays?.message}
                            </p>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}
