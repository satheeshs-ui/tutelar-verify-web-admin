import React from "react";
import { Form, Input } from "antd";

import ImageLoader from "./ImageLoader";
import { restrictInputValue } from "../../utils";

const AntdInput = ({
    label,
    name = "",
    isMandatory,
    isOptional,
    onValueChange,
    labelCss,
    error,
    customstyle,
    value,
    prefixIcon,
    suffixIcon,
    type,
    prefixCls,
    sufixCls,
    handlePassword,
    ...rest
}) => {
    const handleChange = (e) => {
         console.log(e)
        const rawValue = e.target.value;

        const restrictedValue = restrictInputValue(name, rawValue);

        onValueChange?.({ name, value: restrictedValue });
    };

    const handleBlur = (e) => {
          
        const rawValue = e.target.value.trim();
        const restrictedValue = restrictInputValue(name, rawValue);

        if (onValueChange) {
            onValueChange({ name, value: restrictedValue });
        }
    };

    return (
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
            <Input
                {...rest}
                type={type}
                autoComplete="off"
                prefix={
                    prefixIcon ? (
                        typeof prefixIcon === "string" ? (
                            <ImageLoader imageKey={prefixIcon} className={prefixCls || "w-4 h-4"} />
                        ) : (
                            (() => {
                                const Icon = prefixIcon;
                                return <Icon size={18} />;
                            })()
                        )
                    ) : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
                value={value ?? rest.value}
                name={name}
                className={`${error ? "border-red-500" : ""} ${
                    customstyle ? customstyle : ""
                } h-11 rounded-xl! focus:shadow-none `}
                disabled={rest.disabled}
                suffix={
                    suffixIcon ? (
                        <ImageLoader
                            imageKey={suffixIcon}
                            className={`${sufixCls ? sufixCls : "w-4 h-4"} cursor-pointer`}
                            onClick={handlePassword}
                        />
                    ) : undefined
                }
            />
        </Form.Item>
    );
};

export default AntdInput;

// import React from "react";
// import { Form, Input } from "antd";

// import ImageLoader from "./ImageLoader";
// import { restrictInputValue } from "../../utils";

// const AntdInput = ({
//     label,
//     name = "",
//     isMandatory,
//     isOptional,
//     onValueChange,
//     labelCss,
//     error,
//     customstyle,
//     value,
//     prefixIcon,
//     suffixIcon,
//     type,
//     prefixCls,
//     sufixCls,
//     handlePassword,
//     ...rest
// }) => {
//     const handleChange = (e) => {
//         const rawValue = e.target.value;

//         const restrictedValue = restrictInputValue(name, rawValue);

//         onValueChange?.({ name, value: restrictedValue });
//     };

//     const handleBlur = (e) => {
//         const rawValue = e.target.value.trim();
//         const restrictedValue = restrictInputValue(name, rawValue);

//         if (onValueChange) {
//             onValueChange({ name, value: restrictedValue });
//         }
//     };

//     return (
//         <Form.Item
//             label={
//                 <>
//                     {label && (
//                         <label
//                             className={
//                                 labelCss
//                                     ? labelCss
//                                     : "text-[#2C3436] font-normal text-[14px] leading-5"
//                             }
//                         >
//                             {label}
//                         </label>
//                     )}
//                     {isMandatory && <span className="text-[#FB2C36] ml-1">*</span>}
//                     {isOptional && <span className="ml-1">(Optional)</span>}
//                 </>
//             }
//             validateStatus={error ? "error" : ""}
//             help={error || ""}
//             layout="vertical"
//             className={`${!label && "input-label-disable"}  `}
//         >
//             <Input
//                 {...rest}
//                 type={type}
//                 autoComplete="off"
//                 prefix={
//                     prefixIcon ? (
//                         typeof prefixIcon === "string" ? (
//                             <ImageLoader imageKey={prefixIcon} className={prefixCls || "w-4 h-4"} />
//                         ) : (
//                             (() => {
//                                 const Icon = prefixIcon;
//                                 return <Icon size={18} />;
//                             })()
//                         )
//                     ) : undefined
//                 }
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={value ?? rest.value}
//                 name={name}
//                 className={`${error ? "border-red-500" : ""} ${
//                     customstyle ? customstyle : ""
//                 } h-11 rounded-lg focus:shadow-none `}
//                 suffix={
//                     suffixIcon ? (
//                         <ImageLoader
//                             imageKey={suffixIcon}
//                             className={`${sufixCls ? sufixCls : "w-4 h-4"} cursor-pointer`}
//                             onClick={handlePassword}
//                         />
//                     ) : undefined
//                 }
//             />
//         </Form.Item>
//     );
// };

// export default AntdInput;
