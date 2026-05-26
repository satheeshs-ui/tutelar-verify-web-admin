import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ApiCall from "../../config/api/axiosInstance";
import { showFailure, showSuccess } from "../../utils";
import AgentInformationCard from "./AgentInformationCard";
import { agentSchema } from "./Validation/agentSchema";
import { Button } from "antd";
import { usePermission } from "../../components/hooks/usePermission";
import ImageLoader from "../../components/ui/ImageLoader";
import dayjs from "dayjs";
import { useHeaderStore } from "../../store/Header/useHeaderStore";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";

const AddEditAgentFormPage = () => {
    const navigate = useNavigate();
    const { agentId } = useParams();
    const [btnLoading] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [agentShiftList, setAgentShift] = useState([]);
    const [agent, setAgent] = useState(null);
    const { setHeader, clearHeader } = useHeaderStore();
    const [languages, setLanguages] = useState([]);
    const [selectedValues, setSelectedValues] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { setHeaderAction } = useOutletContext();
    const { getPermission } = usePermission();
    const permission = getPermission();
    const loadedPages = React.useRef(new Set());

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(agentSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            employeeId: "",
            doj: null,
            state: "",
            appUserType: "agent",
            languages: [],
        },
    });

    const getLanguageList = async () => {
        const response = await ApiCall.get("video-kyc/user/languages");

        if (response?.data?.success) {
            const formatted = response?.data?.data?.map((item) => ({
                label: item,
                value: item,
            }));

            setLanguages(formatted || []);
        } else {
            showFailure(response?.data?.message);
        }
    };

    useEffect(() => {
        getLanguageList();
    }, []);

    useEffect(() => {
        if (!agentId && agentShiftList?.length) {
            const defaultShift = agentShiftList.find((shift) => shift.isDefault);

            if (defaultShift) {
                setValue("shiftId", defaultShift.value);
            }
        }
    }, [agentShiftList, agentId, setValue]);

    const getEditDetails = async () => {
        const response = await ApiCall.get(`video-kyc/user/agent/${agentId}`);

        if (response?.data?.success) {
            const data = response?.data?.data;

            setValue("name", data?.name);
            setValue("employeeId", data?.employeeDetails?.employeeId);
            setValue("email", data?.email);

            setValue("mobile", data?.mobile);
            setValue("shiftId", data?.slotTimings?.shiftId);

            setValue(
                "languages",
                Array.isArray(data?.languages)
                    ? data.languages
                    : data?.languages
                      ? [data.languages]
                      : []
            );

            setValue(
                "doj",
                data?.employeeDetails?.dateOfJoining
                    ? dayjs(data.employeeDetails.dateOfJoining)
                    : null
            );
            setSelectedValues(data?.appUserType);
            const res = agentShiftList?.find(
                (agent) => agent?.value === data?.slotTimings?.shiftId
            );
            setAgent(res);
        } else {
            showFailure(response?.message);
        }
    };

    const getShiftManageList = useCallback(async (pageNumber = 1) => {
        if (loadedPages.current.has(pageNumber)) return;

        try {
            setLoadingMore(true);

            const response = await ApiCall.get(
                `/video-kyc/agent-shift/list?page=${pageNumber}&limit=10`
            );

            if (response?.data?.success) {
                const users = response?.data?.data?.agentShifts || [];

                const formatted = response?.data?.data?.agentShifts?.map((item) => ({
                    label: item?.name,
                    value: item?.shiftId,
                    timing: item?.timing,
                    isDefault: item?.isDefault,
                }));

                setAgentShift((prev) => [...prev, ...formatted]);

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
        getShiftManageList(1);
    }, [getShiftManageList]);
    useEffect(() => {
        if (agentId) {
            getEditDetails();
        }
    }, [agentId]);

    const omit = (obj, keys) =>
        Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

    const onSubmit = useCallback(
        async (data) => {
            const agentpayload = omit(data, [
                "employeeId",
                "doj",
                "shiftFrom",
                "shiftTo",
                "state",
                "role",
                "roleId",
            ]);

            const createPayload = {
                ...agentpayload,
                appUserType: "agent",
                role: "agent",
                email: data?.email,
                employeeDetails: {
                    dateOfJoining: data?.doj,
                    employeeId: data?.employeeId,
                },
            };

            const apiCall = agentId
                ? ApiCall.patch(`video-kyc/user/agent/${agentId}`, createPayload)
                : ApiCall.post("video-kyc/user", createPayload);
            const response = await apiCall;
            if (response?.data?.success) {
                showSuccess(response?.data?.message);
                navigate(-1);
            } else {
                showFailure(response?.data?.message);
            }
        },
        [agentId, navigate]
    );

    useEffect(() => {
        setHeaderAction(() => (
            <div className="flex gap-3">
                <Button type="default" onClick={() => navigate(-1)}>
                    <ImageLoader imageKey="cancelIcon" className="w-4 h-4" />
                    Cancel
                </Button>
                {permission?.write && (
                    <Button type="primary" onClick={handleSubmit(onSubmit)} disabled={btnLoading}>
                        <ImageLoader imageKey="SubmitIcon" className="w-4 h-4" />

                        {agentId ? "Save Changes" : "Submit"}
                    </Button>
                )}
            </div>
        ));

        return () => setHeaderAction(null);
    }, [setHeaderAction, navigate, btnLoading, agentId, handleSubmit, onSubmit, permission]);

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    <div>
                        <SecondaryButton
                            label={"Cancel"}
                            onNotify={() => navigate(-1)}
                            iconLeft={"cancelIcon"}
                        />
                    </div>

                    <div>
                        {permission?.write && (
                            <PrimaryButton
                                label={agentId ? "Save Changes" : "Submit"}
                                onNotify={handleSubmit(onSubmit)}
                                iconLeft={"SubmitIcon"}
                            />
                        )}
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [
        clearHeader,
        setHeader,
        agentId,
        btnLoading,
        handleSubmit,
        navigate,
        onSubmit,
        permission?.write,
    ]);

    return (
        <>
            <div className="p-2 bg-gray-50">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full">
                        <AgentInformationCard
                            control={control}
                            errors={errors}
                            menuList={menuList}
                            setMenuList={setMenuList}
                            setValue={setValue}
                            languages={languages}
                            clearErrors={clearErrors}
                            selectedRoles={selectedValues}
                            agentShiftList={agentShiftList}
                            watch={watch}
                            agentData={agent}
                            hasMore={hasMore}
                            loadingMore={loadingMore}
                            page={page}
                            setPage={setPage}
                            api={getShiftManageList}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddEditAgentFormPage;
