import React from "react";
import ViewLocationMap from "./ViewLocationMap";
import ImageLoader from "./ImageLoader";
import { Tooltip } from "antd";
import { truncateText } from "../../utils";

const Item = ({ label, value, wrap, mode }) => {
    if (mode == "video-call") {
        return (
            <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                <span className="text-gray-500 text-xs">{label}</span>

                <span className={`text-gray-800 text-xs ${wrap ? "wrap-break-word" : "truncate"}`}>
                    {value ?? "-"}
                </span>
            </div>
        );
    }
    return (
        <div className="space-x-2 leading-normal">
            <p className="text-[#6A7174] text-[12px]">{label}</p>
            <p className={`text-[#16262B] text-[14px] ${wrap ? "wrap-break-word" : ""}`}>
                <Tooltip title={value} placement="topLeft">
                    {/* {value ?? "-"} */}
                    {truncateText(value, 30)}
                </Tooltip>
            </p>
        </div>
    );
};
const formatLocation = (city, region, country) => {
    const parts = [city, region, country].filter(Boolean);
    return parts.length ? parts.join(", ") : "-";
};

const TABS = ["network", "device", "location"];
function Tab({ label, icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
        flex-1 flex items-center justify-center gap-2
        py-2 text-xs font-medium transition cursor-pointer
        ${active ? "text-sky-600 border-b-2 border-sky-500" : "text-gray-500 hover:text-gray-700"}
      `}
        >
            <span className="flex items-center justify-center">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function LocationSection({ deviceInfo, mode }) {
    return (
        <div className="flex flex-wrap gap-10 items-center">
            <div className="space-y-2 bg-white border border-[#CDD0D1] rounded-xl p-5  backdrop-blur-[2px] box-border flex">
                <div className="flex items-center gap-4 mb-4 mr-3">
                    <Item
                        label="Latitude / Longitude"
                        value={
                            deviceInfo?.gpsLocation?.lat != null &&
                            deviceInfo?.gpsLocation?.lng != null
                                ? `${deviceInfo.gpsLocation.lat.toFixed(5)}, ${deviceInfo.gpsLocation.lng.toFixed(5)}`
                                : "-"
                        }
                        mode={mode}
                    />

                    <Item
                        label="GPS Location"
                        value={formatLocation(
                            deviceInfo?.gpsLocation?.city,
                            deviceInfo?.gpsLocation?.region,
                            deviceInfo?.gpsLocation?.country
                        )}
                        mode={mode}
                        wrap
                    />
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <Item
                        label="IP Location"
                        value={formatLocation(
                            deviceInfo?.ipLocation?.city,
                            deviceInfo?.ipLocation?.region,
                            deviceInfo?.ipLocation?.country
                        )}
                        mode={mode}
                        wrap
                    />

                    <Item
                        label="Last updated at"
                        value={
                            deviceInfo?.capturedAt
                                ? new Date(deviceInfo.capturedAt).toLocaleString()
                                : "-"
                        }
                        mode={mode}
                    />
                </div>
            </div>
        </div>
    );
}

export const LocationInfoCard = ({ deviceInfo, mode }) => {
    return (
        <>
            <div
                className={`text-[13px]
  transition-all duration-300 ease-in-out transform overflow-hidden
`}
            >
                <LocationSection deviceInfo={deviceInfo} mode={mode} />
            </div>
        </>
    );
};
