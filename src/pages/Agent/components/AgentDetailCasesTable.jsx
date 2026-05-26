import dayjs from "dayjs";

const AgentDetailCasesTable = ({ data = [] }) => {
    const formatDate = (date) => {
        if (!date) return "-";
        return dayjs(date).format("DD/MM/YYYY, HH:mm:ss");
    };

    const StatusBadge = (status) => {
        const map = {
            completed: "bg-[#18667C0F] text-[#18667C]",
            "not completed": "bg-[#FEF3F2] text-[#F04438]",
            created: "bg-[#CDD0D1] text-[#2C3436]",
            "in-process": "bg-[#FFF4E5] text-[#F59E0B]",
        };

        return (
            <span
                className={`px-3 py-2 rounded-lg text-[12px] font-normal capitalize ${map[status?.toLowerCase()]}`}
            >
                {status}
            </span>
        );
    };

    const ReviewBadge = (status) => {
        const map = {
            pending: "bg-[#F79009]",
            approved: "bg-[#16A34A]",
            rejected: "bg-[#F04438]",
            awaiting: "bg-[#6A7174]",
            "link expired": "bg-[#F04438]",
        };

        return (
            <span className="px-3 py-1 rounded-full border border-[#CDD0D1] text-[12px] font-normal flex items-center gap-2 w-fit">
                <span className={`w-2 h-2 rounded-full ${map[status?.toLowerCase()]}`} />
                {status}
            </span>
        );
    };

    const ExpireCell = (value) => {
        if (!value) return "-";

        if (value === "expired") {
            return (
                <span className="px-3 py-1 rounded-full border border-[#E6E7E8] text-[13px] flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 bg-[#F04438] rounded-full" />
                    Expired
                </span>
            );
        }

        return (
            <div className="flex gap-1">
                {value.split(":").map((t, i) => (
                    <span
                        key={i}
                        className="bg-[#FEF3F2] text-[#F04438] px-2 py-1 rounded text-[12px] font-normal"
                    >
                        {t}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white border border-[#CDD0D1]! rounded-[18px] flex flex-col gap-2 overflow-hidden">
            <table className="w-full border-collapse">
                <thead className="bg-[#F3F3F3] text-[#6A7174] text-[12px] font-normal leading-4">
                    <tr>
                        <th className="px-4 py-3 text-left">Case ID</th>
                        <th className="px-4 py-3 text-left">Session ID</th>
                        <th className="px-4 py-3 text-left">Created At</th>
                        <th className="px-4 py-3 text-left">Case Status</th>
                        <th className="px-4 py-3 text-left">Ended At</th>
                        <th className="px-4 py-3 text-left">Session Expire At</th>
                        <th className="px-4 py-3 text-left">Assigned by</th>
                        <th className="px-4 py-3 text-left">Review Status</th>
                    </tr>
                </thead>

                <tbody className="text-[14px]">
                    {data?.map((item, i) => (
                        <tr key={i} className="border-t border-[#ECEDED] hover:bg-[#FAFAFA]">
                            <td className="px-4 py-4 text-[#18667C] text-[14px] font-normal underline">
                                {item.caseId}
                            </td>

                            <td className="px-4 py-4 text-[#0B1C20] text-[14px] font-normal">
                                {item.sessionId}
                            </td>

                            <td className="px-4 py-4 text-[#0B1C20] text-[14px] font-normal">
                                {formatDate(item.createdAt)}
                            </td>

                            <td className="px-4 py-4">{StatusBadge(item.caseStatus)}</td>

                            <td className="px-4 py-4 text-[#0B1C20] text-[14px] font-normal">
                                {formatDate(item.endedAt)}
                            </td>

                            <td className="px-4 py-4">{ExpireCell(item.expireAt)}</td>

                            <td className="px-4 py-4 text-[#0B1C20] text-[14px] font-normal rounded-full">
                                {item.assignedBy || "-"}
                            </td>

                            <td className="px-4 py-4">{ReviewBadge(item.reviewStatus)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgentDetailCasesTable;
