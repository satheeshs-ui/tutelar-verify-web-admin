import { useEffect, useMemo, useState } from "react";
import { Button, Switch, Modal, Tag } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getShiftList, setDefaultShift, UpdateShift } from "../../Services/shift.service";
import UniversalTable from "../../../../../components/ui/Table/UniversalTable";
import LottieLoader from "../../../../../components/ui/LottieUnique/LottieLoader";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatTime, shouldShowPagination } from "../../../../../utils";
import Pagination from "../../../../../components/ui/Table/Pagination";
import { useHeaderStore } from "../../../../../store/Header/useHeaderStore";
import { PrimaryButton } from "../../../../../components/buttons/PrimaryButton";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Select } from "antd";

const { confirm } = Modal;
const { Option } = Select;

export default function TableList() {
    dayjs.extend(customParseFormat);
    const { setHeaderAction } = useOutletContext();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { setHeader, clearHeader } = useHeaderStore();

    const totalRecords = data?.total;
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;

    const params = useMemo(
        () => ({
            page,
            limit,
        }),
        [page, limit]
    );
    const fetchShifts = async () => {
        try {
            setLoading(true);
            const res = await getShiftList(params);
            setData(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShifts();
    }, [limit, page]);

    const handleDefaultToggle = (record) => {
        if (record.isDefault) return;

        confirm({
            title: "Set this as default shift?",
            icon: <ExclamationCircleOutlined />,
            content: record.name,
            okText: "Yes",
            cancelText: "Cancel",
            onOk: async () => {
                await setDefaultShift(record.shiftId);
                fetchShifts();
            },
        });
    };

    useEffect(() => {
        setHeaderAction(() => (
            <div className="flex gap-3">
                <Button type="primary" onClick={() => navigate("/create-shift")}>
                    Create Shift
                </Button>
            </div>
        ));

        return () => setHeaderAction(null);
    }, [setHeaderAction, navigate]);

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex items-center gap-3">
                    <div>
                        <PrimaryButton
                            label={"Create Shift"}
                            onNotify={() => navigate("/create-shift")}
                            iconLeft={"CreateIcon"}
                        />
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader]);

    const handleStatusChange = async (user, value) => {
        if (!user?.shiftId) {
            return;
        }

        await UpdateShift(user?.shiftId, { status: value });
        fetchShifts();
    };

    const columns = [
        {
            title: "Shift Name",
            dataIndex: "name",
        },

        {
            title: "Start Time",
            render: (record) => (
                <span className="font-medium text-gray-800">
                    {formatTime(record?.timing?.startTime)}
                </span>
            ),
        },
        {
            title: "End Time",
            render: (record) => (
                <span className="font-medium text-gray-800">
                    {formatTime(record?.timing?.endTime)}
                </span>
            ),
        },
        {
            title: "Working days",
            render: (record) => (
                <div className="flex flex-wrap gap-1">
                    {record?.workingDays?.length > 0
                        ? record?.workingDays?.map((day) => (
                              <Tag key={day} color="blue" className="text-xs">
                                  {day}
                              </Tag>
                          ))
                        : "-"}
                </div>
            ),
        },
        {
            title: "Status",
            render: (u) => {
                return (
                    <div>
                        <Select
                            value={u.status}
                            className="text-[12px] border border-[#CDD0D1]! rounded-[20px]! capitalize"
                            onChange={(value) => handleStatusChange(u, value)}
                            disabled={u?.isDefault}
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
            title: "Default",
            render: (record) => (
                <Switch
                    checked={record.isDefault}
                    onChange={() => handleDefaultToggle(record)}
                    disabled={record?.status === "inactive" ? true : false}
                />
            ),
        },
    ];

    return (
        <div className="p-4">
            {loading ? (
                <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
            ) : (
                <>
                    <UniversalTable
                        rowKey="shiftId"
                        data={data?.agentShifts}
                        columns={columns}
                        maxHeight="calc(100vh - 250px)"
                    />

                    {shouldShowPagination(data, page) && (
                        <div className="mt-4">
                            <Pagination
                                state={data?.agentShifts}
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
}
