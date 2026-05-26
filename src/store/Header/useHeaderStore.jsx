import { create } from "zustand";

export const useHeaderStore = create((set) => ({
    title: "",
    actions: null,

    setHeader: ({ title, actions }) => set({ title, actions }),
    clearHeader: () => set({ title: "", actions: null }),
}));
