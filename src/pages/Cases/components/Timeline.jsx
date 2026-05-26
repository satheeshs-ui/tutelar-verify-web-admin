import React from "react";
import { Timeline as AntTimeline, Tag, Typography } from "antd";
import { Phone, UserCheck, User, FileCheck, Clock } from "lucide-react";
import { formatDateTime } from "../../../utils";

const { Text, Title } = Typography;

const getStatusText = (status) => {
    if (!status) return "";
    if (status.includes("_")) {
        return status.split("_")[1]?.charAt(0)?.toUpperCase() + status.split("_")[1]?.slice(1);
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const getIcon = (status) => {
    switch (status) {
        case "case.digilocker_initiated":
        case "case.digilocker_completed":
        case "case.face_match_completed":
        case "case.pan_verification_completed":
            return <FileCheck size={16} className="text-black" />;
        case "case.customer_joined":
        case "case.customer_rejoined":
            return <User size={16} className="text-black" />;
        case "case.agent_joined":
        case "case.agent_rejoined":
            return <UserCheck size={16} className="text-black" />;
        case "case.call_ended":
            return <Phone size={16} className="text-black" />;
        default:
            return <Clock size={16} className="text-black" />;
    }
};

const getIconBgColor = (status) => {
    const statusText = getStatusText(status)?.toLowerCase();
    if (statusText === "ended") {
        return "!bg-[#FBDFE4]";
    }
    return "!bg-gray-200";
};

const formatPerformedBy = (performedBy) => {
    if (!performedBy) return "System";

    const { name, role } = performedBy;

    if (role === "system") {
        return "";
    }

    if (name && name.trim()) {
        return `${name} (${role})`;
    }

    return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown";
};

const formatStatusText = (status) =>
    status
        ?.split(".")
        .join(" ")
        .split("_")
        .join(" ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

const Timeline = ({ items }) => {
    const sortedItems = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const timelineItems = sortedItems.map((item, index) => ({
        dot: (
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center p-[7px] ${getIconBgColor(
                    item.status
                )}`}
            >
                {getIcon(item.status)}
            </div>
        ),
        children: (
            <div className="pb-6" key={index}>
                <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col">
                        <Title level={5} className="mb-1! text-gray-800!">
                            {formatStatusText(item.status)}
                        </Title>

                        <Text className="text-gray-500 text-sm">
                            {formatPerformedBy(item.performedBy)}
                        </Text>

                        <Text className="text-gray-500 uppercase text-sm">
                            {formatDateTime(item.performedAt)}
                        </Text>
                    </div>
                </div>
            </div>
        ),
    }));

    return (
        <div className="bg-white min-h-screen">
            <div className="px-3 py-0">
                <AntTimeline items={timelineItems} className="timeline-custom" />
            </div>

            <style>
                {`
  .timeline-custom .ant-timeline-item-tail {
    border-left: 2px solid #e5e7eb;
    left: 16px;
  }

  .timeline-custom .ant-timeline-item-head {
    left: 0;
    background: transparent;
    border: none;
    width: auto;
    height: auto;
  }

  .timeline-custom .ant-timeline-item-content {
    margin-left: 5px;
    min-height: auto;
  }

  .timeline-custom .ant-timeline-item:last-child 
  .ant-timeline-item-tail {
    display: none;
  }

  .ant-typography h5 {
    font-weight: 600;
    font-size: 16px;
  }
`}
            </style>
        </div>
    );
};

export default Timeline;
