import React from "react";

const CommonButton = ({ label, onClick, icon }) => {
    return (
        <div>
            <button
                onClick={onClick}
                className="flex gap-2 !text-white !text-[14px] font-normal! !text-center !geomanist-font 
                !bg-gradient-to-b from-[#18667C] to-[#135263] rounded-[34px]! !px-5 !py-4 !cursor-pointer"
            >
                {icon}
                {label}
            </button>
        </div>
    );
};

export default CommonButton;
