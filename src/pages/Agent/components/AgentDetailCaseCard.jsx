import { FileCheck, FileX, Hourglass } from "lucide-react";

const AgentDetailCaseCard = ({ data }) => {
    return (
        <div className="bg-white border border-[#CDD0D1]! rounded-[18px] p-4 flex flex-col gap-4">
            {/* header */}
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                    {/* vertical border on header (optional) */}
                    <div className="w-0.5 bg-[#2B7FFF] rounded-full" style={{ height: "48px" }} />

                    <div className="flex flex-col">
                        <h3 className="text-[18px] font-normal text-primary-black-15 leading-6">
                            Case Distribution
                        </h3>
                        <p className="text-[12px] font-normal text-[#818A8C] leading-[18px] mt-1">
                            Breakdown of verification outcomes
                        </p>
                    </div>
                </div>

                <div className="text-right flex flex-col">
                    <p className="text-[24px] font-normal text-[#18667C] leading-7">
                        {data?.total || 0}
                    </p>
                    <p className="text-[12px] font-normal text-[#818A8C] leading-[18px]">
                        Total Calls
                    </p>
                </div>
            </div>

            {/* cards */}
            <div className="grid grid-cols-3 gap-4">
                <CaseBox
                    icon={<FileCheck size={18} className="text-[#17B26A]" />}
                    label="Approved"
                    value={data?.approved || 0}
                    color="#074D31"
                    countColor="#17B26A"
                    borderColor="#17B26A"
                    bgColor="#F6FEF9"
                />

                <CaseBox
                    icon={<FileX size={18} className="text-[#F04438]" />}
                    label="Rejected"
                    value={data?.rejected || 0}
                    color="#7A271A"
                    countColor="#F04438"
                    borderColor="#F04438"
                    bgColor="#FFFBFA"
                />

                <CaseBox
                    icon={<Hourglass size={18} className="text-[#F79009]" />}
                    label="Pending"
                    value={data?.pending || 0}
                    color="#7A2E0E"
                    countColor="#F79009"
                    borderColor="#F79009"
                    bgColor="#FFFCF5"
                />
            </div>
        </div>
    );
};

const CaseBox = ({ icon, label, value, color, countColor, borderColor, bgColor }) => (
    <div
        className={`rounded-xl p-4 flex flex-col gap-2 border-l-2`}
        style={{ borderLeftColor: borderColor, backgroundColor: bgColor }}
    >
        <div className="flex items-center gap-2 text-[12px] font-normal mb-1" style={{ color }}>
            {icon}
            <span>{label}</span>
        </div>
        <div className="text-[20px] font-normal leading-6" style={{ color: countColor }}>
            {value}
        </div>
    </div>
);

export default AgentDetailCaseCard;
