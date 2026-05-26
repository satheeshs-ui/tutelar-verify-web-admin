// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import * as ApiCall from "../config/api/api.service";

// export const useAuthStore = create(
//     persist(
//         (set) => ({
//             deviceId: null,
//             accessToken: null,
//             loginDetails: null,
//             refreshToken: null,
//             btnLoading: false,
//             login: (loginDatas) =>
//                 set({
//                     deviceId: loginDatas.deviceId,
//                     accessToken: loginDatas.accessToken,
//                     loginDetails: loginDatas,
//                 }),

//             forgotPassword: async (payload) => {
//                 set({ btnLoading: true });
//                 try {
//                     const res = await ApiCall.post("/forgot-password", payload);
//                     return res;
//                 } finally {
//                     set({ btnLoading: false });
//                 }
//             },

//             resetPassword: async (payload) => {
//                 set({ btnLoading: true });
//                 try {
//                     const res = await ApiCall.post("/reset-password", payload);
//                     return res;
//                 } finally {
//                     set({ btnLoading: false });
//                 }
//             },

//             logout: () =>
//                 set({
//                     deviceId: null,
//                     accessToken: null,
//                     loginDetails: null,
//                 }),

//             setAccessToken: (token) =>
//                 set({
//                     accessToken: token,
//                 }),
//         }),
//         {
//             name: "auth-storage",
//         }
//     )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as ApiCall from "../config/api/api.service";

const useAuthStore = create(
    persist(
        (set) => ({
            deviceId: null,
            accessToken: null,
            loginDetails: null,
            refreshToken: null,
            btnLoading: false,

            login: (loginDatas) =>
                set({
                    deviceId: loginDatas.deviceId,
                    accessToken: loginDatas.accessToken,
                    loginDetails: loginDatas,
                }),

            forgotPassword: async (payload) => {
                set({ btnLoading: true });
                try {
                    const res = await ApiCall.post("/video-kyc/auth/forget-password", payload);
                    return res;
                } finally {
                    set({ btnLoading: false });
                }
            },

            resetPassword: async (payload) => {
                set({ btnLoading: true });
                try {
                    const res = await ApiCall.post("/video-kyc/auth/reset-password", payload);
                    return res;
                } finally {
                    set({ btnLoading: false });
                }
            },

            logout: () =>
                set({
                    deviceId: null,
                    accessToken: null,
                    loginDetails: null,
                }),

            setAccessToken: (token) =>
                set({
                    accessToken: token,
                }),
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;
