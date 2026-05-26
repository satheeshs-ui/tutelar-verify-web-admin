import React, { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { CalendarDays, Download, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { showFailure, showSuccess } from "../../utils";
import ApiCall from "../../config/api/axiosInstance";
import ImageLoader from "../../components/ui/ImageLoader";
import { Checkbox } from "antd";
import DatePickerField from "../../components/ui/DatePickerField";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
// import AntdSelect from "../../components/ui/AntdSelect";
import AntdCustomSelect from "../../components/ui/AntdCustomSelect";

const ReportCenter = () => {
    const navigate = useNavigate();
    const [quickType, setQuickType] = useState("30days");
    const [startDate, setStartDate] = useState(dayjs().subtract(30, "day"));
    const [endDate, setEndDate] = useState(dayjs());
    const [agentIds, setAgentIds] = useState([]);
    const [selectedEntities, setSelectedEntities] = useState([]);

    const [loading, setLoading] = useState(false);
    const [agentList, setAgentList] = useState([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    // search text
    const [searchText, setSearchText] = useState("");
    const entityTypes = [
        { label: "Individual", value: "individual" },
        { label: "Partnership / LLP", value: "partnership" },
        { label: "Private Limited", value: "private_limited" },
        { label: "Sole Proprietorship", value: "sole_proprietorship" },
        { label: "Trust/NGO", value: "ngo_trust" },
    ];
    const loadedPages = React.useRef(new Set());
    const handleQuickSelect = (type) => {
        setQuickType(type);
    };
    useEffect(() => {
        if (!quickType) return;
        let start = dayjs();
        let end = dayjs();

        switch (quickType) {
            case "today":
                start = dayjs();
                end = dayjs();
                break;

            case "7days":
                start = dayjs().subtract(7, "day");
                end = dayjs();
                break;

            case "30days":
                start = dayjs().subtract(30, "day");
                end = dayjs();
                break;

            case "month":
                start = dayjs().startOf("month");
                end = dayjs();
                break;

            default:
                break;
        }

        setStartDate(start);
        setEndDate(end);
    }, [quickType]);
    const validateFields = () => {
        if (!startDate || !endDate) {
            showFailure("Start Date and End Date are mandatory");
            return false;
        }
        // if (!agent) {
        //     showFailure("Please select an agent");
        //     return false;
        // }
        return true;
    };

    const handleViewReport = () => {
        if (!validateFields()) return;

        const params = new URLSearchParams();

        params.append("startDate", startDate.format("YYYY-MM-DD"));
        params.append("endDate", endDate.format("YYYY-MM-DD"));

        agentIds.forEach((id) => {
            id && params.append("attendedAgentId", id);
        });
        selectedEntities.forEach((entity) => {
            entity && params.append("entity", entity);
        });

        navigate(`/reports/report-center/case-summary?${params.toString()}`);
    };

    const handleDownload = async () => {
        if (!validateFields()) return;

        try {
            setLoading(true);

            const response = await ApiCall.post("/video-kyc/report/generate", {
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD"),
                attendedAgentId: agentIds,
                entity: selectedEntities,
            });
            showSuccess(response?.data?.message);
        } catch (error) {
            showFailure(error);
        } finally {
            setLoading(false);
        }
    };

    const getAgentList = useCallback(async (pageNumber = 1) => {
        if (loadedPages.current.has(pageNumber)) return;

        try {
            setLoadingMore(true);

            const response = await ApiCall.get(
                `video-kyc/user/agents?appUserType=agent&page=${pageNumber}&limit=10`
            );

            if (response?.data?.success) {
                const users = response?.data?.data?.agents || [];

                const formatted = users.map((item) => ({
                    label: `${item.name} (${item.userId})`,
                    value: item.userId,
                }));

                setAgentList((prev) => [...prev, ...formatted]);

                loadedPages.current.add(pageNumber);

                if (users.length < 10) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
        } finally {
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        getAgentList(1);
    }, [getAgentList]);

    // disable future dates
    const disableFutureDates = (current) => {
        return current && current > dayjs().endOf("day");
    };

    // search text show logic
    const filteredAgents = agentList.filter((agent) =>
        agent.label.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
        <div>
            {/* 1st column */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex flex-wrap  items-start justify-between mb-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#F3F3F3] rounded-lg flex items-center justify-center">
                            <ImageLoader
                                imageKey="inActiveAgentIcon"
                                className="w-[20px] h-[20px]"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2 className="overall-table-text text-[16px] font-medium leading-[24px] text-gray-800 m-0!">
                                Agent & Call History Report
                            </h2>
                            <p className="text-xs font-normal leading-4 text-[#6A7174] mb-2">
                                Configure Agent & Call report parameters
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-2">Quick Select</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleQuickSelect("today")}
                                className={`px-3 py-1.5 cursor-pointer text-xs! rounded-lg transition
  ${quickType === "today" ? "bg-gray-300 text-gray-800" : "bg-[#F3F3F3] text-[#6A7174]"}`}
                            >
                                Today
                            </button>

                            <button
                                onClick={() => handleQuickSelect("7days")}
                                className={`px-3 py-1.5 cursor-pointer text-xs! rounded-lg transition
        ${quickType === "7days" ? "bg-gray-300 text-gray-800" : "bg-[#F3F3F3] text-[#6A7174]"}`}
                            >
                                Last 7 Days
                            </button>

                            <button
                                onClick={() => handleQuickSelect("30days")}
                                className={`px-3 py-1.5 cursor-pointer text-xs! rounded-lg transition
        ${quickType === "30days" ? "bg-gray-300 text-gray-800" : "bg-[#F3F3F3] text-[#6A7174]"}`}
                            >
                                Last 30 Days
                            </button>

                            <button
                                onClick={() => handleQuickSelect("month")}
                                className={`px-3 py-1.5 cursor-pointer text-xs! rounded-lg transition
        ${quickType === "month" ? "bg-gray-300 text-gray-800" : "bg-[#F3F3F3] text-[#6A7174]"}`}
                            >
                                This Month
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 mb-6"></div>
                <div className="flex items-end gap-6 flex-wrap">
                    <div className="w-60">
                        {/* <label className="block text-sm text-gray-600 mb-1">Start Date</label> */}
                        <DatePickerField
                            label="Start Date"
                            value={startDate}
                            onValueChange={(date) => {
                                setStartDate(date);
                                setQuickType(null);
                            }}
                            required
                            placeholder="DD/MM/YYYY"
                            suffixIcon="DatePickerimg"
                            disabledDate={disableFutureDates}
                        />
                        {/* <DatePicker
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            allowClear
                            placeholder="DD/MM/YYYY"
                            format="DD/MM/YYYY"
                            suffixIcon={
                                <ImageLoader imageKey="DatePickerimg" className="w-4 h-4" />
                            }
                            className="w-68 h-11 rounded-xl!"
                        /> */}
                    </div>

                    <div className="w-60">
                        {/* <label className="block text-sm text-gray-600 mb-1">End Date</label> */}
                        <DatePickerField
                            label="End Date"
                            value={endDate}
                            onValueChange={(date) => {
                                setEndDate(date);
                                setQuickType(null);
                            }}
                            isMandatory
                            placeholder="DD/MM/YYYY"
                            suffixIcon="DatePickerimg"
                            disabledDate={disableFutureDates}
                        />
                        {/* <DatePicker
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            allowCLear
                            placeholder="DD/MM/YYYY"
                            format="DD/MM/YYYY"
                            suffixIcon={
                                <ImageLoader imageKey="DatePickerimg" className="w-4 h-4" />
                            }
                            className="w-68 h-11 rounded-xl!"
                        /> */}
                    </div>

                    <div className="w-60">
                        <AntdCustomSelect
                            label="Select Agent"
                            value={agentIds}
                            onChange={(val) => {
                                setAgentIds(val);
                                setSearchText("");
                            }}
                            mode="multiple"
                            placeholder="Select Agent"
                            maxTagCount="responsive"
                            optionLabelProp="plainLabel"
                            defaultActiveFirstOption={false}
                            options={filteredAgents.map((item) => ({
                                label: (
                                    <div className="flex items-center gap-2 agent-option">
                                        <Checkbox checked={agentIds.includes(item.value)} />
                                        <span className="agent-label">{item.label}</span>
                                    </div>
                                ),
                                value: item.value,
                                plainLabel: item.label,
                            }))}
                            onPopupScroll={(e) => {
                                const target = e.target;
                                if (
                                    target.scrollTop + target.offsetHeight >=
                                        target.scrollHeight - 10 &&
                                    hasMore &&
                                    !loadingMore
                                ) {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    getAgentList(nextPage);
                                }
                            }}
                            popupRender={(menu) => (
                                <div className="custom-agent-dropdown">
                                    {/* Search */}
                                    {/* <div className="p-2">
                                        <div className="search-wrapper">
                                            <ImageLoader
                                                imageKey="Searchicon"
                                                className="search-icon-img"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                className="custom-search-input w-full px-3 py-2 border rounded"
                                            />
                                        </div>
                                    </div> */}

                                    {/* Select All */}
                                    <div className="agent-option p-3 flex gap-2">
                                        <Checkbox
                                            checked={agentIds.length === agentList.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAgentIds(agentList.map((a) => a.value));
                                                } else {
                                                    setAgentIds([]);
                                                }
                                            }}
                                        >
                                            <span className="agent-label">Select All Agent</span>
                                        </Checkbox>
                                    </div>

                                    {menu}
                                </div>
                            )}
                        />
                        {/* <label className="block text-sm text-gray-600 mb-1">Select Agent</label>
                        <Select
                            value={agentIds}
                            onChange={setAgentIds}
                            className="w-72 h-11 rounded-xl!"
                            placeholder="Select Agent"
                            size="large"
                            mode="multiple"
                            optionLabelProp="plainLabel"
                            defaultActiveFirstOption={false}
                            maxTagCount="responsive"
                            options={filteredAgents.map((item) => ({
                                label: (
                                    <div className="flex items-center gap-2 agent-option">
                                        <Checkbox checked={agentIds.includes(item.value)} />
                                        <span className="agent-label">{item.label}</span>
                                    </div>
                                ),
                                value: item.value,
                                plainLabel: item.label,
                            }))}
                            onPopupScroll={(e) => {
                                const target = e.target;
                                if (
                                    target.scrollTop + target.offsetHeight >=
                                        target.scrollHeight - 10 &&
                                    hasMore &&
                                    !loadingMore
                                ) {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    getAgentList(nextPage);
                                }
                            }}
                            popupRender={(menu) => (
                                <div className="custom-agent-dropdown">
                                    <div className="p-2">
                                        <div className="search-wrapper">
                                            <ImageLoader
                                                imageKey="Searchicon"
                                                className="search-icon-img"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                className="custom-search-input w-full px-3 py-2 border rounded"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-2 flex gap-2">
                                        <Checkbox
                                            checked={agentIds.length === agentList.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setAgentIds(agentList.map((a) => a.value));
                                                } else {
                                                    setAgentIds([]);
                                                }
                                            }}
                                        >
                                            Select All Agent
                                        </Checkbox>
                                    </div>

                                    {menu}
                                </div>
                            )}
                        /> */}
                    </div>
                    <div className="w-60">
                        <AntdCustomSelect
                            label="Select Entity"
                            value={selectedEntities}
                            onChange={(val) => {
                                setSelectedEntities(val);
                                setSearchText("");
                            }}
                            mode="multiple"
                            placeholder="Select entity"
                            maxTagCount="responsive"
                            optionLabelProp="plainLabel"
                            defaultActiveFirstOption={false}
                            options={entityTypes.map((item) => ({
                                label: (
                                    <div className="flex items-center gap-2 agent-option">
                                        <Checkbox checked={selectedEntities.includes(item.value)} />
                                        <span className="agent-label">{item.label}</span>
                                    </div>
                                ),
                                value: item.value,
                                plainLabel: item.label,
                            }))}
                            // options={entityTypes}
                            // onPopupScroll={(e) => {
                            //     const target = e.target;
                            //     if (
                            //         target.scrollTop + target.offsetHeight >=
                            //             target.scrollHeight - 10 &&
                            //         hasMore &&
                            //         !loadingMore
                            //     ) {
                            //         const nextPage = page + 1;
                            //         setPage(nextPage);
                            //         getAgentList(nextPage);
                            //     }
                            // }}
                            popupRender={(menu) => (
                                <div className="custom-agent-dropdown">
                                    <div className="agent-option p-3 flex gap-2">
                                        <Checkbox
                                            checked={selectedEntities.length === entityTypes.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedEntities(
                                                        entityTypes.map((a) => a.value)
                                                    );
                                                } else {
                                                    setSelectedEntities([]);
                                                }
                                            }}
                                        >
                                            <span className="agent-label">Select All Entity</span>
                                        </Checkbox>
                                    </div>

                                    {menu}
                                </div>
                            )}
                        />
                    </div>

                    <div className="ml-auto flex gap-3 flex-wrap">
                        <div>
                            {" "}
                            <SecondaryButton
                                label="Download"
                                onNotify={handleDownload}
                                iconLeft={"downloadImg"}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <PrimaryButton
                                label="View Report"
                                onNotify={handleViewReport}
                                iconLeft={"viewPort"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="bg-white border border-gray-200 rounded-xl p-6 mt-5">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-3">
                       
                        <div className="w-10 h-10 bg-[#F3F3F3] rounded-lg flex items-center justify-center">
                            <ImageLoader imageKey="agentLanguage" className="w-5 h-5" />
                        </div>

                      
                        <div className="flex flex-col justify-center">
                            <h2 className="text-[16px] font-medium leading-6 text-gray-800 m-0!">
                                Agent Language Summary
                            </h2>

                            <p className="text-[12px] leading-4 text-gray-400">
                                Configure agent language report parameters
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 mb-6"></div>
                <div className="flex items-end gap-6 flex-wrap">
                    <div className="w-67">
                        <label className="block text-sm text-gray-600 mb-1">Select Agent</label>
                        <AntdCustomSelect
                            value={agentIds}
                            onChange={setAgentIds}
                            className="w-72 h-11 rounded-xl!"
                            placeholder="Select Agent"
                            size="large"
                            mode="multiple"
                            maxTagCount="responsive"
                            options={agentList}
                            loading={loadingMore}
                            onPopupScroll={(e) => {
                                const target = e.target;
                                if (
                                    target.scrollTop + target.offsetHeight >=
                                        target.scrollHeight - 10 &&
                                    hasMore &&
                                    !loadingMore
                                ) {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    getAgentList(nextPage);
                                }
                            }}
                        />
                    </div>

                    <div className="ml-auto flex gap-3">
                        <div>
                            <SecondaryButton
                                label="Download"
                                onNotify={handleDownload}
                                iconLeft={"downloadImg"}
                            />
                        </div>
                       
                        <div>
                            <PrimaryButton
                                label="View Report"
                                onNotify={handleViewReport}
                                className="flex items-center rounded-full!"
                                iconLeft={"viewPort"}
                            />
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default ReportCenter;
