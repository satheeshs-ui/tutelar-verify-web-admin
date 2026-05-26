import { Number } from "./enum";
import { Cookies } from "react-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import toast from "react-hot-toast";
import ImageLoader from "../components/ui/ImageLoader";
import { showToast } from "../components/ui/ShowToast";

dayjs.extend(utc);
dayjs.extend(timezone);
const { TEN, THREE_THOUSAND } = Number;
const cookies = new Cookies();

export const showSuccess = (data) => {
    const message = typeof data === "string" ? data : (data?.message ?? "Success!");

    toast.remove();

    showToast("success", message);
};

export const showFailure = (data) => {
    let message = "Something went wrong.";

    if (typeof data === "string") {
        message = data;
    } else if (data instanceof Error) {
        message = data.message || message;
    } else if (typeof data === "object" && data && "message" in data) {
        message = data.message ?? message;
    }

    toast.remove();
    setTimeout(() => showToast("error", message), 50);
};

export const showWarning = (data) => {
    const message = typeof data === "string" ? data : (data?.message ?? "Warning");

    toast.remove();
    setTimeout(() => showToast("warning", message), 50);
};

export const showInfo = (data) => {
    const message = typeof data === "string" ? data : (data?.message ?? "Info");

    toast.remove();
    setTimeout(() => showToast("info", message), 50);
};

export const shouldShowPagination = (data, page) => {
    if (!data && page === 1) return false;
    if (data?.length === 0 && page === 1) return false;
    if (data && data.length < TEN && page === 1) return false;
    if (data && data.length < TEN && page > 1) return true;
    return true;
};

export const handleBackClick = (navigate, path) => {
    navigate(path);
};

export const capitalizeFirstLetter = (str) => {
    const trimmedStr = str.trim();
    return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1);
};

export const htmlEntityToHex = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
};

export const extractLastPart = (path) => {
    return path.split("/").pop() || "";
};

export function formatToReadableDate(isoString) {
    return new Date(isoString).toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export function formatBreadcrumbSegment(segment) {
    if (!segment) return "";

    const IMPORTANT_KEYWORDS = new Set([
        "aml",
        "kyc",
        "pan",
        "upi",
        "vpa",
        "id",
        "api",
        "ui",
        "url",
    ]);

    const specialCases = {
        "vpa-viewer": "VPA Viewer",
        vpa_viewer: "VPA Viewer",
        "upi-history": "UPI History",
    };

    const lowerSegment = segment.toLowerCase();
    if (specialCases[lowerSegment]) {
        return specialCases[lowerSegment];
    }

    const parts = segment
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(/[-_]/)
        .flatMap((part) => part.split(" "))
        .filter(Boolean);

    return parts
        .map((part) => {
            const lowerPart = part.toLowerCase();

            if (IMPORTANT_KEYWORDS.has(lowerPart)) {
                return part.toUpperCase();
            }

            if (part === part.toUpperCase() && part.length >= 2 && part.length <= 5) {
                return part;
            }

            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join(" ");
}

export function isAbbreviation(segment) {
    return /^[A-Z]{2,3}$/i.test(segment);
}

export const removeUnderScore = (value) => {
    return value
        ?.replaceAll("-", " ")
        ?.replaceAll("_", " ")
        ?.replaceAll("?", " for ")
        ?.replaceAll(" ", " ")
        ?.replaceAll(".", " ")
        ?.replaceAll("%20", " ")
        ?.replace(/(\b)kyc(\b)/g, "KYC")
        ?.replace(/(\b)ip(\b)/g, "IP")
        ?.replace(/(\b)ndr(\b)/g, "NDR")
        ?.replace(/(\b)api(\b)/g, "API")
        ?.replace(/(\b)dr(\b)/g, "DR")
        ?.replace(/(\b)nda(\b)/g, "NDA");
};

export const restrictInputValue = (fieldName, value) => {
    const noSpecialFields = ["legalName", "tradeName", "description", "address", "employeeId"];

    const customAllowedChars = /[^\w\s.,\-_()[\]{}/\\&@'":;!?#%+=*^]/g;

    const config = {
        "phone.number": { mode: "number", max: 10 },
        phoneNumber: {
            mode: "number",
            max: 10,
        },
        "client.name": { mode: "alpha", max: 100 },
        fullName: { mode: "alpha", max: 100 },
        role_name: { mode: "alpha", max: 100 },
        legalName: { mode: "custom", customPattern: customAllowedChars, max: 150 },
        name: { mode: "alpha", max: 100 },
        email: {
            mode: "email",
            max: 100,
        },
        reason: { mode: "custom", customPattern: customAllowedChars, max: 500 },
        tradeName: { mode: "custom", customPattern: customAllowedChars, max: 150 },
        description: {
            mode: "custom",
            customPattern: customAllowedChars,
            max: 500,
        },
        password: { max: 18 },
        newpassword: { max: 18 },
        confirmpassword: { max: 18 },
        address: { max: 500 },
        employeeId: { max: 7, mode: "noSpecial" },
        "authorizedSignatory.email": { mode: "email", max: 100 },
        "authorizedSignatory.phone.number": { mode: "number", max: 10 },
        "authorizedSignatory.name": { mode: "alpha", max: 100 },
        website: { max: 100, mode: "website" },
        websiteUrl: { max: 100, mode: "website" },
        number: { max: 3, mode: "number" },
        fixedamount: { max: 5, mode: "percentage" },
        holdpercenage: { max: 4, mode: "percentage" },
    };

    noSpecialFields.forEach((field) => {
        config[field] = {
            ...config[field],
            mode: config[field]?.mode || "custom",
            customPattern: customAllowedChars,
        };
    });

    const { mode, max, customPattern } = config[fieldName] || {};
    let newValue = value || "";

    switch (mode) {
        case "number":
            newValue = newValue.replace(/\D/g, "");
            break;
        case "alpha":
            newValue = newValue.replace(/[^a-zA-Z ]/g, "").replace(/^\s+/, "");
            break;
        case "noSpecial":
            newValue = newValue.replace(/[^a-zA-Z0-9 ]/g, "").replace(/^\s+/, "");
            break;
        case "email":
        case "website":
            newValue = newValue.replace(/\s/g, "").toLowerCase();
            break;
        case "custom":
            if (customPattern) newValue = newValue.replace(customPattern, "");
            break;
        case "percentage":
            newValue = newValue.replace(/[^0-9.]/g, "");
            break;
        default:
            break;
    }

    if (max) newValue = newValue.slice(0, max);
    return newValue;
};

export const makeSafeKey = (label) =>
    label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/gi, "_");

export const blockInvalidNumberKeys = (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
};

export const spaceTrim = (str) => {
    if (typeof str !== "string") {
        return str || "";
    }

    return str.replace(/^\s+/, "");
};

export const localStorageGetItem = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error parsing localStorage item: ${key}`, error);
        return null;
    }
};

export const setCookie = (name, value) => {
    return cookies.set(name, value, {
        path: "/",
        secure: false,
        sameSite: "lax",
        expires: new Date(Date.now() + 86400 * 1000),
    });
};

export const getCookie = (name) => {
    return cookies.get(name);
};

export const removeCookie = (name) => {
    return cookies.remove(name, {
        path: "/",
        secure: false,
        sameSite: "lax",
        domain: window.location.hostname,
        expires: new Date(0),
    });
};

export const maskEmail = (email) => {
    if (!email || typeof email !== "string") return "";

    const [localPart, domain] = email.split("@");
    if (!domain) return email;

    const maskedLocal =
        localPart.length > 2
            ? localPart[0] + "*".repeat(localPart.length - 2) + localPart.slice(-1)
            : "*".repeat(localPart.length);

    return `${maskedLocal}@${domain}`;
};

export const maskMobileNumber = (mobile, visibleDigits = 4) => {
    if (!mobile || typeof mobile !== "string") return "";

    const maskedPart = "*".repeat(mobile.length - visibleDigits);
    const visiblePart = mobile.slice(-visibleDigits);

    return `${maskedPart}${visiblePart}`;
};

export const getDateFromTimeZones = (dateString, formatDateTime, offsetTime) => {
    if (!dateString) return "-";

    try {
        const date = dayjs(dateString);
        if (!date.isValid()) return "-";

        return offsetTime
            ? dayjs(dateString).tz(offsetTime).format(formatDateTime)
            : date.format(formatDateTime);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "-";
    }
};

export function returnSimpleFormatedDateTime(dateString) {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD MMM YYYY h:mm A").toUpperCase();
}

export function returnSimpleFormatedDate(dateString) {
    return dayjs(dateString).format("DD MMM YYYY").toUpperCase();
}

export const getIconForRoute = (group, isActive, activeFilter) => {
    switch (group) {
        case "dashboard":
            return <ImageLoader imageKey="dashboard" className="w-5 h-5" />;
        case "vpa-viewer":
            return (
                <ImageLoader
                    imageKey="users"
                    className="w-5 h-5"
                    {...(isActive ? { style: { filter: activeFilter } } : {})}
                />
            );
        case "admin-merchant":
            return (
                <ImageLoader
                    imageKey="merchantsIcon"
                    className="w-5 h-5"
                    {...(isActive ? { style: { filter: activeFilter } } : {})}
                />
            );
        case "admin-transaction":
            return (
                <ImageLoader
                    imageKey="transactionIcon"
                    className="w-5 h-5"
                    {...(isActive ? { style: { filter: activeFilter } } : {})}
                />
            );
        case "admin-others":
            return (
                <ImageLoader
                    imageKey="othersIcon"
                    className="w-5 h-5"
                    {...(isActive ? { style: { filter: activeFilter } } : {})}
                />
            );
        case "admin-management":
            return (
                <ImageLoader
                    imageKey="users"
                    className="w-5 h-5"
                    {...(isActive ? { style: { filter: activeFilter } } : {})}
                />
            );
        case "admin-settings":
            return (
                <ImageLoader
                    imageKey="users"
                    className="w-5 h-5"
                    {...(isActive ? { style: { filter: activeFilter } } : {})}
                />
            );
        default:
            return <ImageLoader imageKey="othersIcon" className="w-5 h-5" />;
    }
};

const ROUTE_MAP = {
    "admin-dashboard": "/dashboard",
    "admin-merchant": "/merchant-onboarding",
    "admin-subadmin": "/user-list",
    "admin-transaction": "/transaction-list",
    "admin-settlement": "/settlement-list",
    "admin-invoice": "/invoice-list",
    "admin-refund": "/refund-list",
    "admin-report": "/report-list",
    "admin-offer": "/offers",
};

export const getRouteFromGroup = (group) => {
    const key = Object.keys(ROUTE_MAP).find((prefix) => group.startsWith(prefix));
    return key ? ROUTE_MAP[key] : "/";
};

export const getStatus = (status, from) => {
    const baseClasses = "capitalize font-medium text-[15px]";
    const normalizedStatus = status?.toLowerCase();

    const statusClassMap = {
        initiated: "text-blue",
        in_progress: "text-blue",
        completed: "text-green",
        valid: "text-green",
        submitted: "text-green",
        active: "text-green",
        approved: "text-green",
        approve: "text-green",
        low: "text-orange",
        blocked: "text-grey",
        deactive: "text-blue",
        pending: "text-orange",
        medium: "text-blue",
        reupload: "text-blue",
        rejected: "text-red",
        high: "text-red",
        invalid: "text-red",
    };

    const defaultClass = "text-orange";

    let classes = (normalizedStatus && statusClassMap[normalizedStatus]) || defaultClass;

    if (
        normalizedStatus &&
        ["initiated", "in_progress"].includes(normalizedStatus) &&
        from === "details"
    ) {
        classes += " text-[15px]";
    }

    classes += ` ${baseClasses}`;

    return {
        className: classes,
        text: removeUnderScore(status ?? "") || "-",
    };
};
export const showDateTime = (date) => {
    return date ? dayjs(date).format("YYYY-MM-DD | hh:mm A") : "-";
};
export const getScore = (data) => {
    const status = data?.merchant?.status ?? "";

    const SCORE = {
        MAGIN_25: 25,
        MAGIN_50: 50,
        MAGIN_75: 75,
        MAGIN_100: 100,
    };

    switch (status) {
        case "completed":
        case "riskManager":
            return SCORE.MAGIN_100;

        case "business":
            return SCORE.MAGIN_25;

        case "bankInformation":
            return SCORE.MAGIN_50;

        case "kyc":
        case "suspended":
            return SCORE.MAGIN_75;

        default:
            return 0;
    }
};

export const formattedDateTime = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY HH:mm:ss") : "-";
};
export const formattedDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "-";
};

export const checkValue = (val) => {
    const value = val === "" || val === undefined || val === null;
    return value ? "-" : val;
};
export const parseHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

export const capitalizeWords = (str) => {
    return str
        ?.toLowerCase()
        .split(" ")
        .map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
        .join(" ");
};

export const formatAddress = (address) => {
    if (!address) return "-";

    const { line1, city, state, pincode } = address;

    const parts = [line1?.trim(), city?.trim(), state?.trim(), pincode?.toString().trim()].filter(
        Boolean
    );

    return parts?.length ? parts.join(", ") : "-";
};

export const cleanParams = (params) => {
    const cleaned = {};
    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== "") {
            cleaned[key] = value;
        }
    });
    return cleaned;
};

export const getStatusColors = (status) => {
    if (!status) return {};

    const s = status?.toLowerCase();

    const colors = {
        active: {
            color: "#0F5132",
            background: "#D1E7DD",
        },
        approved: {
            color: "#0B1C20",
            dot: "bg-[#17B26A]",
        },

        completed: {
            color: "#17B26A",
            background: "#F6FEF9",
            fontSize: "12px",
            fontWeight: "400",
        },
        agent_approved: {
            color: "#0B1C20",
            dot: "bg-[#0F5132]",
        },
        pending: {
            color: "#0B1C20",
            dot: "bg-[#F79009]",
        },
        inprogress: {
            color: "#055160",
            background: "#CCE5FF",
            fontSize: "12px",
            fontWeight: "400",
        },
        processing: {
            color: "#6D28D9",
            background: "#F3E8FF",
            fontSize: "12px",
            fontWeight: "400",
        },
        auditor_approved: {
            color: "#0B1C20",
            dot: "bg-[#6D28D9]",
        },
        rejected: {
            color: "#0B1C20",
            dot: "bg-[#F04438]",
        },
        expired: {
            color: "#842029",
            background: "#F8D7DA",
            fontSize: "12px",
            fontWeight: "400",
        },
        cancelled: {
            color: "#842029",
            background: "#F8D7DA",
            fontSize: "12px",
            fontWeight: "400",
        },
        default: {
            color: "#2C2C2C",
            background: "#EDEDED",
        },
        inactive: {
            color: "#842029",
            background: "#F8D7DA",
        },
        created: {
            color: "#18667C",
            background: "#18667C0F",
            fontSize: "12px",
            fontWeight: "400",
        },
        submitted: {
            color: "#055160",
            background: "#CCE5FF",
            fontSize: "12px",
            fontWeight: "400",
        },
    };

    return colors[s] || colors.default;
};

export const getStatusConfig = (status) => {
    if (!status) return {};

    const s = status?.toLowerCase();

    const colors = {
        active: {
            text: "text-[#0B1C20] text-[12px]",
            dot: "bg-green-600",
        },
        inactive: {
            text: "text-[#0B1C20] text-[12px]",
            dot: "bg-red-600",
        },
        pending: {
            color: "#0B1C20",
            dot: {
                background: "#F79009",
            },
        },
        default: {
            textColor: "text-gray-500",
            dot: "bg-gray-400",
        },
    };

    return colors[s] || colors.default;
};

export const formatDuration = (durationMs) => {
    if (!durationMs) return "0:00";

    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m:${seconds.toString().padStart(2, "0")}s`;
};

// utils/audioMixer.js
export class AudioMixer {
    constructor() {
        this.audioContext = null;
        this.destination = null;
        this.sources = new Map();
        this.mixedStream = null;
    }

    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.destination = this.audioContext.createMediaStreamDestination();
            this.mixedStream = this.destination.stream;
            return true;
        } catch (err) {
            console.error("Failed to initialize audio context:", err);
            return false;
        }
    }

    addSource(id, stream) {
        if (!this.audioContext || !stream) return false;

        try {
            // Get audio tracks from the stream
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) return false;

            // Create media stream source
            const source = this.audioContext.createMediaStreamSource(new MediaStream(audioTracks));
            source.connect(this.destination);

            this.sources.set(id, source);
            return true;
        } catch (err) {
            console.error("Failed to add audio source:", err);
            return false;
        }
    }

    removeSource(id) {
        const source = this.sources.get(id);
        if (source) {
            source.disconnect();
            this.sources.delete(id);
        }
    }

    getMixedStream(videoStream) {
        if (!this.mixedStream) return null;

        // Create final stream with mixed audio and video
        const mixedAudioTracks = this.mixedStream.getAudioTracks();
        const videoTracks = videoStream ? videoStream.getVideoTracks() : [];

        return new MediaStream([...mixedAudioTracks, ...videoTracks]);
    }

    stop() {
        this.sources.forEach((source) => source.disconnect());
        this.sources.clear();

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.destination = null;
        this.mixedStream = null;
    }
}

export const normalizePath = (path = "") => path.replace(/^\/+|\/+$/g, "");
export const formatDateTime = (isoString, mode) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";

    const options =
        mode === "no_time"
            ? {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
              }
            : {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
              };

    return date
        .toLocaleString("en-GB", options)
        .replace(",", "")
        .replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};

export const stopCamera = (stream) => {
    stream?.getTracks()?.forEach((track) => track.stop());
};
export const MENU_ICON_MAP = {
    Agents: {
        active: "activeAgentIcon",
        inactive: "inActiveAgentIcon",
    },
    "Case Management": {
        active: "activeCaseIcon",
        inactive: "inActiveCaseIcon",
    },
    "API Keys": {
        active: "activeUserIcon",
        inactive: "inActiveUserIcon",
    },
    Reports: {
        active: "activeReportIcon",
        inactive: "inActiveReportIcon",
    },
    Dashboard: {
        active: "activeDashIcon", // adjust if needed
        inactive: "inActiveDashIcon",
    },
    "Download Manager": {
        active: "activeDashIcon", // adjust if needed
        inactive: "inActiveDashIcon",
    },
    "User Configuration": {
        active: "UserIcon",
        inactive: "UserIcon",
    },
};
export const shortName = (name) => {
    return name
        ?.trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
};

// Returns first letter or initials of a name
export const getInitial = (name, type = "first") => {
    if (!name) return "-";

    if (type === "first") {
        return name.charAt(0).toUpperCase();
    }

    if (type === "full") {
        return name
            .split(" ")
            .map((n) => n[0].toUpperCase())
            .join("");
    }

    return "-";
};

export const formatTime = (time) => {
    if (!time) return "-";

    const [hour, minute] = time.split(":");

    const h = +hour;

    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;

    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

export const formatTitle = (key) => {
    return key
        .replace("Percentage", "Match")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

export const truncateText = (text, limit = 20) => {
    if (!text) return "";

    return text.length > limit ? `${text.slice(0, limit)}...` : text;
};
