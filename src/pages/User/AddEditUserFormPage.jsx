/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ApiCall from "../../config/api/axiosInstance";
import { showFailure, showSuccess } from "../../utils";

import UserInformationCard from "./UserInformationCard";
import { agentSchema } from "./Validation/userSchema";
import { Button } from "antd";
// import { usePermission } from "../../components/hooks/usePermission";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import dayjs from "dayjs";
import { useHeaderStore } from "../../store/Header/useHeaderStore";

const AddEditUserFormPage = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [btnLoading, setBtnLoading] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedValues, setSelectedValues] = useState("");
    const { setHeaderAction } = useOutletContext();
    const { setHeader, clearHeader } = useHeaderStore();

    // const { getPermission } = usePermission();
    // const permission = getPermission();
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
            roleId: "",
            role: "checker",
            appUserType: "",
            languages: [],
            dateOfJoining: null,
            designation: "",
            department: "",
        },
    });

    const selectedRole = watch("roleId");
    const selectedRoles = watch("role");

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
                setValue(
                    "role",
                    response?.data?.data?.roleDetails?.userType === "agent" ? "agent" : "client"
                );
            } else {
                showFailure(response?.message);
                setBtnLoading(false);
            }
        } catch (error) {
            console.error("Menu List API Error:", error);
            showFailure("Failed to fetch menu list");
        }
    };

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
        if (selectedRole) {
            getMenuListApi(selectedRole);
        }
    }, [selectedRole]);

    const getEditDetails = async () => {
        const response = await ApiCall.get(`video-kyc/user/${userId}`);

        if (response?.data?.success) {
            const data = response?.data?.data;
            setValue("name", data?.name);
            setValue("email", data?.email);
            setValue("mobile", data?.mobile);
            setValue("roleId", data?.roleId);
            setValue("employeeId", data?.employeeDetails?.employeeId);
            setValue("department", data?.employeeDetails?.department);
            setValue("designation", data?.employeeDetails?.designation);
            setValue("role", data?.role || "agent");
            // setValue("role", data?.appUserType || "agent");
            setValue(
                "languages",
                Array.isArray(data?.languages)
                    ? data.languages
                    : data?.languages
                      ? [data.languages]
                      : []
            );
            setValue("is_sign_language", data?.is_sign_language || false);
            setValue(
                "dateOfJoining",
                data?.employeeDetails?.dateOfJoining
                    ? dayjs(data.employeeDetails.dateOfJoining)
                    : null
            );
            setSelectedValues(data?.appUserType);
        } else {
            showFailure(response?.message);
        }
    };

    useEffect(() => {
        if (userId) {
            getEditDetails();
        }
    }, [userId]);

    const onSubmit = useCallback(
        async (data) => {
            // const { name, email, role, mobile, languages } = data;
            // const { lastname, ...userpaylod } = data;

            const {
                dateOfJoining,
                department,
                designation,
                employeeId,
                dob,
                is_sign_language,
                ...agentpayload
            } = data;

            const createPayload = {
                ...agentpayload,
                email: data?.email,
                employeeDetails: {
                    dateOfJoining: data?.dateOfJoining,
                    employeeId: data?.employeeId,

                    designation: data?.designation,
                    department: data?.department,
                },
            };
            // const payload = {
            //     name,
            //     role,
            //     email,
            //     mobile,
            //     is_sign_language,
            //     languages,
            // };

            const apiCall = userId
                ? ApiCall.put(`video-kyc/user/${userId}`, createPayload)
                : ApiCall.post(`video-kyc/user`, createPayload);
            const response = await apiCall;
            if (response?.data?.success) {
                showSuccess(response?.data?.message);
                navigate(-1);
            } else {
                showFailure(response?.data?.message);
            }
        },
        [userId, navigate]
    );

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    <PrimaryButton
                        iconLeft="saveicon"
                        label={userId ? "Update User" : "Save User"}
                        onNotify={handleSubmit(onSubmit)}
                        disabled={btnLoading}
                    />
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, navigate]);

    return (
        <div className="p-2 bg-gray-50">
            <h1 className="text-xl font-extrabold text-gray-900 mb-4 max-[500px]:text-[15px]">
                {userId ? "Edit User" : "User Information"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className="w-full
                "
                >
                    <UserInformationCard
                        control={control}
                        errors={errors}
                        menuList={menuList}
                        setMenuList={setMenuList}
                        setValue={setValue}
                        languages={languages}
                        clearErrors={clearErrors}
                        selectedRoles={selectedValues}
                    />
                </div>
            </form>
        </div>
    );
};

export default AddEditUserFormPage;
