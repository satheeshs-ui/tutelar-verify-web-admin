import { useEffect, useState } from "react";
import UniversalTable from "../../components/ui/Table/UniversalTable";
import Pagination from "../../components/ui/Table/Pagination";
import { checkValue, removeUnderScore, shouldShowPagination } from "../../utils";
import { TooltipCellOrFirstObject } from "../../components/ui/TooltipCell";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import useActivityStore from "../../store/LoginActivity/useLoginActivityStore";

const LoginActivities = () => {
    const { fetchLoginActivity, activityList, isLoading } = useActivityStore();
    const activityListData = activityList;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const totalRecords = activityListData?.total;
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;
    const params = {
        page,
        limit,
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchLoginActivity(params);
        };

        fetchData();
    }, [page, limit]);

    return (
        <>
            <div className="">
                <div className="flex justify-between items-center mb-4">
                    <p>Login Activity List</p>
                </div>

                {isLoading ? (
                    <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
                ) : (
                    <>
                        <UniversalTable
                            rowKey="caseId"
                            data={activityListData?.activities}
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
                                        return <div>{checkValue(u?.device)}</div>;
                                    },
                                },
                                {
                                    title: "Browser",
                                    render: (u) => {
                                        return <div>{checkValue(u?.browser)}</div>;
                                    },
                                },
                                {
                                    title: "Activity At",
                                    dataIndex: "createdAt",
                                    width: 180,
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "createdAt",
                                            from: "time",
                                        }),
                                },
                                {
                                    title: "Type",
                                    render: (u) => {
                                        return (
                                            <div>{checkValue(removeUnderScore(u?.eventType))}</div>
                                        );
                                    },
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
                                {
                                    title: "Failure Reason",
                                    render: (u) => {
                                        return <div>{checkValue(u?.failureReason)}</div>;
                                    },
                                },
                            ]}
                        />

                        {shouldShowPagination(activityListData, page) && (
                            <div className="mt-4">
                                <Pagination
                                    state={activityListData}
                                    currentPage={page}
                                    totalPages={totalPages}
                                    rowsPerPage={limit}
                                    setCurrentPage={setPage}
                                    setRowsPerPage={setLimit}
                                    totalRecords={activityListData.total}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default LoginActivities;
