import { showFailure } from "../../../../../utils";
import ApiCall from "../../../../../utils/ApiCall";

const DASHBOARD_API_PATH = "admin/dashboard/data";

const DashboardService = (set) => ({
    // Fetch entity data

    fetchProfileData: async (merchantId) => {
        set({ loading: true, error: null });
        try {
            const params = merchantId ? `/${merchantId}` : "";
            const url = `${DASHBOARD_API_PATH}${params}`;

            const response = await new Promise((resolve, reject) => {
                ApiCall.get(url, (res) => {
                    res?.success ? resolve(res) : reject(res);
                });
            });

            set({
                refundData: response.data || {},
                loading: false,
            });

            return response.data;
        } catch (error) {
            const errorMsg = error?.message;
            set({ error: errorMsg, loading: false });
            showFailure(errorMsg);
            throw error;
        }
    },
});

export default DashboardService;
