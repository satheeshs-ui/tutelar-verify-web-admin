import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "antd";
import { agentSchema } from "../Agent/Validation/agentSchema";
import { showFailure, showSuccess } from "../../utils";
import ApiCall from "../../config/api/axiosInstance";
import AgentPermissionSummary from "../Agent/AgentPermissionSummary";
import RoleInformationCard from "./RoleInformationCard";

const AddEditRolesAndPermission = () => {
    const navigate = useNavigate();

    const { roleId } = useParams();
    const [btnLoading] = useState(false);
    const [menuList, setMenuList] = useState([]);

    const { setHeaderAction } = useOutletContext();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(agentSchema),
        defaultValues: {
            roleName: "",
            roleCode: "",
            status: "",
            userType: "",
        },
    });

    const selectedRole = watch("roleId");

    const getMenuListApi = async (roleId) => {
        try {
            const response = await ApiCall.get(`video-kyc/roles/client/${roleId}`);

            if (response?.data?.success) {
                const cloned =
                    response?.data?.data?.roleDetails?.menuPermission?.map((parent) => ({
                        ...parent,
                        enabled: true,
                        childMenu: parent?.childMenus?.map((child) => ({
                            ...child,
                            enabled: true,
                            access: "readWrite",
                        })),
                    })) || [];

                setMenuList(cloned);
                setValue("appUserType", response?.data?.data?.roleDetails?.userType);
                setValue("role", "agent");
            } else {
                showFailure(response?.message);
            }
        } catch (error) {
            console.error("Menu List API Error:", error);
            showFailure("Failed to fetch menu list");
        }
    };

    useEffect(() => {
        if (selectedRole) {
            getMenuListApi(selectedRole);
        }
    }, [selectedRole]);

    const getEditDetails = async () => {
        const response = await ApiCall.get(`video-kyc/user/${roleId}`);

        if (response?.data?.success) {
            const data = response?.data?.data;
            setValue("name", data?.name);
            setValue("email", data?.email);
            setValue("mobile", data?.mobile);
            setValue("roleId", data?.roleId);
            setValue("role", data?.role || "agent");
        } else {
            showFailure(response?.message);
        }
    };

    useEffect(() => {
        if (roleId) {
            getEditDetails();
        }
    }, [roleId]);

    const onSubmit = useCallback(
        async (data) => {
            const { name, email, mobile } = data;
            const payload = { name, email, mobile };
            const apiCall = roleId
                ? ApiCall.put(`video-kyc/user/${roleId}`, payload)
                : ApiCall.post(`video-kyc/user`, data);
            const response = await apiCall;
            if (response?.data?.success) {
                showSuccess(response?.data);
                navigate(-1);
            } else {
                showFailure(response);
            }
        },
        [roleId, navigate]
    );
    useEffect(() => {
        setHeaderAction(() => (
            <div className="flex gap-3">
                <Button type="default" onClick={() => navigate(-1)}>
                    Cancel
                </Button>

                <Button type="primary" onClick={handleSubmit(onSubmit)} disabled={btnLoading}>
                    {roleId ? "Edit" : "Create"}
                </Button>
            </div>
        ));

        return () => setHeaderAction(null);
    }, [setHeaderAction, navigate, btnLoading, roleId, handleSubmit, onSubmit]);

    return (
        <div className="p-2 bg-gray-50 overall-container">
            <h1 className="text-xl font-extrabold text-gray-900 mb-4">
                {roleId ? "Edit Role" : "Create Role"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="w-full grid grid-cols-1 
                lg:grid-cols-[65%_33%] gap-6"
                >
                    <RoleInformationCard
                        control={control}
                        errors={errors}
                        menuList={menuList}
                        setMenuList={setMenuList}
                        setValue={setValue}
                    />
                    <AgentPermissionSummary menuList={menuList} roleId={roleId} />
                </div>
            </form>
        </div>
    );
};

export default AddEditRolesAndPermission;
