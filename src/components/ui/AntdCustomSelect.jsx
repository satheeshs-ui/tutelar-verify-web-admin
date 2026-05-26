import React, { useState } from "react";
import { Form, Select } from "antd";
import ImageLoader from "./ImageLoader";

const AntdCustomSelect = ({
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
    // suffixIcon,
    sufixCls,
    mode,
    optionRender,
    onClear,
    // new add
    popupRender,
    onPopupScroll,
    maxTagCount,
    optionLabelProp,
    defaultActiveFirstOption,
    loading,
}) => {
    const [open] = useState(false);
    return (
        <Form.Item
            layout="vertical"
            // If no label, REMOVE layout space completely
            label={
                label ? (
                    <>
                        <label>{label}</label>
                        {isMandatory && <span className="text-[#FB2C36] ml-1">*</span>}
                        {isOptional && <span className="ml-1">(Optional)</span>}
                    </>
                ) : null
            }
            colon={false} // removes ":" spacing
            validateStatus={error ? "error" : ""}
            help={error || ""}
            className={`w-full mb-0!`} // 🔥 No margin if label missing
        >
            <Select
                allowClear
                mode={mode}
                optionRender={optionRender}
                popupClassName="custom-agent-dropdown"
                prefix={prefixIcon ? <ImageLoader imageKey={prefixIcon} className="w-4 h-4" /> : ""}
                size="large"
                value={value || undefined}
                onChange={(val) => onChange?.(val)}
                className={`w-full h-11 rounded-xl! border ${error ? "border-red-500" : ""} ${
                    customstyle ? customstyle : ""
                } h-11 rounded-lg focus:shadow-none`}
                options={options}
                placeholder={placeholder}
                disabled={disabled}
                loading={loading}
                popupRender={popupRender}
                onPopupScroll={onPopupScroll}
                maxTagCount={maxTagCount}
                optionLabelProp={optionLabelProp}
                defaultActiveFirstOption={defaultActiveFirstOption}
                suffixIcon={
                    <ImageLoader
                        imageKey={"vkycDropdown"}
                        className={`${
                            sufixCls ? sufixCls : "w-3 h-3"
                        } transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                    />
                }
                // suffixIcon={
                //     suffixIcon ? (
                //         <ImageLoader
                //             imageKey={'vkycDropdown'}
                //             className={`${sufixCls ? sufixCls : "w-3 h-3"} cursor-pointer`}
                //         />
                //     ) : undefined
                // }
                onClear={onClear}
            />
        </Form.Item>
    );
};

export default AntdCustomSelect;
