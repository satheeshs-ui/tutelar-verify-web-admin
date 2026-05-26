import { createRoot } from "react-dom/client";

import "./index.css";
import "antd/dist/reset.css";
import "./assets/style/theme.css";
import "./assets/style/fonts.css";
import { Toaster } from "react-hot-toast";
import "./assets/style/ANTD/inputAntd.css";
import "./assets/style/ANTD/selectAntd.css";
import "./assets/style/ANTD/buttonAntd.css";
import "./assets/style/ANTD/checkboxAntd.css";
import "./assets/style/ANTD/collapseAntd.css";
import "./assets/style/ANTD/tableAntd.css";
import "./assets/style/ANTD/popoverAntd.css";
import "./assets/style/ANTD/datepickerAntd.css";
import "./assets/style/ANTD/card.css";
import "./assets/style/ANTD/commonAntd.css";
import "./assets/style/ANTD/customselect.css";
import "./assets/style/ANTD/tabsAntd.css";

import { ConfigProvider } from "antd";
import { CookiesProvider } from "react-cookie";

import AppRoutes from "./routes/AppRoutes";

import "./config/api/axiosInstance.js";
import "./config/api/authInterceptor.js";

const root = createRoot(document.getElementById("root"));

root.render(
    <CookiesProvider>
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "Geomanist, sans-serif",
                },
            }}
        >
            <Toaster position="top-center" />
            <AppRoutes />
        </ConfigProvider>
    </CookiesProvider>
);
