import { create } from "zustand";
import HistoryService from "../../pages/History/Services/HistoryService";

const useDeviceHistoryStore = create((set) => ({
    deviceHistoryList: [],
    isLoading: false,
    ...HistoryService(set),
}));

export default useDeviceHistoryStore;
