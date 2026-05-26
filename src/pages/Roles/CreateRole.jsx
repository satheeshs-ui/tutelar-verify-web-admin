import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageLoader from "../../components/ui/ImageLoader";
import { roleSchema } from "./Validation/RoleSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AntdInput from "../../components/ui/AntdInput";
import { Check } from "lucide-react";
import { useHeaderStore } from "../../store/Header/useHeaderStore";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { useAppStore } from "../../store/app.store";
import { MENU_ICON_MAP } from "../../utils";
import useRoleStore from "../../store/Role/useRoleStore";
import { formattedDateTime } from "../../utils";
import { useRef } from "react";

const CreateRolePage = () => {
    const { createRole, getRoleDetails, roleDetails, updateRole } = useRoleStore();

    const { userDetails } = useAppStore();

    const [loading] = useState(false);
    const navigate = useNavigate();

    const selectedMenusRef = useRef({});
    const writeMenusRef = useRef({});
    const [selectedMenus, setSelectedMenus] = useState({});
    const [writeSelectedMenus, setWriteSelectedMenus] = useState({});
    const { roleId } = useParams();
    const isEdit = roleId && roleId !== "new";
    const { setHeader, clearHeader } = useHeaderStore();
    const [enableAllRead, setEnableAllRead] = useState(false);

    const getKey = (child) => String(child.id || child.menuId);

    const dynamicMenus = useMemo(() => {
        if (isEdit && roleDetails?.menuPermission) {
            return roleDetails.menuPermission;
        }

        return [...(userDetails?.menuPermissions || [])].sort((a, b) => a.sortOrder - b.sortOrder);
    }, [userDetails?.menuPermissions, roleDetails, isEdit]);

    const toggleRead = (menuKey) => {
        setSelectedMenus((prev) => {
            const updated = {
                ...prev,
                [menuKey]: !prev[menuKey],
            };
            selectedMenusRef.current = updated;
            return updated;
        });
    };

    const toggleWrite = (menuKey) => {
        setWriteSelectedMenus((prev) => {
            const updated = {
                ...prev,
                [menuKey]: !prev[menuKey],
            };
            writeMenusRef.current = updated;
            return updated;
        });
    };

    const handleEnableAllRead = (checked) => {
        const updated = {};

        dynamicMenus.forEach((menu) => {
            (menu.childMenus || []).forEach((child) => {
                const key = getKey(child);
                updated[key] = checked;
            });
        });

        setSelectedMenus(updated);
        selectedMenusRef.current = updated;
    };

    const buildMenuPermission = () => {
        return dynamicMenus.map((menu) => ({
            menuId: menu.id || menu.menuId,
            menuName: menu.menuName,
            menuIcon: menu.menuIcon,
            webPathUrl: menu.webPathUrl,
            sortOrder: menu.sortOrder,

            childMenus: (menu.childMenus || []).map((child) => {
                const key = getKey(child);

                const readState = selectedMenusRef.current[key];
                const writeState = writeMenusRef.current[key];

                return {
                    id: key,
                    menuName: child.menuName,
                    menuIcon: child.menuIcon,
                    webPathUrl: child.webPathUrl,
                    sortOrder: child.sortOrder,
                    status: "active",

                    permissions: {
                        read: !!readState,
                        write: !!writeState,
                    },
                    aclPermissions: {
                        read: !!readState,
                        write: !!writeState,
                    },
                };
            }),
        }));
    };

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            rolename: "",
            rolecode: "",
        },
    });

    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    <div className="flex gap-3">
                        <SecondaryButton
                            iconLeft="cancelIcon"
                            label="Cancel"
                            onNotify={() => navigate(-1)}
                        />
                        <PrimaryButton
                            iconLeft="saveicon"
                            label={roleId ? "Update" : "Save"}
                            onNotify={handleSubmit(onSubmit)}
                            disabled={loading}
                        />
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, navigate]);

    const { readCount, writeCount, totalCount } = useMemo(() => {
        let read = 0;
        let write = 0;

        Object.keys(selectedMenus).forEach((key) => {
            if (selectedMenus[key]) read++;
        });

        Object.keys(writeSelectedMenus).forEach((key) => {
            if (writeSelectedMenus[key]) write++;
        });
        return {
            readCount: read,
            writeCount: write,
            totalCount: read + write,
        };
    }, [selectedMenus, writeSelectedMenus]);

    const totalMenus = dynamicMenus.reduce((acc, menu) => acc + (menu.childMenus?.length || 0), 0);

    const totalSelected = readCount + writeCount;

    const percentage = totalMenus ? Math.round((totalSelected / (totalMenus * 2)) * 100) : 0;

    useEffect(() => {
        if (isEdit && roleId) {
            getRoleDetails(roleId);
        }
    }, [roleId, isEdit, getRoleDetails]);

    useEffect(() => {
        if (isEdit && roleDetails?.menuPermission) {
            setValue("rolename", roleDetails.roleName);
            setValue("rolecode", roleDetails.roleCode);

            const readObj = {};
            const writeObj = {};

            (roleDetails.menuPermission || []).forEach((menu) => {
                (menu.childMenus || []).forEach((child) => {
                    const key = getKey(child);
                    const perm = child.permissions || child.aclPermissions || {};

                    if (perm.read) {
                        readObj[key] = true;
                    }

                    if (perm.write) {
                        writeObj[key] = true;
                    }
                });
            });

            setSelectedMenus(readObj);
            setWriteSelectedMenus(writeObj);

            selectedMenusRef.current = readObj;
            writeMenusRef.current = writeObj;
        }
    }, [roleDetails]);

    const onSubmit = (data) => {
        const payload = {
            roleId: roleDetails?.roleId,
            roleName: data.rolename,
            roleCode: data.rolecode,
            status: "active",
            menuPermission: buildMenuPermission(),
        };

        if (isEdit) {
            updateRole(roleId, payload, () => {
                navigate(-1);
            });
        } else {
            createRole(payload, () => {
                navigate(-1);
            });
        }
    };

    const searchIcon = useMemo(() => <ImageLoader imageKey="SearchIcons" />, []);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
                <div>
                    {!isEdit && (
                        <div className="border border-[#CDD0D1] rounded-xl p-5">
                            <div className="flex flex-wrap gap-10">
                                <div className="w-[445px]">
                                    <Controller
                                        name="rolename"
                                        control={control}
                                        render={({ field }) => (
                                            <AntdInput
                                                {...field}
                                                label="Role Name"
                                                placeholder="Enter Role name"
                                                error={errors.rolename?.message}
                                                onValueChange={(data) => field.onChange(data.value)}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="w-[445px]">
                                    <Controller
                                        name="rolecode"
                                        control={control}
                                        render={({ field }) => (
                                            <AntdInput
                                                {...field}
                                                label="Role Code"
                                                placeholder="Enter Role Code"
                                                error={errors.rolecode?.message}
                                                onValueChange={(data) => field.onChange(data.value)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {isEdit && (
                        <div className="border border-[#CDD0D1] rounded-xl p-5">
                            <div className="flex flex-wrap justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <ImageLoader imageKey="EditRoleIcons" />
                                        </div>
                                        <div>
                                            <p className="capitalize text-[#0B1C20] text-[22px] max-[500px]:text-[16px]">
                                                {roleDetails?.roleName}
                                            </p>
                                            <p className="text-[#6A7174] text-[16px] max-[500px]:text-[12px]">
                                                {roleDetails?.roleCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex gap-2 max-[500px]:text-[13px] max-[500px]:mt-3">
                                        <p className="text-[#2C3436]">Status:</p>
                                        <p>Active</p>
                                    </div>
                                    <div className="flex items-start gap-2 text-[#2C3436] text-[14px]">
                                        <ImageLoader imageKey="CaseActivityIcon" />
                                        <p>Created: {formattedDateTime(roleDetails?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap justify-between border border-[#E6E7E8] bg-[#F9FAFB] p-4 rounded-xl my-7">
                        <div className="flex gap-3">
                            <div>
                                <ImageLoader imageKey="MenuHeaderIcon" />
                            </div>
                            <div className="text-[#0B1C20] text-[18px] max-[500px]:text-[15px] font-medium">
                                Menu Permissions
                                <p className="text-[#6A7174] text-[14px] max-[500px]:text-[11px] font-normal">
                                    Configure access levels for each menu
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-2">
                                <div class="flex gap-2 p-3 bg-[#F9FAFB] border border-[#E6E7E8] rounded-lg max-[500px]:mt-3">
                                    {searchIcon}
                                    <input
                                        type="text"
                                        placeholder="Search menus"
                                        class="font-normal text-[#6A7174] text-[14px] overall-input-box"
                                    />
                                </div>
                                <div className="p-3 bg-[#F9FAFB] border border-[#E6E7E8] rounded-lg">
                                    <label className="flex items-center gap-3 text-[#818A8C] text-sm">
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer"
                                            checked={enableAllRead}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setEnableAllRead(checked);
                                                handleEnableAllRead(checked);
                                            }}
                                        />
                                        Enable All Read
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="w-full">
                            {dynamicMenus.map((menu) => {
                                const iconConfig = MENU_ICON_MAP[menu.menuName] || {};
                                const iconKey = iconConfig.inactive;

                                return (
                                    <div key={menu.menuId}>
                                        {(menu.childMenus || []).map((child) => {
                                            const key = getKey(child);

                                            const read = selectedMenus[key] ? 1 : 0;
                                            const write = writeSelectedMenus[key] ? 1 : 0;
                                            const totalEnabled = read + write;
                                            const total = 2;

                                            return (
                                                <div
                                                    key={key}
                                                    className="flex flex-wrap justify-between items-center border-b border-[#E6E7E8] py-3"
                                                >
                                                    <div className="flex gap-2 items-start">
                                                        <ImageLoader
                                                            imageKey={iconKey}
                                                            className="w-5 h-5 transition-transform duration-200"
                                                        />

                                                        <div>
                                                            <p className="text-[#0B1C20] text-[16px] max-[500px]:text-[13px]">
                                                                {child.menuName}
                                                            </p>
                                                            <p className="text-[#818A8C] text-[12px] pt-1">
                                                                {totalEnabled} of {total} enabled
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 items-center">
                                                        <label className="flex overall-table-text gap-2 bg-[#F9FAFB] rounded-[10px] p-3 items-center text-[#2C3436] text-[14px]">
                                                            <div
                                                                className={`w-4 h-4 rounded-full border border-[#E6E7E8] cursor-pointer ${
                                                                    selectedMenus[key]
                                                                        ? "bg-[#18667C]"
                                                                        : "bg-[#fff]"
                                                                }`}
                                                                onClick={() => toggleRead(key)}
                                                            >
                                                                {selectedMenus[key] && (
                                                                    <div className="flex justify-center items-center mt-0.5">
                                                                        <Check className="w-3 h-3 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>Read Only</div>
                                                        </label>

                                                        <label className="flex overall-table-text gap-2 bg-[#F9FAFB] rounded-[10px] p-3 items-center text-[#2C3436] text-[14px]">
                                                            <div
                                                                className={`w-4 h-4 rounded-full border border-[#E6E7E8] cursor-pointer ${
                                                                    writeSelectedMenus[key]
                                                                        ? "bg-[#18667C]"
                                                                        : "bg-[#fff]"
                                                                }`}
                                                                onClick={() => toggleWrite(key)}
                                                            >
                                                                {writeSelectedMenus[key] && (
                                                                    <div className="flex justify-center items-center mt-0.5">
                                                                        <Check className="w-3 h-3 text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>Read and Write</div>
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="rounded-xl bg-[#E9F0F2] p-5 w-[300px] h-max max-[500px]:w-auto">
                        <div className="flex gap-2">
                            <ImageLoader imageKey="RoleSummaryIcon" />
                            <span className="text-[#0F172B] text-[16px] font-medium max-[500px]:text-[13px]">
                                Summary
                            </span>
                        </div>

                        <div className="bg-[#FFFFFFB2] rounded-[14px] p-4 mt-5">
                            <div className="flex gap-2">
                                <ImageLoader imageKey="RoleReadIcon" />
                                <span className="text-[#6A7174] text-[12px] font-normal">
                                    Read Only
                                </span>
                            </div>
                            <p className="text-[#0F172B] font-medium text-[25px] py-1">
                                {readCount}
                            </p>
                            <p className="text-[#818A8C] text-[12px]">Permissions granted</p>
                        </div>

                        <div className="bg-[#FFFFFFB2] rounded-[14px] p-4 mt-4">
                            <div className="flex gap-2">
                                <ImageLoader imageKey="RoleWriteIcon" />
                                <span className="text-[#6A7174] text-[12px] font-normal">
                                    Read & Write
                                </span>
                            </div>
                            <p className="text-[#0F172B] font-medium text-[25px] py-1">
                                {writeCount}
                            </p>
                            <p className="text-[#818A8C] text-[12px]">Permissions granted</p>
                        </div>

                        <div className="bg-[#FFFFFFB2] rounded-[14px] p-4 mt-4">
                            <div className="flex gap-2">
                                <ImageLoader imageKey="RoleAccessIcon" />
                                <span className="text-[#6A7174] text-[12px] font-normal">
                                    Total Access
                                </span>
                            </div>
                            <p className="text-[#0F172B] font-medium text-[25px] py-1">
                                {totalCount}
                            </p>
                            <p className="text-[#818A8C] text-[12px]">Permissions granted</p>
                        </div>

                        <div className="flex justify-center mt-5">
                            <ImageLoader imageKey="RoleSummaryVector" />
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between">
                                <p className="text-[#45556C] text-[14px]">Configuration</p>
                                <p className="text-[#18667C] font-medium">{percentage}%</p>
                            </div>

                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#18667C] rounded-full"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    {isEdit && (
                        <div className="mt-6 rounded-2xl border border-[#CDD0D1] p-5">
                            <p className="text-[#0B1C20] text-[18px] max-[500px]:text-[14px] font-medium">
                                Quick Actions
                            </p>
                            <div className="flex justify-between border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-5 mt-7 max-[500px]:p-3 max-[500px]:text-[12px]">
                                <p>Enable All Read Only</p>
                                <ImageLoader imageKey="openpassword" />
                            </div>
                            <div className="flex justify-between border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] p-5 mt-4 max-[500px]:p-3 max-[500px]:text-[12px]">
                                <p>Clear All Permissions</p>
                                <ImageLoader imageKey="ClearPermissionIcon" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateRolePage;
