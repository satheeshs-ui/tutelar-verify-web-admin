import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LottieLoader from "../../../components/ui/LottieUnique/LottieLoader";
import ApiCall from "../../../config/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";
import AgentDetailProfileCard from "./AgentDetailProfileCard";
import AgentDetailInfoCard from "./AgentDetailInfoCard";
import { useHeaderStore } from "../../../store/Header/useHeaderStore";
// import AgentDetailPerformanceCard from "./AgentDetailPerformanceCard";
// import AgentDetailCaseCard from "./AgentDetailCaseCard";
// import AgentDetailCasesTable from "./AgentDetailCasesTable";
// import ImageLoader from "../../../components/ui/ImageLoader";
// import FilterSearch from "../../../components/ui/FilterSearch";
// import CommonFilter from "../../../components/ui/Filter";

// const dummyCases = [
//     {
//         caseId: "C-10231",
//         sessionId: "SES-889122",
//         createdAt: "2025-01-15T10:22:30",
//         caseStatus: "completed",
//         endedAt: "2025-01-15T10:30:20",
//         expireAt: "00:12:45",
//         assignedBy: "Admin",
//         reviewStatus: "approved",
//     },
//     {
//         caseId: "C-10232",
//         sessionId: "SES-889123",
//         createdAt: "2025-01-15T11:05:10",
//         caseStatus: "in-process",
//         endedAt: null,
//         expireAt: "00:08:10",
//         assignedBy: "Supervisor",
//         reviewStatus: "pending",
//     },
//     {
//         caseId: "C-10233",
//         sessionId: "SES-889124",
//         createdAt: "2025-01-14T09:15:00",
//         caseStatus: "not completed",
//         endedAt: "2025-01-14T09:20:10",
//         expireAt: "expired",
//         assignedBy: "System",
//         reviewStatus: "rejected",
//     },
//     {
//         caseId: "C-10234",
//         sessionId: "SES-889125",
//         createdAt: "2025-01-13T14:40:00",
//         caseStatus: "created",
//         endedAt: null,
//         expireAt: "00:20:00",
//         assignedBy: "Admin",
//         reviewStatus: "awaiting",
//     },
// ];

const AgentDetailPage = () => {
    const { userId } = useParams();

    const [agentDetails, setAgentDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { setHeader, clearHeader } = useHeaderStore();
    // const [search, setSearch] = useState("");
    // const [clear, setClear] = useState(false);

    // const searchIcon = <ImageLoader imageKey="SearchIcons" />;

    const fetchAgentDetails = async () => {
        if (!userId) return;

        try {
            setIsLoading(true);

            const response = await ApiCall.get(`video-kyc/user/agent/${userId}`);

            if (response?.data?.success) {
                setAgentDetails(response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAgentDetails();
    }, [userId]);

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    <div>
                        <SecondaryButton
                            iconLeft="EditIcons"
                            className="w-auto! px-4! rounded-full! border! border-[#CDD0D1]! text-[14px]! leading-5! text-[#818A8C]!"
                            label={
                                <span className="font-geomanist text-[14px] leading-5 text-[#818A8C] max-[500px]:text-[10px]">
                                    Edit Agent
                                </span>
                            }
                            onNotify={() => navigate(`/agents/agents-list/edit-agent/${userId}`)}
                        />
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, navigate]);
    if (isLoading) return <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AgentDetailProfileCard data={agentDetails} />
                <AgentDetailInfoCard data={agentDetails} />
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
                <AgentDetailPerformanceCard data={agentDetails} />
                <AgentDetailCaseCard data={agentDetails} />
            </div>
            <div className="flex items-center justify-between mb-3">
                {/* LEFT - SEARCH */}
            {/* <div className="flex gap-2 p-3 bg-[#F9FAFB] border border-[#E6E7E8] rounded-[8px] w-[260px]">
                    {searxchIcon}
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="font-normal text-[#6A7174] text-[14px] outline-none w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div> */}
            {/* <div>
              
                <CommonFilter>
                    <FilterSearch
                        onFilterChange={handleFilterChange}
                        onValueChange={handleValueChange}
                        filterOptions={[
                            { label: "Case ID", value: "caseId" },
                            { label: "Session ID", value: "sessionId" },
                            { label: "Status", value: "caseStatus" },
                        ]}
                        reset={clear}
                        setClear={setClear}
                    />
                </CommonFilter>
            </div> */}
            {/* <div className="grid grid-cols-1">
                <AgentDetailCasesTable data={dummyCases} />{" "}
            </div>  */}
        </div>
    );
};

export default AgentDetailPage;
