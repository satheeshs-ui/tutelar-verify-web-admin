import { create } from "zustand";
import AcxtivityService from "../../pages/Activity/Services/ActivityService";

const useActivityStore = create((set) => ({
    activityList: [],
    isLoading: false,
    ...AcxtivityService(set),
}));

export default useActivityStore;
