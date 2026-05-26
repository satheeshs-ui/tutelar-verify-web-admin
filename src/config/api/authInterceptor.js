import api from "./axiosInstance";
import { getCookie, removeCookie, showFailure } from "../../utils";

import userProfileStore from "../../store/UserProfile/userProfileStore";

api.interceptors.request.use(
    (config) => {
        config.headers = config.headers ?? {};

        const token = getCookie("accessToken");
        //   useLoginStore.getState().loginDetails?.data;

        // config.headers["x-consumer-username"] = `cMinlEpA|client`;
        // config.headers["x-consumer-username"] = `W096Bune|satheesh123|agent`;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const caseToken = sessionStorage.getItem("caseToken");
        if (caseToken) {
            config.headers["x-case-token"] = caseToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error?.response?.data?.message || "Something went wrong";

        if (status === 401) {
            showFailure(message);
            localStorage.removeItem("auth-storage");
            localStorage.removeItem("app-storage");
            removeCookie("accessToken");
            removeCookie("isBreak");
            const currentPath = window.location.pathname;
            if (currentPath !== "/signin") {
                userProfileStore.getState().logoutUser();
                window.location.replace("/signin");
            }

            return;
        }

        if (status === 403) {
            window.location.replace("/access-forbidden");
            return;
        }

        if (status === 429) {
            showFailure("Too many requests. Try again later.");
            return Promise.reject(error);
        }

        showFailure(message);
        return Promise.reject(error);
    }
);
