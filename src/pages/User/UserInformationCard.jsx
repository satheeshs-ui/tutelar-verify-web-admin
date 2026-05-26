import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Form, Checkbox } from "antd";

import MenuCollpase from "./MenuCollapse";
import { useParams } from "react-router-dom";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import { showFailure } from "../../utils";
import ApiCall from "../../config/api/axiosInstance";
import AntdInput from "../../components/ui/AntdInput";
import AntdSelect from "../../components/ui/AntdSelect";
import DatePickerField from "../../components/ui/DatePickerField";

const UserInformationCard = ({
    control,
    errors,
    menuList,
    setMenuList,
    setValue,
    languages,
    clearErrors,
    selectedRoles,
}) => {
    const [roles, setRoles] = useState([]);
    const [roleMap, setRoleMap] = useState([]);

    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [selectRole, setSelectRole] = useState("");
    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);

            try {
                const response = await ApiCall.get("video-kyc/roles/client");

                if (response?.data?.success) {
                    const formatted = response?.data?.data?.rolesList
                        ?.filter((role) => role.roleName !== "Agent" && role.roleName !== "Client")
                        .map((role) => ({
                            value: role.roleId,
                            label: role.roleName,
                        }));
                    const roleMap = response?.data?.data?.rolesList?.reduce((acc, role) => {
                        acc[role.roleId] = role;
                        return acc;
                    }, {});
                    setRoles(formatted);
                    setRoleMap(roleMap);

                    if (!userId && formatted.length > 0) {
                        setValue("roleId", formatted[0].value);
                        setValue("role", formatted[0].roleName);
                        setValue("appUserType", formatted[0].appUserType);
                    }
                } else {
                    showFailure(response?.message || "Failed to fetch roles");
                }
            } catch (error) {
                console.error("Roles API Error:", error);
                showFailure("Failed to fetch roles");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [userId, setValue]);

    const onParentToggle = (pIndex, checked) => {
        const updated = [...menuList];

        updated[pIndex].enabled = checked;
        updated[pIndex].childMenu = updated[pIndex].childMenu.map((child) => ({
            ...child,
            enabled: checked,
            access: "readWrite",
        }));

        setMenuList(updated);
    };

    const onChildToggle = (pIndex, cIndex, checked) => {
        const updated = [...menuList];

        updated[pIndex].childMenu[cIndex].enabled = checked;

        const anyChildEnabled = updated[pIndex].childMenu.some((child) => child.enabled);

        updated[pIndex].enabled = anyChildEnabled;

        setMenuList(updated);
    };

    const onAccessChange = (pIndex, cIndex, value) => {
        const updated = [...menuList];
        updated[pIndex].childMenu[cIndex].access = value;
        setMenuList(updated);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <AntdInput
                                    label="First Name"
                                    isMandatory
                                    value={field.value || ""}
                                    placeholder="Enter first name"
                                    error={errors.name?.message}
                                    onValueChange={(data) => field.onChange(data.value)}
                                />
                            )}
                        />

                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <AntdInput
                                    label="Email ID"
                                    isMandatory
                                    value={field.value || ""}
                                    placeholder="Enter email address"
                                    error={errors.email?.message}
                                    disabled={userId}
                                    onValueChange={(data) => {
                                        if (!userId) {
                                            field.onChange(
                                                data?.value ? data.value.toLowerCase().trim() : ""
                                            );
                                        }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="dateOfJoining"
                            control={control}
                            render={({ field }) => (
                                <DatePickerField
                                    label="Date Of Joining"
                                    placeholder="DD/MM/YYY"
                                    suffixIcon={"DatePickericon"}
                                    value={field.value}
                                    dobDate={true}
                                    onValueChange={(date) => {
                                        field.onChange(date);
                                        // handleDateChange(date, "dob");
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="employeeId"
                            control={control}
                            render={({ field }) => (
                                <AntdInput
                                    label="Employee ID"
                                    // isMandatory
                                    value={field.value || ""}
                                    placeholder="Enter employee ID"
                                    onValueChange={(data) => field.onChange(data?.value)}
                                />
                            )}
                        />
                        <Controller
                            name="mobile"
                            control={control}
                            render={({ field }) => (
                                <AntdInput
                                    label="Phone Number"
                                    isMandatory
                                    maxLength={10}
                                    value={field.value || ""}
                                    placeholder="Enter phone number"
                                    error={errors.mobile?.message}
                                    onValueChange={(data) =>
                                        field.onChange(data.value.replace(/\D/g, ""))
                                    }
                                />
                            )}
                        />

                        <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                                <AntdSelect
                                    label="Designation"
                                    isMandatory={false}
                                    value={field.value || ""}
                                    placeholder="Select designation"
                                    options={[
                                        { value: "Analysts", label: "Analysts" },
                                        { value: "Senior Analysts", label: "Senior Analysts" },
                                        {
                                            value: "Manager - Key Accounts",
                                            label: "Manager - Key Accounts",
                                        },
                                        {
                                            value: "Executive - Operations",
                                            label: "Executive - Operations",
                                        },
                                    ]}
                                    suffixIcon={"dropdownArrowIcon"}
                                    sufixCls="w-3 h-3"
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="department"
                            control={control}
                            render={({ field }) => (
                                <AntdSelect
                                    label="Department"
                                    isMandatory={false}
                                    placeholder="Select department"
                                    value={field.value || ""}
                                    options={[
                                        { value: "Admin", label: "Admin" },
                                        { value: "Sales", label: "Sales" },
                                        {
                                            value: "Finance",
                                            label: "Finance",
                                        },
                                        {
                                            value: "Product Team",
                                            label: "Product Team",
                                        },
                                    ]}
                                    labelCss="text-[#40444C] text-[14px] font-medium"
                                    suffixIcon={"dropdownArrowIcon"}
                                    sufixCls="w-3 h-3"
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    // onChange={(value) => {
                                    //     // setRole(value);
                                    // }}
                                    // value={role || undefined}
                                />
                            )}
                        />
                        <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                                <AntdSelect
                                    label="Role"
                                    placeholder="Select role"
                                    isMandatory
                                    disabled={userId}
                                    options={roles}
                                    value={field.value || undefined}
                                    error={errors.roleId?.message}
                                    onChange={(value) => {
                                        field.onChange(value);

                                        const selected = roleMap[value];

                                        if (selected) {
                                            setValue("role", selected.roleName);
                                            setValue("appUserType", selected.appUserType);
                                            setSelectRole(selected.roleName);
                                            setValue("languages", []);
                                            clearErrors("languages");
                                        }
                                    }}
                                />
                            )}
                        />

                        {(selectedRoles === "agent" || selectRole === "Agent") && (
                            <>
                                <Controller
                                    name="languages"
                                    control={control}
                                    render={({ field }) => (
                                        <AntdSelect
                                            label="Languages"
                                            mode="multiple"
                                            placeholder="Select languages"
                                            labelCss="text-[#40444C] text-[14px] font-medium"
                                            isMandatory
                                            options={languages}
                                            value={field.value || []}
                                            onChange={(value) => field.onChange(value)}
                                            error={errors.languages?.message}
                                            optionRender={(option) => (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={field.value?.includes(
                                                            option.value
                                                        )}
                                                    />
                                                    <span>{option.label}</span>
                                                </div>
                                            )}
                                        />
                                    )}
                                />

                                <Controller
                                    name="is_sign_language"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-2 mt-2">
                                            <Checkbox
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            >
                                                Sign Language
                                            </Checkbox>
                                        </div>
                                    )}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {menuList?.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E5E7EB]">
                    <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-xl flex justify-between items-center">
                        <div>
                            <h1 className="text-[15px] font-semibold text-[#111928]">
                                Create Permissions
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">
                                Select modules and configure access levels
                            </p>
                        </div>
                    </div>

                    <div className="px-4 py-3 max-h-[450px] overflow-y-auto">
                        <MenuCollpase
                            menuList={menuList}
                            state={{ collapseLoader: false }}
                            onParentToggle={onParentToggle}
                            onChildToggle={onChildToggle}
                            onAccessChange={onAccessChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInformationCard;
