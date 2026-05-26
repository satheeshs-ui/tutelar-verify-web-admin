import React, { useEffect, useState } from "react";
import ImageLoader from "../../../components/ui/ImageLoader";
import { Video, ShieldCheck, Zap } from "lucide-react";
export default function Banner() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % data.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);
    const data = [
        {
            icon: (
                <div className="bg-[#CBFBF1] p-4 rounded-3xl">
                    <Video className="text-[#009689] w-6 h-6" />
                </div>
            ),
            lable: "Video Verification",
            description: "Secure real-time authentication",
            note: "#009689",
        },
        {
            icon: (
                <div className="bg-[#D0FAE5] p-4 rounded-3xl">
                    <ShieldCheck className="text-[#009966] w-6 h-6" />
                </div>
            ),
            lable: "Secure & Compliant",
            description: "Bank-grade encryption",
            note: "#009966",
        },
        {
            icon: (
                <div className="bg-[#CEFAFE] p-4 rounded-3xl">
                    <Zap className="text-[#0092B8] w-6 h-6" />
                </div>
            ),

            lable: "Instant Processing",
            description: "Fast verification work flow",
            note: "#0092B8",
        },
    ];
    return (
        <div className="hidden md:flex flex-col w-full md:w-[45%] lg:w-[45%] rounded-2xl bg-linear-to-b from-[#ECF8FB] to-[#E7FAFF] relative overflow-hidden">
            <div className="flex flex-col justify-center items-start lg:items-center min-h-[60vh] lg:min-h-screen px-6 md:px-10 lg:px-16 py-10 relative z-10">
                <div className="w-full max-w-[560px]">
                    <div className="flex items-center font-bold text-[16px] md:text-[18px] gap-3">
                        <p className="bg-primary px-2 py-2 rounded text-white">VK</p>
                        <p>VKYC</p>
                    </div>

                    <div className="flex flex-col gap-4 mt-15">
                        {data?.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 transition-all duration-500 bg-white rounded-2xl ${
                                    activeIndex === index
                                        ? "opacity-100 translate-x-0 scale-100"
                                        : "opacity-50 translate-x-2 scale-95"
                                }`}
                            >
                                <div className="flex items-center justify-between w-full gap-3 px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <div>{item.icon}</div>

                                        <div>
                                            <p className="font-semibold text-[#1E2939] text-[16px] md:text-[18px] mb-1">
                                                {item.lable}
                                            </p>
                                            <p className="text-xs md:text-sm text-[#6A7282]">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span
                                            className="w-3 h-3 rounded-full block"
                                            style={{ backgroundColor: item.note }}
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-[#4A5565] text-sm md:text-[16px] lg:text-[18px] font-normal mt-10 md:mt-16 lg:mt-20">
                        "Streamline your customer onboarding with advanced video KYC technology"
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full">
                <ImageLoader
                    imageKey="authCircle"
                    className="w-[200px] md:w-[300px] lg:w-[400px]"
                />
            </div>
        </div>
    );
}
