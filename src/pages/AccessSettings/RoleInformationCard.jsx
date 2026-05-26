import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Form } from "antd";

import { useParams } from "react-router-dom";
import RoleMenuCollapse from "./RoleMenuCollapse";
import { showFailure } from "../../utils";
import { Input as AntdInput } from "antd";
import { Select as AntdSelect } from "antd";
import api from "../../config/api/axiosInstance";

const RoleInformationCard = ({ control, errors, menuList, setMenuList, setValue }) => {
    const [roles, setRoles] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await api.get("video-kyc/roles/client");

                if (response?.data?.success) {
                    const formatted = response?.data?.data?.rolesList?.map((role) => ({
                        value: role.roleId,
                        label: role.roleName,
                        roleName: role.roleName,
                    }));

                    setRoles(formatted || []);

                    if (!userId && formatted?.length > 0) {
                        setValue("roleId", formatted[0].value);
                    }
                } else {
                    showFailure(response?.message);
                }
            } catch (error) {
                console.error("Roles API Error:", error);
                showFailure("Failed to fetch roles");
            }
        };

        fetchRoles();
    }, []);

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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-xl">
                    <h1 className="text-[15px] font-semibold text-[#111928]">Role Information</h1>
                    <p className="text-[12px] text-[#4A5565] m-0!"> Enter role basic details</p>
                </div>

                <div className="px-5 py-4">
                    <Form layout="vertical">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        label="Name"
                                        isMandatory
                                        value={field.value || ""}
                                        placeholder="Enter name"
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
                                        label="Email"
                                        isMandatory
                                        value={field.value || ""}
                                        placeholder="Enter email address"
                                        error={errors.email?.message}
                                        onValueChange={(data) => field.onChange(data.value.trim())}
                                    />
                                )}
                            />

                            <Controller
                                name="mobile"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        label="Mobile"
                                        isMandatory
                                        value={field.value || ""}
                                        placeholder="Enter mobile number"
                                        error={errors.mobile?.message}
                                        onValueChange={(data) =>
                                            field.onChange(data.value.replace(/\D/g, ""))
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="roleId"
                                control={control}
                                render={({ field }) => (
                                    <AntdSelect
                                        label="Role Type"
                                        placeholder="Select role type"
                                        isMandatory
                                        disabled={userId}
                                        options={roles}
                                        value={field.value || undefined}
                                        error={errors.roleId?.message}
                                        onChange={(value) => {
                                            field.onChange(value);

                                            const selected = roles.find((r) => r.value === value);

                                            if (selected) {
                                                setValue("role", selected.roleName);
                                                setValue("appUserType", selected.appUserType);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </Form>
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
                        <RoleMenuCollapse
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

export default RoleInformationCard;
