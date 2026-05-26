import { TrendingUp, Clock, Star } from "lucide-react";

const AgentDetailPerformanceCard = ({ data }) => {
    return (
        <div className="bg-white border border-[#CDD0D1]! rounded-[18px] p-4 flex flex-col gap-4">
            {/* header */}
            <div className="flex items-start gap-3">
                {/* vertical indicator */}
                <div className="w-[2px] bg-[#00BC7D] rounded-full" style={{ height: "48px" }} />

                <div className="flex flex-col">
                    <h3 className="text-[18px] font-normal text-primary-black-15 leading-6">
                        Performance Record
                    </h3>
                    <p className="text-[12px] font-normal text-[#818A8C] leading-[18px] mt-1">
                        Last Updated {data?.lastUpdated || "—"}
                    </p>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard
                    icon={<TrendingUp size={16} className="text-[#9CA1A2]" />}
                    label="Success Rate"
                    value={`${data?.successRate || 0}%`}
                />

                <StatCard
                    icon={<Clock size={16} className="text-[#9CA1A2]" />}
                    label="Avg Time"
                    value={data?.avgTime || "-"}
                />

                <StatCard
                    icon={<Star size={16} className="text-[#9CA1A2]" />}
                    label="Avg Review"
                    value={data?.avgReview || "-"}
                />
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[12px] font-normal text-[#9CA1A2]">
            {icon}
            {label}
        </div>

        <div className="text-[16px] font-normal text-[#0B1C20] leading-6">{value}</div>
    </div>
);

export default AgentDetailPerformanceCard;
