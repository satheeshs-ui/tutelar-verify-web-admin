import React from "react";
import { DatePicker, Form } from "antd";
import ImageLoader from "./ImageLoader";
import dayjs from "dayjs";
const DatePickerField = ({
    label,
    value,
    onValueChange,
    // required = false,
    suffixIcon,
    placeholder,
    showTime = false,
    dobDate = false,
    labelCss,
    isMandatory = false,
    isOptional = false,
    error,
    inputClassName = "",
    ...field
}) => {
    const handleChange = (date) => {
        onValueChange?.(date, date);
    };
    // const disable = "AM";
    return (
        // <div className="flex flex-col gap-1">
        //     <label className="text-[#0B1C20] text-[14px] font-medium mb-[10px]">
        //         {label} {required && <span className="text-red-500">*</span>}
        //     </label>
        <Form.Item
            label={
                <>
                    {label && (
                        <label
                            className={
                                labelCss
                                    ? labelCss
                                    : "text-[#0B1C20] font-normal text-[14px] leading-5"
                            }
                        >
                            {label}
                        </label>
                    )}
                    {isMandatory && <span className="text-[#FB2C36] ml-1">*</span>}
                    {isOptional && <span className="ml-1">(Optional)</span>}
                </>
            }
            validateStatus={error ? "error" : ""}
            help={error || ""}
            layout="vertical"
            className={`${!label && "input-label-disable"}  `}
        >
            <DatePicker
                {...field}
                value={value || null}
                placeholder={placeholder}
                onChange={handleChange}
                showTime={
                    showTime
                        ? {
                              use12Hours: true,
                              format: "hh:mm A",
                          }
                        : false
                }
                format={showTime ? "YYYY-MM-DD hh:mm A" : "YYYY-MM-DD"}
                className={`custom-date-picker w-full rounded-xl! border-2 border-blue-500 ${inputClassName}`}
                disabledDate={
                    (current) => {
                        if (field?.disabledDate && field.disabledDate(current)) {
                            return true;
                        }

                        if (dobDate) {
                            return current && current > dayjs().endOf("day");
                        }

                        if (showTime) {
                            return current && current < dayjs().startOf("day");
                        }

                        return false;
                    }
                    // dobDate
                    //     ? current > dayjs().startOf("day")
                    //     : showTime && current && current < dayjs().startOf("day")
                }
                disabledTime={(current) => {
                    if (!current) return {};

                    const now = dayjs();
                    const isToday = current.isSame(now, "day");

                    if (!isToday) return {};

                    return {
                        disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),

                        disabledMinutes: (selectedHour) =>
                            selectedHour === now.hour()
                                ? Array.from({ length: now.minute() }, (_, i) => i)
                                : [],

                        disabledSeconds: () => [],
                    };
                }}
                suffixIcon={
                    suffixIcon ? (
                        <ImageLoader imageKey={suffixIcon} className="w-4 h-4 cursor-pointer" />
                    ) : undefined
                }
            />
        </Form.Item>
        // </div>
    );
};

export default DatePickerField;
