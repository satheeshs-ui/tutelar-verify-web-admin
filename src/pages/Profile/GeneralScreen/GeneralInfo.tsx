import React from "react";
import { Form } from "antd";
import { checkValue } from "../../../utils";

const GeneralInfoScreen = ({ ...data }) => {
    const userData = data?.data;
    const GeneralInfo = [
        {
            label: "Full Name",
            value: userData?.name,
        },
        {
            label: "Agent ID",
            value: userData?.userId,
        },
        {
            label: "Email Address",
            value: userData?.email,
        },
        {
            label: "Contact Number",
            value: userData?.mobile,
        },
        {
            label: "Role",
            value: userData?.role,
        },
        {
            label: "Status",
            value: userData?.status,
        },
    ];

    return (
        <div className="py-6 pl-6">
            <Form layout="vertical" className="">
                <div className="w-full max-w-2xl border border-[#E6EDFC] rounded-lg p-6 bg-white shadow-md">
                    <div className="flex gap-4">
                        <div className="w-28 h-28 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-sm shrink-0">
                            Image
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {GeneralInfo?.map((item, i) => {
                                if (item.value === null || item.value === undefined) return null;

                                const isStatus = item.label === "Status";

                                return (
                                    <div className="flex flex-col" key={i}>
                                        <label className="text-gray-500 text-xs font-medium">
                                            {item.label}
                                        </label>

                                        {isStatus ? (
                                            <span
                                                className={`text-sm font-semibold capitalize ${
                                                    item.value === "active"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {checkValue(item.value)}
                                            </span>
                                        ) : (
                                            <p className="text-sm font-medium text-[#2B354E] capitalize">
                                                {checkValue(item.value)}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default GeneralInfoScreen;
