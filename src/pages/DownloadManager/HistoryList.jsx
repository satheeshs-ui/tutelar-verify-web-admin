import React, { useCallback, useEffect, useState } from "react";
import { Button } from "antd";
import { Download } from "lucide-react";
import { shouldShowPagination, showFailure } from "../../utils";
import ApiCall from "../../config/api/axiosInstance";
import Pagination from "../../components/ui/Table/Pagination";
import UniversalTable from "../../components/ui/Table/UniversalTable";
import {
    TooltipCellOrFirstObject,
    TooltipCellOrSecondObject,
} from "../../components/ui/TooltipCell";
import SecondaryButton from "../../components/buttons/SecondaryButton";

const HistoryList = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const totalRecords = 20;
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;

    const fetchList = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ApiCall.get(`video-kyc/report/list?page=${page}&limit=${limit}`);
            setData(response.data?.data || []);
        } catch {
            showFailure("Failed to fetch list");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const handleDownload = async (reportId, fileName) => {
        try {
            setBtnLoading(true);

            const response = await ApiCall.get(`/video-kyc/report/download?reportId=${reportId}`);

            const fileUrl = response.data?.data?.fileUrl;

            if (!fileUrl) {
                showFailure("File URL not found");
                return;
            }

            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileName || "report.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            showFailure(error);
        } finally {
            setBtnLoading(false);
        }
    };

    const columns = [
        {
            title: "Download ID",
            dataIndex: "reportId",
            width: 100,
        },
        // {
        //     title: "User Type",
        //     dataIndex: "serviceDisplayName",
        //     minWidth: 100,
        //     render: (row) =>
        //         TooltipCellOrSecondObject({
        //             device: row,
        //             fieldOne: "requestedBy",
        //             fieldTwo: "userType",
        //             from: "tooltip",
        //         }),
        // },
        {
            title: "File Name",
            dataIndex: "fileName",
            width: 100,
            render: (row) =>
                TooltipCellOrFirstObject({
                    device: row,
                    field: "fileName",
                    from: "tooltip",
                }),
        },
        {
            title: "Requested By",
            dataIndex: "requestedBy",
            width: 100,
            render: (row) =>
                TooltipCellOrSecondObject({
                    device: row,
                    fieldOne: "requestedBy",
                    fieldTwo: "name",
                    from: "tooltip",
                }),
        },
        {
            title: "Requested At",
            dataIndex: "requestedAt",
            width: 100,
            render: (row) =>
                TooltipCellOrFirstObject({
                    device: row,
                    field: "createdAt",
                    from: "time",
                }),
        },

        {
            title: "Action",
            width: 100,
            render: (row) => (
                <div className="w-fit">
                    <SecondaryButton
                        size="small"
                        iconLeft="downloadImg"
                        label="Download"
                        onNotify={() => handleDownload(row.reportId, row.fileName)}
                        loading={btnLoading}
                        // disabled={btnLoading}
                    >
                        Download
                    </SecondaryButton>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 max-[500px]:text-[14px]">
                    Download Manager
                </h2>
            </div>

            {/* Table */}
            {loading ? (
                <div className="py-10 text-center text-gray-500">Loading data...</div>
            ) : (
                <>
                    <UniversalTable
                        columns={columns}
                        data={data}
                        rowKey="caseId"
                        maxHeight="calc(100vh - 280px)"
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

export default HistoryList;
