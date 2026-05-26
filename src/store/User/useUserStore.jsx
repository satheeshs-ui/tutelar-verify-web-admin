import { create } from "zustand";
import UserService from "../../pages/User/UserServices/UserService";

const useUserStore = create((set) => ({
    userDetails: {},
    userList: [],
    shiftList: [],
    btnLoading: false,
    isLoading: false,
    error: null,
    setAgentData: (data) => set({ agentDetails: data }),
    setAgentList: (data) => set({ agentList: data }),
    setIsLoading: (isLoading) => set({ isLoading }),
    ...UserService(set),
}));

export default useUserStore;
