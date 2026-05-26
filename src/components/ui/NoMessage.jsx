import React from "react";
import { Button } from "antd";
import { Plus, FilePlus } from "lucide-react";

const NoDataMessage = ({ contentOne, contentTwo, buttonText, navigateCreate, isNeedIcon }) => {
    return (
        <div className="flex items-center justify-center min-h-[500px] px-4">
            <div className=" text-center">
                {/* Icon */}
                {isNeedIcon && (
                    <div className="mx-auto mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-[#E0E7FF]">
                        <FilePlus className="w-5 h-5 text-[#4338CA]" />
                    </div>
                )}

                {/* Title */}
                <h2 className="text-lg font-semibold text-[#111928] mb-2">{contentOne}</h2>

                {/* Subtitle */}
                <p className="text-sm text-[#6B7280] mb-6">{contentTwo}</p>

                {/* Button */}
                {buttonText && (
                    <Button
                        type="primary"
                        onClick={navigateCreate}
                        className="!bg-[#0F9D8A] hover:!bg-[#0c8a79] !border-none rounded-lg px-5 h-10 inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NoDataMessage;
