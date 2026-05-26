import axios from "axios";
import constants from "../../utils/config";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedFingerprint = null;

async function getFingerprint() {
    if (cachedFingerprint) return cachedFingerprint;

    const stored = localStorage.getItem("deviceFingerprint");
    if (stored) {
        cachedFingerprint = stored;
        return stored;
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    cachedFingerprint = result.visitorId;

    localStorage.setItem("deviceFingerprint", cachedFingerprint);

    return cachedFingerprint;
}

const api = axios.create({
    baseURL: constants.BASE_URL,
    timeout: 20000,
    withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    const caseToken = sessionStorage.getItem("caseToken");

    if (caseToken) {
        config.headers["x-case-token"] = caseToken;
    }

    const fingerprint = await getFingerprint();

    if (fingerprint) {
        config.headers["x-device-fingerprint"] = fingerprint;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const messageCode = error?.response?.data?.messageCode;
        if (messageCode === "C1017") {
            window.location.href = "/access-forbidden";
        }

        return Promise.reject(error);
    }
);

export default api;
