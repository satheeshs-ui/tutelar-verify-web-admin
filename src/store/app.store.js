import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
    persist(
        (set) => ({
            userDetails: null,
            menuDetails: [],
            notifications: [],

            setUserDetails: (data) => set(() => ({ userDetails: data })),
            setMenuDetails: (data) => set({ menuDetails: data }),
            setNotifications: (data) => set({ notifications: data }),
            clearAppStore: () =>
                set({
                    userDetails: null,
                    menuDetails: [],
                }),
        }),
        {
            name: "app-storage",
        }
    )
);
