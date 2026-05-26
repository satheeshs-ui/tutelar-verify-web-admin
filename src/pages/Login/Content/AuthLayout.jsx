import { Outlet } from "react-router-dom";
import React, { Suspense } from "react";
import LottieLoader from "../../../components/ui/LottieUnique/LottieLoader";
import Banner from "./Banner";
import ImageLoader from "../../../components/ui/ImageLoader";

export default function AuthLayout() {
    return (
        <Suspense fallback={<LottieLoader lottieKey="shieldloaderIcon" />}>
            <div className="h-screen bg-[#f5f7f9]">
                <div className="flex h-full w-full">
                    <Banner />

                    <div className="flex flex-1 items-center justify-center bg-white z-10">
                        <div className="w-full max-w-[600px] px-8">
                            <div className="mb-10 flex justify-center items-center">
                                <ImageLoader imageKey="tutelarlogo" />
                            </div>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
