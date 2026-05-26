import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    formatTitle,
    removeUnderScore,
    shouldShowPagination,
    showFailure,
    showSuccess,
} from "../../../utils";
import ApiCall from "../../../config/api/axiosInstance";
import Pagination from "../../../components/ui/Table/Pagination";
import UniversalTable from "../../../components/ui/Table/UniversalTable";
import {
    TooltipCellOrFirstObject,
    TooltipCellOrSecondObject,
} from "../../../components/ui/TooltipCell";
import LottieLoader from "../../../components/ui/LottieUnique/LottieLoader";
import dayjs from "dayjs";
import SecondaryButton from "../../../components/buttons/SecondaryButton";

const AgentSummaryReport = () => {
    const [searchParams] = useSearchParams();

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const attendedAgentId = searchParams.getAll("attendedAgentId");
    const entityId = searchParams.getAll("entity");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const totalRecords = 20;
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;

    const fetchList = useCallback(async () => {
        try {
            setLoading(true);
            let searchQuery = `startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;

            if (attendedAgentId.length > 0) {
                attendedAgentId.forEach((id) => {
                    searchQuery += `&attendedAgentId=${id}`;
                });
            }

            if (entityId.length > 0) {
                entityId.forEach((id) => {
                    searchQuery += `&entity=${id}`;
                });
            }

            const response = await ApiCall.get(`video-kyc/case/list?${searchQuery}`);
            setData(response.data?.data?.cases || []);
        } catch {
            showFailure("Failed to fetch list");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, page, limit]);

    useEffect(() => {
        if (!startDate || !endDate) {
            showFailure("Invalid report parameters");
            return;
        }

        fetchList();
    }, [fetchList, startDate, endDate]);

    const handleDownload = async () => {
        try {
            setLoading(true);

            const response = await ApiCall.post("/video-kyc/report/generate", {
                startDate,
                endDate,
                attendedAgentId,
            });

            if (response?.data?.success) {
                showSuccess(response?.data.message);
            }
        } catch {
            showFailure("Download failed");
        } finally {
            setLoading(false);
        }
    };

    const documentHeaders = [
        "facePercentage",
        "aadharPercentage",
        "panPercentage",
        "gstPercentage",
        "voterIdPercentage",
        "drivingLicensePercentage",
        "passportPercentage",
        "cinPercentage",
    ];

    const documentColumns = documentHeaders?.map((doc) => ({
        title: formatTitle(doc),
        align: "start",
        render: (record) => {
            const value = record?.verificationResults?.[doc];
            return value !== undefined && value !== null ? `${Number(value).toFixed(2)}%` : "-";
        },
    }));
    const columns = [
        {
            title: "Case ID",
            dataIndex: "caseId",
        },
        {
            title: "Customer Name",
            dataIndex: "name",
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
                    <span>Customer Email</span>
                </div>
            ),
            dataIndex: "email",
            className: "email-column",
            render: (u) =>
                TooltipCellOrFirstObject({
                    device: u,
                    field: "email",
                    from: "tooltip",
                }),
        },
        {
            title: "Customer Phone Number",
            render: (u) => (
                <span className="text-gray-900">
                    {TooltipCellOrSecondObject({
                        device: u,
                        fieldOne: "phone",
                        fieldTwo: "number",
                        from: "tooltip",
                    })}
                </span>
            ),
        },
        {
            title: "Scheduled date time",
            align: "center",
            render: (u) =>
                TooltipCellOrFirstObject({
                    device: u,
                    field: "scheduledDateTime",
                    from: "time",
                }),
        },
        {
            title: "Link Expiry date time",
            align: "center",
            render: (u) =>
                TooltipCellOrFirstObject({
                    device: u,
                    field: "expiresAt",
                    from: "time",
                }),
        },
        {
            title: "Case Status",
            align: "",
            dataIndex: "caseStatus",
            render: (row) => (
                <span
                    className={`px-2 capitalize py-1 rounded-md text-xs font-medium ${
                        row.caseStatus === "approved" ||
                        row.caseStatus === "completed" ||
                        row.caseStatus === "created"
                            ? "bg-green-50 text-green-600"
                            : row.caseStatus === "rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-yellow-50 text-yellow-600"
                    }`}
                >
                    {row.caseStatus}
                </span>
            ),
        },
        {
            title: "Review Status",
            align: "",
            dataIndex: "reviewStatus",
            render: (row) => (
                <span
                    className={`px-2 capitalize py-1 rounded-md text-xs font-medium ${
                        row.reviewStatus === "approved" ||
                        row.reviewStatus === "completed" ||
                        row.reviewStatus === "AUDITOR_APPROVED" ||
                        row.reviewStatus === "created"
                            ? "bg-green-50 text-green-600"
                            : row.reviewStatus === "rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-yellow-50 text-yellow-600"
                    }`}
                >
                    {removeUnderScore(row.reviewStatus)}
                </span>
            ),
        },
        {
            title: "Entity Type",
            align: "",
            dataIndex: "entity",
            render: (u) => (
                <span className="text-gray-900 font-normal capitalize">
                    {removeUnderScore(u?.entity)}
                </span>
            ),
        },
        {
            title: "Assigned Mode",
            align: "center",
            dataIndex: "assignMode",
            render: (u) => (
                <span className="text-gray-900 font-normal capitalize">
                    {TooltipCellOrFirstObject({
                        device: u,
                        field: "assignMode",
                        from: "tooltip",
                    })}
                </span>
            ),
        },
        {
            title: "Assign by",
            align: "center",
            dataIndex: "assignBy",
            render: (u) => (
                <span className="text-gray-900 font-normal capitalize">
                    {TooltipCellOrFirstObject({
                        device: u?.assignBy,
                        field: "name",
                        from: "tooltip",
                    })}
                </span>
            ),
        },
        {
            title: "Assigned Agent Name",
            align: "center",
            dataIndex: "agent",
            render: (u) => (
                <span className="text-gray-900 font-normal capitalize">
                    {TooltipCellOrFirstObject({
                        device: u?.agent,
                        field: "name",
                        from: "tooltip",
                    })}
                </span>
            ),
        },

        {
            title: "Attended Agent Name",
            dataIndex: "attendedAgentName",
            render: (u) => (
                <span className="text-gray-900 font-normal capitalize">
                    {TooltipCellOrFirstObject({
                        device: u,
                        field: "attendedAgentName",
                        from: "tooltip",
                    })}
                </span>
            ),
        },

        {
            title: "Call Duration",
            align: "center",
            render: (record) => {
                const start = record?.callPeriod?.startTime;
                const end = record?.callPeriod?.endTime;

                if (!start || !end) return "-";

                const startTime = dayjs(start);
                const endTime = dayjs(end);

                const diffSeconds = endTime.diff(startTime, "second");

                const minutes = Math.floor(diffSeconds / 60);
                const seconds = diffSeconds % 60;

                return `${minutes}m ${seconds}s`;
            },
        },

        ...documentColumns,

        {
            title: "Device Risk",
            align: "right",
            render: (record) => {
                const score = Number(record?.verificationResults?.devicePercentage ?? 0);
                return `${score.toFixed(2)}%`;
            },
        },
        {
            title: "Overall Confidence Score",
            dataIndex: "overallConfidenceScore",
            align: "center",
            render: (row) => {
                const score = Number(row.verificationResults?.finalPercentage ?? 0);
                return `${score.toFixed(2)}%`;
            },
        },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 max-[500px]:text-[13px]">
                    Case Summary Report
                </h2>

                <div>
                    {data.length > 0 && (
                        <SecondaryButton
                            label="Download"
                            onNotify={handleDownload}
                            iconLeft={"downloadImg"}
                            disabled={loading}
                        />
                    )}
                </div>
            </div>

            {loading ? (
                <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
            ) : (
                <>
                    <UniversalTable
                        columns={columns}
                        data={data}
                        rowKey="caseId"
                        maxHeight="calc(100vh - 300px)"
                    />
                    {shouldShowPagination(data, page) && (
                        <div className="mt-4">
                            <Pagination
                                state={data}
                                currentPage={page}
                                totalPages={totalPages}
                                rowsPerPage={limit}
                                setCurrentPage={setPage}
                                setRowsPerPage={setLimit}
                                totalRecords={data?.total}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AgentSummaryReport;
