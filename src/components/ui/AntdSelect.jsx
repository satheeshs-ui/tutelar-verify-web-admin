import React from "react";
import { Form, Select } from "antd";
import ImageLoader from "./ImageLoader";

const AntdSelect = ({
    label,
    isMandatory,
    isOptional,
    options,
    value,
    error,
    placeholder,
    prefixIcon,
    customstyle,
    onChange,
    disabled,
    suffixIcon,
    sufixCls,
    mode,
    optionRender,
    onClear,
    maxTagCount,
    onPopupScroll,
    allowClear = true,
}) => {
    return (
        <Form.Item
            layout="vertical"
            // 🔥 If no label, REMOVE layout space completely
            label={
                label ? (
                    <>
                        <label className="text-[#0B1C20] text-[14px] font-medium">{label}</label>
                        {isMandatory && <span className="text-[#FB2C36] ml-1">*</span>}
                        {isOptional && <span className="ml-1">(Optional)</span>}
                    </>
                ) : null
            }
            colon={false} // removes ":" spacing
            validateStatus={error ? "error" : ""}
            help={error || ""}
            className={`${!label ? "!mb-0 !p-0" : "mb-3"}`} // 🔥 No margin if label missing
        >
            <Select
                allowClear={allowClear}
                mode={mode}
                optionRender={optionRender}
                maxTagCount={maxTagCount || "responsive"}
                prefix={prefixIcon ? <ImageLoader imageKey={prefixIcon} className="w-4 h-4" /> : ""}
                size="large"
                value={value || undefined}
                onChange={(val) => onChange?.(val)}
                className={`${error ? "border-red-500" : ""} ${
                    customstyle ? customstyle : ""
                } min-h-11 h-auto focus:shadow-none`}
                options={options}
                placeholder={placeholder}
                disabled={disabled}
                suffixIcon={
                    suffixIcon ? (
                        <ImageLoader
                            imageKey={suffixIcon}
                            className={`${sufixCls ? sufixCls : "w-4 h-4"} cursor-pointer`}
                        />
                    ) : undefined
                }
                onClear={onClear}
                onPopupScroll={onPopupScroll}
            />
        </Form.Item>
    );
};

export default AntdSelect;
