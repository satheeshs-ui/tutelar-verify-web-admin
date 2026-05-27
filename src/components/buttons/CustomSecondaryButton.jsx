import React from "react";
import ImageLoader from "../ui/ImageLoader";

const CustomSecondaryButton = ({
  label,
  customstyle,
  onNotify,
  iconLeft = null,
  iconRight = null,
  className = "",
  notifyParams = null,
  disabled = false,
  htmlType = "button",
  ...rest
}) => {
  const handleClick = () => {
    if (typeof onNotify === "function") {
      onNotify(notifyParams);
    }
  };
  return (
    <button
      type={htmlType}
      className={`flex items-center justify-center px-6 w-full py-4 overall-button rounded-3xl  ${
        disabled
          ? "bg-primary-black-1 cursor-not-allowed text-gray-500 opacity-60"
          : "bg-[#F3F3F3] cursor-pointer "
      } cursor-pointer
            text-[#6A7174]! transition font-semibold ${className} text-[14px]`}
      style={customstyle}
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
      {...rest}
    >
      {iconLeft && (
        <ImageLoader
          imageKey={iconLeft}
          className="mr-3 w-3 h-3 brightness-0 saturate-100 invert-45 sepia-6 hue-rotate-169 contrast-88"
        />
      )}

      {label}
      {iconRight && (
        <ImageLoader imageKey={iconRight} className="ml-2 w-4 h-4" />
      )}
    </button>
  );
};

export default CustomSecondaryButton;
