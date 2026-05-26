import { useEffect, useState } from "react";
import UniversalTable from "../../components/ui/Table/UniversalTable";
import Pagination from "../../components/ui/Table/Pagination";
import { checkValue, shouldShowPagination } from "../../utils";
import { TooltipCellOrFirstObject } from "../../components/ui/TooltipCell";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import useDeviceHistoryStore from "../../store/DeviceHistory/useDeviceHistoryStore";

const DeviceHistory = () => {
    const { fetchDeviceHistory, deviceHistoryList, isLoading } = useDeviceHistoryStore();
    const deviceHistoryListData = deviceHistoryList;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const totalRecords = deviceHistoryListData?.total;
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;
    const params = {
        page,
        limit,
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchDeviceHistory(params);
        };

        fetchData();
    }, [page, limit]);

    return (
        <>
            <div className="">
                <div className="flex justify-between items-center mb-4">
                    <p>Device History List</p>
                </div>

                {isLoading ? (
                    <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
                ) : (
                    <>
                        <UniversalTable
                            rowKey="caseId"
                            data={deviceHistoryListData?.userDevices}
                            maxHeight="calc(100vh - 280px)"
                            columns={[
                                {
                                    title: "Device ID",
                                    render: (u) => {
                                        return <div>{checkValue(u?.deviceId)}</div>;
                                    },
                                },
                                {
                                    title: "Device",
                                    render: (u) => {
                                        return (
                                            <div className="flex items-center gap-2">
                                                {u.isActive ? (
                                                    <p className="w-2 h-2 bg-[#35bd60]! rounded-full"></p>
                                                ) : (
                                                    <p className="w-2 h-2 bg-[#ff4d4f]! rounded-full"></p>
                                                )}
                                                <p>{checkValue(u?.device)}</p>
                                            </div>
                                        );
                                    },
                                },
                                {
                                    title: "Browser",
                                    render: (u) => {
                                        return <div>{checkValue(u?.browser)}</div>;
                                    },
                                },

                                {
                                    title: "Last Activity At",
                                    dataIndex: "lastActivityAt",
                                    width: 180,
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "lastActivityAt",
                                            from: "time",
                                        }),
                                },
                                {
                                    title: "Last Login At",
                                    dataIndex: "lastLoginAt",
                                    width: 180,
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "lastLoginAt",
                                            from: "time",
                                        }),
                                },

                                {
                                    title: "OS",
                                    render: (u) => {
                                        return <div>{checkValue(u?.os)}</div>;
                                    },
                                },
                                {
                                    title: "IP Address",
                                    render: (u) => {
                                        return <div>{checkValue(u?.ipAddress)}</div>;
                                    },
                                },
                            ]}
                        />

                        {shouldShowPagination(deviceHistoryListData, page) && (
                            <div className="mt-4">
                                <Pagination
                                    state={deviceHistoryListData}
                                    currentPage={page}
                                    totalPages={totalPages}
                                    rowsPerPage={limit}
                                    setCurrentPage={setPage}
                                    setRowsPerPage={setLimit}
                                    totalRecords={deviceHistoryListData.total}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default DeviceHistory;
