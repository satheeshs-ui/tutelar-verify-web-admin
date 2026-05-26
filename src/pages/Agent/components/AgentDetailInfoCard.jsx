import { checkValue, formatTime, returnSimpleFormatedDate } from "../../../utils";

const AgentDetailInfoCard = ({ data }) => {
    return (
        <div className="bg-white border border-[#CDD0D1]! rounded-[18px] p-4 flex flex-col gap-4">
            {/* title */}
            <h3 className="text-[18px] overall-table-text font-normal text-primary-black-15 leading-6">
                Agent Information
            </h3>

            {/* divider */}
            <div className="border-t border-[#E6E7E8]" />

            {/* rows */}
            <div className="space-y-4">
                <Row label="Employee ID" value={data?.employeeDetails?.employeeId} />
                <Row
                    label="Date Of Joining"
                    value={
                        data?.employeeDetails?.dateOfJoining
                            ? returnSimpleFormatedDate(data?.employeeDetails?.dateOfJoining)
                            : "-"
                    }
                />
                {/* <Row label="State" value={data?.employeeDetails?.state} /> */}
                <Row label="Shift Timing" value={data?.agentShift} />
                {/* <Row label="Agent Type" value={data?.appUserType} /> */}
            </div>
        </div>
    );
};

const Row = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-[14px] font-normal text-[#6A7174] leading-4 max-[500px]:text-[12px]">
            {label}
        </span>
        <span
            className={`text-[16px] font-normal text-[#030809] leading-6 text-right max-[500px]:text-[10px] ${label === "Agent Type" || label === "Shift Timing" ? "capitalize" : ""}`}
        >
            {label === "Shift Timing"
                ? value
                    ? `(${value?.name}) ${formatTime(value?.timing?.startTime)} - ${formatTime(value?.timing?.endTime)}`
                    : "-"
                : checkValue(value)}
        </span>
    </div>
);

export default AgentDetailInfoCard;
