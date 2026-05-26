import { useEffect, useMemo, useState } from "react";
import UniversalTable from "../../components/ui/Table/UniversalTable";
import Pagination from "../../components/ui/Table/Pagination";
import { checkValue, shouldShowPagination } from "../../utils";
import FilterSearch from "../../components/ui/FilterSearch";
import { TooltipCellOrFirstObject } from "../../components/ui/TooltipCell";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import { Button, Select, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { usePermission } from "../../components/hooks/usePermission";
import useAgentStore from "../../store/Agent/useAgentStore";
import dayjs from "dayjs";
import CommonFilter from "../../components/ui/Filter";
import ImageLoader from "../../components/ui/ImageLoader";
import { useHeaderStore } from "../../store/Header/useHeaderStore";

const { Option } = Select;

const AgentList = () => {
    const { getPermission } = usePermission();
    const permission = getPermission();
    const navigate = useNavigate();
    const { getAgentList, unblockAgentAccount, agentList, updateUser, isLoading } = useAgentStore();

    const statusData = ["active", "inactive"];

    const handleStatus = (sts) => {
        setStatus(sts);
    };
    const { setHeader, clearHeader } = useHeaderStore();

    const agentListData = agentList;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [selectType, setSelectType] = useState("email");
    const [status, setStatus] = useState("");
    const [appUserType, setRole] = useState("");
    const [clear, setClear] = useState(false);
    const [agentSearch] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);

    const filterOptions = [
        { label: "Email", value: "email" },
        { label: "Name", value: "name" },
        { label: "Phone Number", value: "mobile" },
        { label: "Agent ID", value: "userId" },
        { label: "Date Range", value: "dateRange" },
    ];

    const totalRecords = agentListData?.total;
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;
    const startDate = dateRange?.[0]?.format("YYYY-MM-DD");
    const endDate = dateRange?.[1]?.format("YYYY-MM-DD");
    const params = useMemo(
        () => ({
            page,
            limit,
            ...(search ? { [selectType]: search } : {}),
            ...(status && status !== "all" ? { status } : {}),
            ...(appUserType && appUserType !== "all" ? { appUserType } : {}),

            ...(startDate && endDate && { startDate, endDate }),
        }),
        [page, limit, search, status, appUserType, selectType, dateRange]
    );
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        handleTable();
    }, [page, limit, getAgentList, clear]);

    const handleTable = () => {
        const fetchData = async () => {
            await getAgentList(params);
        };

        fetchData();
    };

    const handleCreateAgentPage = (id = "") => {
        navigate(`/agents/agents-list/edit-agent/${id}`);
    };

    const handleFilterChange = (filterType) => {
        setSelectType(filterType);
        setSearch("");
    };

    const handleValueChange = (value) => {
        if (typeof value === "object") {
            setDateRange([
                value.startDate ? dayjs(value.startDate) : null,
                value.endDate ? dayjs(value.endDate) : null,
            ]);
            setSearch("");
        } else {
            setSearch(value.trim());
        }
    };

    const handleStatusChange = (user, value) => {
        if (!user?.userId) {
            return;
        }

        updateUser(user.userId, { status: value }, (res) => {
            if (res) {
                getAgentList(params);
            }
        });
    };

    const handleApply = () => {
        handleTable();
        setPage(1);
    };
    const handleReset = () => {
        setSearch("");
        setSelectType("email");
        setStatus("");
        setClear(true);
        setPage(1);
        setDateRange([null, null]);
        setRole("");
    };

    const handleClick = () => {
        navigate("/agents/agents-list/create-agent");
    };

    const filteredData = agentListData?.agents?.filter((item) =>
        item.name?.toLowerCase().includes(agentSearch.toLowerCase())
    );

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    <div>
                        <CommonFilter
                            onApply={handleApply}
                            onReset={handleReset}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        >
                            <div className="flex flex-col">
                                <div className="mt-0">
                                    <FilterSearch
                                        onFilterChange={handleFilterChange}
                                        onValueChange={handleValueChange}
                                        filterOptions={filterOptions}
                                        reset={clear}
                                        setClear={setClear}
                                        value={search}
                                        selectedFilter={selectType}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label>Status</label>
                                    <div className="flex gap-3 mt-3">
                                        {statusData?.map((sts, s) => (
                                            <div
                                                key={s}
                                                className={`${status === sts ? "py-[9px] px-[18px] bg-primary text-white" : "border border-[#CDD0D1] py-[9px] px-[18px]"} capitalize rounded-3xl cursor-pointer`}
                                                onClick={() => handleStatus(sts)}
                                            >
                                                {sts}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CommonFilter>
                    </div>

                    <div>
                        {permission?.write && (
                            <PrimaryButton
                                label={"Create Agent"}
                                onNotify={handleClick}
                                iconLeft={"CreateIcon"}
                            />
                        )}
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, navigate, search, appUserType, status, selectType, dateRange]);

    const handleUnblockAgent = (obj) => {
        if (!obj || !obj.userId) {
            console.error("Invalid user object", obj);
            return;
        }

        unblockAgentAccount(obj.userId, {}, (res) => {
            if (res) {
                getAgentList(params);
            }
        });
    };
    const handleAuthLock = (date, record) => {
        if (!date) return <Tag color={"green"}>{"Active"}</Tag>;

        const lockDate = new Date(date);
        if (isNaN(lockDate.getTime())) return "UnBlock";

        const LOCK_DURATION = 10 * 60 * 1000;
        const unlockTime = new Date(lockDate.getTime() + LOCK_DURATION);

        return new Date() > unlockTime ? (
            <Tag color={"green"}>{"Active"}</Tag>
        ) : (
            <Button
                type="link"
                danger
                onClick={() => handleUnblockAgent(record)}
                className="bg-amber-600! text-[#fff]! h-8!"
            >
                Unblock
            </Button>
        );
    };

    const ClockStatus = (isClockedIn) => {
        const isIn = !!isClockedIn;

        return (
            <div
                className={`
                w-fit
                flex items-center gap-2
                px-3 py-1.5
                rounded-full
                border
                text-sm font-medium
                transition-all duration-200
                ${
                    isIn
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-600"
                }
            `}
            >
                <span
                    className={`
                    flex items-center justify-center
                    w-3 h-3 rounded-full bg-green-500 animate-pulse
                    ${isIn ? "bg-green-500" : "bg-red-500"}
                `}
                >
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>

                <span>{isIn ? "Clocked In" : "Clocked Out"}</span>
            </div>
        );
    };
    return (
        <>
            <div className="px-3">
                {isLoading ? (
                    <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
                ) : (
                    <>
                        <UniversalTable
                            rowKey="userId"
                            nodatamessage="Oops! There’s nothing here"
                            describemessage="There is nothing here to view right now, please add
                            New Agent data to get started."
                            data={filteredData}
                            maxHeight="calc(100vh - 280px)"
                            columns={[
                                {
                                    title: (
                                        <div className="flex items-center gap-2">
                                            <span>Agent ID</span>
                                        </div>
                                    ),
                                    render: (u) => (
                                        <div className="flex items-center gap-2 text-[#0B1C20]">
                                            <span> {checkValue(u?.userId)}</span>
                                        </div>
                                    ),
                                    width: 100,
                                },

                                {
                                    title: (
                                        <div className="flex items-center gap-1">
                                            <span>Name</span>
                                        </div>
                                    ),
                                    dataIndex: "name",
                                    width: 100,
                                    render: (u) => (
                                        <span className="text-gray-900 font-normal capitalize">
                                            {TooltipCellOrFirstObject({
                                                device: u,
                                                field: "name",
                                                from: "tooltip",
                                            })}
                                        </span>
                                    ),
                                },

                                {
                                    title: (
                                        <div className="flex items-center gap-1">
                                            <span>Email</span>
                                        </div>
                                    ),
                                    dataIndex: "email",
                                    className: "email-column",
                                    width: 100,
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "email",
                                            from: "tooltip",
                                        }),
                                },

                                {
                                    title: "Phone",
                                    render: (u) => (
                                        <span className="text-gray-900">
                                            {TooltipCellOrFirstObject({
                                                device: u,
                                                field: "mobile",
                                                from: "tooltip",
                                            })}
                                        </span>
                                    ),
                                    width: 100,
                                },

                                {
                                    title: "Created At",
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "createdAt",
                                            from: "time",
                                        }),

                                    width: 100,
                                },

                                {
                                    title: "Status",
                                    render: (u) => {
                                        return (
                                            <div>
                                                <Select
                                                    value={u.status}
                                                    className="text-[12px] border border-[#CDD0D1]! rounded-[20px]! capitalize"
                                                    onChange={(value) =>
                                                        handleStatusChange(u, value)
                                                    }
                                                >
                                                    <Option value="active">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                            Active
                                                        </div>
                                                    </Option>

                                                    <Option value="inactive">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                            Inactive
                                                        </div>
                                                    </Option>
                                                </Select>
                                            </div>
                                        );
                                    },
                                    width: 100,
                                },
                                {
                                    title: "Account Access",
                                    render: (u) => handleAuthLock(u.authLockedAt, u),
                                    width: 100,
                                },
                                {
                                    title: "Clocked Status",
                                    render: (u) => ClockStatus(u?.is_currently_clocked_in),
                                },

                                {
                                    title: "Actions",
                                    render: (u) => {
                                        return (
                                            <div className="flex gap-2">
                                                <span
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/agents/agents-list/view-agent/${u.userId}`
                                                        )
                                                    }
                                                >
                                                    <ImageLoader imageKey="ViewIcons" />
                                                </span>
                                                <span
                                                    className="cursor-pointer"
                                                    onClick={() => handleCreateAgentPage(u?.userId)}
                                                >
                                                    <ImageLoader imageKey="EditIcons" />
                                                </span>
                                            </div>
                                        );
                                    },
                                },
                            ]}
                        />

                        {shouldShowPagination(agentListData?.agents, page) && (
                            <div className="mt-4">
                                <Pagination
                                    state={agentListData?.agents}
                                    currentPage={page}
                                    totalPages={totalPages}
                                    rowsPerPage={limit}
                                    setCurrentPage={setPage}
                                    setRowsPerPage={setLimit}
                                    totalRecords={agentListData?.total}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default AgentList;
