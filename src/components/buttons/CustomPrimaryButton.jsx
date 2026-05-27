import ImageLoader from "../ui/ImageLoader";

export const CustomPrimaryButton = ({
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
            className={`flex items-center justify-center px-6 w-full py-4 overall-button rounded-3xl ${
                disabled
                    ? "bg-primary-black-12 cursor-not-allowed text-gray-500 opacity-60"
                    : "bg-[#F04438]! cursor-pointer text-[#FFFFFF]!"
            } text-base transition font-semibold ${className} text-[14px]`}
            style={customstyle}
            onClick={disabled ? undefined : handleClick}
            disabled={disabled}
            {...rest}
        >
            {iconLeft && <ImageLoader imageKey={iconLeft} className="mr-2 w-4 h-4" />}

            {label}
            {iconRight && <ImageLoader imageKey={iconRight} className="ml-2 w-4 h-4" />}
        </button>
    );
};
