import { create } from "zustand";
import ProfileService from "../../pages/Profile/ProfileServices/ProfileService";

const userProfileStore = create((set) => ({
    userData: null,
    isLoading: false,
    btnLoading: false,
    error: null,

    setUserData: (data) => set({ userData: data }),
    setIsLoading: (value) => set({ isLoading: value }),

    ...ProfileService(set),
}));

export default userProfileStore;
