import ViewLocationMap from "./ViewLocationMap";
import React, { useState } from "react";
import ImageLoader from "./ImageLoader";
import { Monitor, Wifi, MapPin } from "lucide-react";
import { checkValue } from "../../utils";

/* -------------------- COMMON -------------------- */

const SectionTitle = ({ icon, label }) => (
    <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
        <span className="text-gray-500">{icon}</span>
        <span className="text-[#222E32] text-[16px]">{label}</span>
    </div>
);

const Item = ({ label, value, wrap, mode }) => {
    if (mode === "video-call") {
        return (
            <div className="flex flex-col min-w-0">
                <span className="text-gray-500 text-[11px] mb-1">{label}</span>
                <span className="text-gray-800 text-xs wrap-break-word">{checkValue(value)}</span>
            </div>
        );
    }

    return (
        <div className="space-x-2 leading-normal">
            <p className="text-[#6A7174] text-[12px]">{label}</p>
            <p className={`text-[#16262B] text-[14px] ${wrap ? "wrap-break-word" : ""}`}>
                {value ?? "-"}
            </p>
        </div>
    );
};

/* -------------------- HELPERS -------------------- */

const renderItems = (items, deviceInfo, mode) =>
    items.map((item, i) => (
        <Item
            key={i}
            label={item.label}
            value={typeof item.value === "function" ? item.value(deviceInfo) : item.value}
            mode={mode}
            wrap={item.wrap}
        />
    ));

const formatISP = (raw) => {
    if (!raw) return "-";
    const v = raw.toLowerCase();
    if (v.includes("airtel")) return "Airtel";
    if (v.includes("jio")) return "Jio";
    if (v.includes("vodafone") || v.includes("idea")) return "Vi";
    if (v.includes("bsnl")) return "BSNL";
    return raw.replace(/^as\d+\s*/i, "").trim();
};

const formatLocation = (city, region, country) => {
    const parts = [city, region, country].filter(Boolean);
    return parts.length ? parts.join(", ") : "-";
};

/* -------------------- CONFIG -------------------- */

const NETWORK_FIELDS = [
    { label: "IP Address", value: (d) => d?.ipAddress },
    { label: "ISP", value: (d) => formatISP(d?.isp) },
    { label: "Network Type", value: (d) => d?.network?.effectiveType },
    {
        label: "Downlink",
        value: (d) => (d?.network?.downlink ? `${d.network.downlink} Mbps` : "-"),
    },
];

const NETWORK_EXTRA = [
    {
        label: "RTT",
        value: (d) => (d?.network?.rtt ? `${d.network.rtt} ms` : "-"),
    },
];

const DEVICE_FIELDS = [
    { label: "Device Type", value: (d) => d?.deviceType },
    { label: "Operating System", value: (d) => d?.os },
    { label: "Browser", value: (d) => d?.browser },
    {
        label: "Battery",
        value: (d) =>
            d?.battery?.level != null
                ? `${checkValue(d.battery.level)}%${d?.battery?.isCharging ? " (Charging)" : ""}`
                : "-",
    },
];

const DEVICE_EXTRA = [{ label: "User Agent", value: (d) => d?.userAgent, wrap: true }];

/* -------------------- SECTIONS -------------------- */

function NetworkSection({ deviceInfo, mode }) {
    return (
        <div className="space-y-2 mt-6">
            {mode === "report" && (
                <SectionTitle icon={<ImageLoader imageKey="NetworkIcons" />} label="Network" />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {renderItems(NETWORK_FIELDS, deviceInfo, mode)}
            </div>

            {renderItems(NETWORK_EXTRA, deviceInfo, mode)}
        </div>
    );
}

function DeviceSection({ deviceInfo, mode }) {
    return (
        <div className="space-y-2">
            {mode === "report" && (
                <SectionTitle icon={<ImageLoader imageKey="DeviceIcons" />} label="Device" />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {renderItems(DEVICE_FIELDS, deviceInfo, mode)}
            </div>

            {renderItems(DEVICE_EXTRA, deviceInfo, mode)}
        </div>
    );
}

function LocationSection({ deviceInfo, mode }) {
    const LOCATION_FIELDS = [
        {
            label: "Latitude / Longitude",
            value: (d) =>
                d?.gpsLocation?.lat != null
                    ? `${d.gpsLocation.lat.toFixed(5)}, ${d.gpsLocation.lng.toFixed(5)}`
                    : "-",
        },
        {
            label: "GPS Location",
            value: (d) =>
                formatLocation(
                    d?.gpsLocation?.city,
                    d?.gpsLocation?.region,
                    d?.gpsLocation?.country
                ),
            wrap: true,
        },
        {
            label: "IP Location",
            value: (d) =>
                formatLocation(d?.ipLocation?.city, d?.ipLocation?.region, d?.ipLocation?.country),
            wrap: true,
        },
        {
            label: "Last updated at",
            value: (d) => (d?.capturedAt ? new Date(d.capturedAt).toLocaleString() : "-"),
        },
    ];

    return (
        <div className="space-y-2">
            {mode === "report" && <SectionTitle icon={<MapPin />} label="Location" />}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
                {renderItems(LOCATION_FIELDS, deviceInfo, mode)}
            </div>

            <ViewLocationMap
                lat={deviceInfo?.gpsLocation?.lat}
                lng={deviceInfo?.gpsLocation?.lng}
            />
        </div>
    );
}

/* -------------------- TABS -------------------- */

const TAB_CONFIG = [
    {
        key: "network",
        label: "Network",
        icon: <Wifi className="w-4 h-4" />,
        component: NetworkSection,
    },
    {
        key: "device",
        label: "Device",
        icon: <Monitor className="w-4 h-4" />,
        component: DeviceSection,
    },
    {
        key: "location",
        label: "Location",
        icon: <MapPin className="w-4 h-4" />,
        component: LocationSection,
    },
];

function Tab({ label, icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition
            ${
                active
                    ? "text-sky-600 border-b-2 border-[#042832]!"
                    : "text-gray-500 hover:text-gray-700"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function DeviceInfoTabs({ deviceInfo, mode }) {
    const [active, setActive] = useState("network");

    const ActiveComponent = TAB_CONFIG.find((t) => t.key === active)?.component;

    return (
        <div className="border border-gray-200 rounded-lg bg-white w-full min-w-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {TAB_CONFIG.map((tab) => (
                    <Tab
                        key={tab.key}
                        label={tab.label}
                        icon={tab.icon}
                        active={active === tab.key}
                        onClick={() => setActive(tab.key)}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="p-3 text-[13px]">
                {ActiveComponent && <ActiveComponent deviceInfo={deviceInfo} mode={mode} />}
            </div>
        </div>
    );
}

/* -------------------- MAIN EXPORT -------------------- */

export const DeviceInfoCard = ({ deviceInfo, mode }) => {
    if (mode === "video-call") {
        return <DeviceInfoTabs deviceInfo={deviceInfo} mode={mode} />;
    }
    return (
        <div className="text-[13px] transition-all duration-300 overflow-hidden">
            <DeviceSection deviceInfo={deviceInfo} mode={mode} />
            <NetworkSection deviceInfo={deviceInfo} mode={mode} />
        </div>
    );
};
