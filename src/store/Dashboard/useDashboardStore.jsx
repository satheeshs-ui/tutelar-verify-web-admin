import { create } from "zustand";
import DeviceService from "../../Pages/Settings/DeviceHistory/DeviceHistoryService/DeviceService";
import DashboardService from "../../pages/Dashboard/DashboardServices/DashboardServices";
const LIMIT = 10;
const useDashboardStore = create((set) => ({
    dashboardData: {},
    loading: false,
    btnLoading: false,
    error: null,
    dashboardReturnData: {},
    page: 1,
    limit: LIMIT,
    isLoading: true,
    DashboardList: [],
    isLastPage: false,
    setDashboardData: (data) => set({ dashboardData: data }),
    ...DashboardService(set),
}));
export default useDashboardStore;
