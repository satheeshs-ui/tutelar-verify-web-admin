import { Outlet } from "react-router-dom";
import React, { useState, useEffect, Suspense } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import AppHeader from "./components/Header/AppHeader";
import userProfileStore from "../store/UserProfile/userProfileStore";
import { useAppStore } from "../store/app.store";
import LottieLoader from "../components/ui/LottieUnique/LottieLoader";
import useNotify from "../components/hooks/useNotify";
import useAgentStore from "../store/Agent/useAgentStore";
import SwitchField from "../components/ui/SwitchField";
import ChangePasswordModal from "../pages/Profile/ChangePassword";
import { useForm } from "react-hook-form";
import useLoginStore from "../store/Login/useLoginStore";

export default function MainLayout() {
    useNotify();
    const { getUserProfile } = userProfileStore();
    const { setUserDetails, userDetails } = useAppStore();
    const { updateUser } = useAgentStore();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [headerAction, setHeaderAction] = useState(null);
    const [pageTitle, setPageTitle] = useState("");
    const [isBreakOn, setIsBreak] = useState(false);
    const forcePasswordChange = useLoginStore((s) => s.forcePasswordChange);
    const { changePassword, logoutUser } = userProfileStore();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            const profileData = await getUserProfile();
            if (profileData) {
                setUserDetails(profileData?.data?.data);
            }
        };
        fetchProfile();
    }, [getUserProfile, setUserDetails]);

    const handleChangePassword = async (data) => {
        if (data.newPassword !== data.confirmPassword) return;

        const payload = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        };

        const res = await changePassword(payload);

        if (res?.data?.success) {
            logoutUser();
        }
    };
    const handleBreakChange = (v) => {
        setIsBreak(v);
        //setCookie("isBreak", v);
        updateUser(
            userDetails?.userDetails?.userId,
            { activityStatus: v ? "break_in" : "available" },
            () => {
                window.location.reload();
            }
        );
    };
    return (
        <>
            <ChangePasswordModal
                open={forcePasswordChange}
                onClose={() => {}}
                onSubmit={handleChangePassword}
                control={control}
                errors={errors}
                handleSubmit={handleSubmit}
            />
            <Suspense fallback={<LottieLoader lottieKey="shieldloaderIcon" />}>
                <div className="h-screen bg-[#f5f7f9] p-3">
                    <div className="flex h-full w-full gap-3">
                        {!forcePasswordChange && <Sidebar />}

                        <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-2xl border border-primary-black-1">
                            {!forcePasswordChange && (
                                <header className="">
                                    <AppHeader
                                        renderButton={headerAction || undefined}
                                        title={pageTitle || undefined}
                                    />
                                </header>
                            )}

                            <div className="flex flex-1 overflow-hidden">
                                {!forcePasswordChange && (
                                    <main className="flex-1 overflow-y-auto p-4">
                                        {" "}
                                        <Outlet
                                            context={{
                                                setHeaderAction,
                                                isFilterOpen,
                                                setIsFilterOpen,
                                                setPageTitle,
                                                pageTitle,
                                            }}
                                        />
                                    </main>
                                )}

                                {isFilterOpen && (
                                    <aside className="w-[320px] border-l border-gray-200 bg-white overflow-y-auto"></aside>
                                )}
                            </div>
                        </div>
                    </div>
                    {userDetails?.userDetails?.activity?.status === "break_in" && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-100000 flex items-center justify-center">
                            <div className="bg-white px-6 py-3 rounded-lg shadow-md text-gray-700 font-medium flex items-center gap-2">
                                You are on Break
                                <div>
                                    <SwitchField
                                        name=""
                                        enabled={
                                            isBreakOn ||
                                            userDetails?.userDetails?.activity?.status ===
                                                "break_in"
                                        }
                                        setEnabled={(v) => handleBreakChange(v)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Suspense>
        </>
    );
}

// import { Outlet } from "react-router-dom";
// import React, { useState, useEffect, Suspense } from "react";

// import Sidebar from "./components/Sidebar/Sidebar";
// import AppHeader from "./components/Header/AppHeader";
// import userProfileStore from "../store/UserProfile/userProfileStore";
// import { useAppStore } from "../store/app.store";
// import LottieLoader from "../components/ui/LottieUnique/LottieLoader";
// import useNotify from "../components/hooks/useNotify";
// import ChangePasswordModal from "../pages/Profile/ChangePassword";
// import { useForm } from "react-hook-form";
// import useLoginStore from "../store/Login/useLoginStore";

// export default function MainLayout() {
//     useNotify();
//     const { getUserProfile } = userProfileStore();
//     const { setUserDetails, userDetails } = useAppStore();

//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [headerAction, setHeaderAction] = useState(null);
//     const [pageTitle, setPageTitle] = useState("");

//     const forcePasswordChange = useLoginStore((s) => s.forcePasswordChange);
//     const { changePassword, logoutUser } = userProfileStore();

//     const {
//         handleSubmit,
//         control,
//         formState: { errors },
//     } = useForm();

//     useEffect(() => {
//         const fetchProfile = async () => {
//             const profileData = await getUserProfile();
//             if (profileData) {
//                 setUserDetails(profileData?.data?.data);
//             }
//         };
//         fetchProfile();
//     }, [getUserProfile, setUserDetails]);

//     const handleChangePassword = async (data) => {
//         // confirm password check
//         if (data.newPassword !== data.confirmPassword) {
//             return;
//         }

//         // remove confirmPassword
//         const payload = {
//             oldPassword: data.oldPassword,
//             newPassword: data.newPassword,
//         };

//         const res = await changePassword(payload);

//         if (res?.data?.success) {
//             logoutUser();
//         }
//     };

//     return (
//         <>
//             <ChangePasswordModal
//                 open={forcePasswordChange}
//                 onClose={() => {}}
//                 onSubmit={handleChangePassword}
//                 control={control}
//                 errors={errors}
//                 handleSubmit={handleSubmit}
//             />
//             {forcePasswordChange && <div className="fixed inset-0 bg-black/40 z-50" />}
//             <Suspense fallback={<LottieLoader lottieKey="shieldloaderIcon" />}>
//                 <div className="h-screen bg-[#f5f7f9] p-3">
//                     <div className="flex h-full w-full gap-3">
//                         {" "}
//                         {/* Sidebar */}
//                         {/* <Sidebar /> */}
//                         {!forcePasswordChange && <Sidebar />}
//                         {/* Right Side Layout */}
//                         <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-2xl border border-primary-black-1">
//                             {!forcePasswordChange && (
//                                 <header className="h-[68px]">
//                                     <AppHeader
//                                         renderButton={headerAction || undefined}
//                                         title={pageTitle || undefined}
//                                     />
//                                 </header>
//                             )}

//                             {/* Content Wrapper */}
//                             <div className="flex flex-1 overflow-hidden">
//                                 {!forcePasswordChange && (
//                                     <main className="flex-1 overflow-y-auto p-4">
//                                         <Outlet
//                                             context={{
//                                                 setHeaderAction,
//                                                 isFilterOpen,
//                                                 setIsFilterOpen,
//                                                 setPageTitle,
//                                                 pageTitle,
//                                             }}
//                                         />
//                                     </main>
//                                 )}

//                                 {/* Optional Filter Panel */}
//                                 {isFilterOpen && (
//                                     <aside className="w-[320px] border-l border-gray-200 bg-white overflow-y-auto">
//                                         {/* Filter content goes here */}
//                                     </aside>
//                                 )}
//                                 {userDetails?.userDetails?.activity?.status === "break_in" && (
//                                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center">
//                                         <div className="bg-white px-6 py-3 rounded-lg shadow-md text-gray-700 font-medium">
//                                             You are on Break
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Suspense>
//         </>
//     );
// }
