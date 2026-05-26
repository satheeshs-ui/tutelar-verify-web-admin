import { useEffect, useState } from "react";
import { TooltipCellOrFirstObject } from "../../components/ui/TooltipCell";

import UniversalTable from "../../components/ui/Table/UniversalTable";
import useApiKeyStore from "../../store/ApiKey/useApiKeyStore";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import Pagination from "../../components/ui/Table/Pagination";
import { Tooltip } from "antd";
import ViewApiKeyModal from "./Components/ViewApiKeyModal";
import AddApiKeyModal from "./Components/AddApiKeyModal";
import { Eye, RefreshCcw } from "lucide-react";
import { shouldShowPagination } from "../../utils";
import { usePermission } from "../../components/hooks/usePermission";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useHeaderStore } from "../../store/Header/useHeaderStore";
import ImageLoader from "../../components/ui/ImageLoader";

const APIkeyList = () => {
    const { getPermission } = usePermission();
    const permission = getPermission();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [apiKeyModal, setApiKeyModal] = useState({
        open: false,
        verified: false,
        password: "",
        username: "",
        secret: "",
    });
    const [addApiKeyModalOpen, setAddApiKeyModalOpen] = useState(false);
    const [regenerateKeyEnv, setRegenerateKeyEnv] = useState(null);
    const [viewEnv, setViewEnv] = useState(null);
    const { setHeader, clearHeader } = useHeaderStore();

    const openViewApiKeyModal = (env) => {
        setViewEnv(env);
        setApiKeyModal({
            open: true,
            verified: false,
            password: "",
            username: "",
            secret: "",
        });
    };

    const { isLoading, apiKeyListData, fetchApiKeys, totalPages, generateApiKey } =
        useApiKeyStore();
    const params = {
        page,
        limit,
    };
    useEffect(() => {
        const fetchData = async () => {
            await fetchApiKeys(params);
        };

        fetchData();
    }, [page, limit, fetchApiKeys]);

    const handleCreateKey = async (data) => {
        await generateApiKey(data).then(async () => {
            await fetchApiKeys(params);
        });
    };
    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    {permission?.write && (
                        <PrimaryButton
                            label="Add Key"
                            onNotify={() => setAddApiKeyModalOpen(true)}
                            disabled={isLoading}
                        />
                    )}
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, isLoading]);
    return (
        <>
            <div className="">
                {apiKeyModal.open && (
                    <ViewApiKeyModal
                        state={apiKeyModal}
                        setState={setApiKeyModal}
                        environment={viewEnv}
                    />
                )}
                {addApiKeyModalOpen && (
                    <AddApiKeyModal
                        open={addApiKeyModalOpen}
                        onClose={() => {
                            setRegenerateKeyEnv(null);
                            setAddApiKeyModalOpen(false);
                        }}
                        onSubmit={handleCreateKey}
                        regenerateKeyEnv={regenerateKeyEnv}
                    />
                )}

                {isLoading ? (
                    <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
                ) : (
                    <>
                        <UniversalTable
                            rowKey="keyId"
                            data={apiKeyListData}
                            maxHeight="calc(100vh - 280px)"
                            columns={[
                                {
                                    title: "Environment",
                                    dataIndex: "environment",
                                    width: 150,
                                    render: (u) => (
                                        <span className="text-gray-900 font-normal capitalize">
                                            {TooltipCellOrFirstObject({
                                                device: u,
                                                field: "environment",
                                                from: "tooltip",
                                            })}
                                        </span>
                                    ),
                                },
                                {
                                    title: "Created At",
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
                                    title: "Expires at",
                                    dataIndex: "expiresAt",
                                    width: 150,
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "expiresAt",
                                            from: "date",
                                        }),
                                },
                                {
                                    title: "Last used",
                                    dataIndex: "lastUsedAt",
                                    width: 180,
                                    render: (u) =>
                                        TooltipCellOrFirstObject({
                                            device: u,
                                            field: "lastUsedAt",
                                            from: "time",
                                        }),
                                },
                                {
                                    title: "Action",
                                    width: 120,
                                    render: (u) => (
                                        <div className="flex gap-4 items-center">
                                            <Tooltip title="View API Key">
                                                <ImageLoader
                                                    imageKey="ViewIcons"
                                                    size={18}
                                                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                                                    onClick={() =>
                                                        openViewApiKeyModal(u.environment)
                                                    }
                                                />
                                            </Tooltip>

                                            <Tooltip title="Regenerate API Key">
                                                <ImageLoader
                                                    imageKey="EditIcons"
                                                    size={18}
                                                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                                                    onClick={() => {
                                                        setRegenerateKeyEnv(u.environment);
                                                        setAddApiKeyModalOpen(true);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    ),
                                },
                            ]}
                        />

                        {shouldShowPagination(apiKeyListData, page) && (
                            <div className="mt-4">
                                <Pagination
                                    state={apiKeyListData}
                                    currentPage={page}
                                    totalPages={totalPages}
                                    rowsPerPage={limit}
                                    setCurrentPage={setPage}
                                    setRowsPerPage={setLimit}
                                    totalRecords={apiKeyListData?.total}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default APIkeyList;
