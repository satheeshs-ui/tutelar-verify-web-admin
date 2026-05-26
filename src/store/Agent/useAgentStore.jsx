import { create } from "zustand";
import AgentService from "../../pages/Agent/AgentServices/AgentService";

const useAgentStore = create((set) => ({
    agentDetails: {},
    agentList: [],
    shiftList: [],
    btnLoading: false,
    isLoading: false,
    error: null,
    setAgentData: (data) => set({ agentDetails: data }),
    setAgentList: (data) => set({ agentList: data }),
    setIsLoading: (isLoading) => set({ isLoading }),
    ...AgentService(set),
}));

export default useAgentStore;
