import { create } from "zustand";
import { persist } from "zustand/middleware";
import LoginService from "../../pages/Login/Service/LoginService";

const useLoginStore = create(
    persist(
        (set) => ({
            btnLoading: false,
            error: null,
            authChecked: false,
            forcePasswordChange: false,

            clearUser: () => set({ userDetails: null, authChecked: false }),

            ...LoginService(set),
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useLoginStore;
