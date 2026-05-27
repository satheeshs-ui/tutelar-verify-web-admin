import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UniversalTable from "../../components/ui/Table/UniversalTable";
import ImageLoader from "../../components/ui/ImageLoader";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import CommonFilter from "../../components/ui/Filter";

import { shouldShowPagination } from "../../utils";
import Pagination from "../../components/ui/Table/Pagination";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import AntdSelect from "../../components/ui/AntdSelect";
import { Button, Select } from "antd";
import { useHeaderStore } from "../../store/Header/useHeaderStore";
import useRoleStore from "../../store/Role/useRoleStore";
import CommonStatusSelect from "../../components/ui/CommonStatusSelect";

const RolesPage = () => {
  const navigate = useNavigate();
  const statusData = ["active", "inactive"];
  const { setHeader, clearHeader } = useHeaderStore();

  const [page] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [clear, setClear] = useState(false);
  const [rolecode, setRoleCode] = useState("");
  const { roleList, getRoleList, isLoading, setLoading } = useRoleStore();
  const statusOptions = [
    {
      label: "Active",
      value: "active",
      color: "bg-green-500",
    },
    {
      label: "Inactive",
      value: "inactive",
      color: "bg-red-500",
    },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);

    try {
      await getRoleList({
        roleName: role || undefined,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/roles/roles-list/create-role");
  };

  const handleEdit = (id) => {
    navigate(`/roles/roles-list/edit-role/${id}`);
  };

  const handleStatus = (sts) => {
    setStatus(sts);
  };

  const handleReset = () => {
    setStatus("");
    setRole("");
    setRoleCode("");
    setClear(true);

    fetchRoles();
  };
  // filter dropdown

  const roleNameOption = [
    ...new Map(
      roleList.map((item) => [
        item.roleName,
        { value: item.roleName, label: item.roleName },
      ]),
    ).values(),
  ];
  const roleCodeOption = [
    ...new Map(
      roleList.map((item) => [
        item.roleCode,
        { value: item.roleCode, label: item.roleCode },
      ]),
    ).values(),
  ];

  useEffect(() => {
    setHeader({
      title: "",
      actions: (
        <div className="flex items-center gap-3">
          {/* <div class="flex gap-2 p-3 bg-[#F9FAFB] border border-[#E6E7E8] rounded-[8px]">
                        {searchIcon}
                        <input
                            type="text"
                            placeholder="Search by name"
                            class="font-normal text-[#6A7174] text-[14px]"
                            value={agentSearch}
                            onChange={(e) => setAgentSearch(e.target.value)}
                        />
                    </div> */}
          {/* filter */}
          <div>
            <CommonFilter
              onApply={fetchRoles}
              onReset={handleReset}
              reset={clear}
              setClear={setClear}
            >
              <div className="flex flex-col">
                <div className="mt-0">
                  <p className="text-[#2C3436] text-[14px] font-normal">
                    Role Name
                  </p>
                  <AntdSelect
                    isMandatory={false}
                    placeholder="Select Role Name"
                    options={roleNameOption}
                    labelCss="text-[#40444C] text-[14px] font-medium"
                    suffixIcon={"dropdownArrowIcon"}
                    sufixCls="w-3 h-3"
                    onChange={(value) => {
                      setRole(value);
                    }}
                    value={role || undefined}
                  />
                </div>

                <div className="mt-4">
                  <p className="text-[#2C3436] text-[14px] font-normal">
                    Role Code
                  </p>
                  <AntdSelect
                    isMandatory={false}
                    placeholder="Select Role Code"
                    options={roleCodeOption}
                    labelCss="text-[#40444C] text-[14px] font-medium"
                    suffixIcon={"dropdownArrowIcon"}
                    sufixCls="w-3 h-3"
                    onChange={(value) => {
                      setRoleCode(value);
                    }}
                    value={rolecode || undefined}
                  />
                </div>

                <div className="mt-4">
                  <p className="text-[#2C3436] text-[14px] font-normal">
                    Status
                  </p>
                  <div className="flex gap-3 mt-2">
                    {statusData?.map((sts, s) => (
                      <div
                        key={s}
                        className={`${status === sts ? "py-[9px] px-[18px] bg-primary text-white" : "border border-[#CDD0D1] py-[9px] px-[18px]"} capitalize rounded-3xl cursor-pointer`}
                        onClick={() => handleStatus(sts)}
                      >
                        {sts}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CommonFilter>
          </div>

          <div>
            {/* {permission?.write && ( */}

            {/* )}  */}
            <PrimaryButton
              label={"Create Role"}
              onNotify={handleClick}
              iconLeft={"CreateIcon"}
            />
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, [clearHeader, setHeader, isLoading, status]);

  const handleStatusChange = (user, value) => {
    if (!user?.userId) {
      return;
    }

    console.log(value);

    // updateUser(user.userId, { status: value }, (res) => {
    //   if (res) {
    //     getUserList(params);
    //   }
    // });
  };
  return (
    <div className="px-3">
      {/*  Header */}

      {/* table */}
      {isLoading ? (
        <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
      ) : (
        <div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-9">
                        <div className="p-4 rounded-xl border border-[#CDD0D1] bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <ImageLoader imageKey="TotalRoleIcon" />
                                </div>
                                <div>
                                    <span className="flex items-center gap-1">
                                        <ImageLoader imageKey="percentageup" />
                                        <span className="text-[12px] text-[#17B26A] font-[500]">
                                            0%
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <p className="text-[24px] text-[#16262B] font-[700] py-2">
                                0
                            </p>
                            <p className="text-[14px] text-[#818A8C]">Total Role</p>
                        </div>

                        <div className="p-4 rounded-xl border border-[#CDD0D1] bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <ImageLoader imageKey="RoleactiveIcon" />
                                </div>
                                <div>
                                    <span className="flex items-center gap-1">
                                        <ImageLoader imageKey="percentageup" />
                                        <span className="text-[12px] text-[#17B26A] font-[500]">
                                            0%
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <p className="text-[24px] text-[#16262B] font-[700] py-2">
                                0
                            </p>
                            <p className="text-[14px] text-[#818A8C]">Active Role</p>
                        </div>

                        <div className="p-4 rounded-xl border border-[#CDD0D1] bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <ImageLoader imageKey="RoleInactiveIcon" />
                                </div>
                                <div>
                                    <span className="flex items-center gap-1">
                                        <ImageLoader imageKey="percentageup" />
                                        <span className="text-[12px] text-[#17B26A] font-[500]">
                                            0%
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <p className="text-[24px] text-[#16262B] font-[700] py-2">
                               0
                            </p>
                            <p className="text-[14px] text-[#818A8C]">Inactive Role</p>
                        </div>

                        <div className="p-4 rounded-xl border border-[#CDD0D1] bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <ImageLoader imageKey="RolePermissionIcon" />
                                </div>
                                <div>
                                    <span className="flex items-center gap-1">
                                        <ImageLoader imageKey="percentageup" />
                                        <span className="text-[12px] text-[#17B26A] font-[500]">
                                            0%
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <p className="text-[24px] text-[#16262B] font-[700] py-2">
                                0
                            </p>
                            <p className="text-[14px] text-[#818A8C]">Permissions</p>
                        </div>
                    </div> */}
          <UniversalTable
            rowKey="id"
            nodatamessage="Oops! There’s nothing here"
            describemessage="There is nothing here to view right now, please add new Role & Permission to get started."
            data={roleList}
            columns={[
              {
                title: "Role Name",
                render: (record) => <p>{record.roleName}</p>,
              },
              {
                title: "Role Code",
                render: (record) => <p>{record.roleCode}</p>,
              },
              {
                title: "Role Type",
                render: (record) => <p>{record.roleCode}</p>,
              },
              {
                title: "No. of Menus",
                render: (record) => <p>{record.roleId}</p>,
              },

              //   {
              //     title: "Users Count",
              //     render: (record) => <p>{record.usersCount || 0}</p>,
              //   },
              {
                title: "Created At",
                render: (record) => (
                  <p>
                    {record.createdAt
                      ? new Date(record.createdAt).toLocaleString()
                      : "-"}
                  </p>
                ),
              },
              {
                title: "Role Status",
                render: (u) => {
                  return (
                    <div>
                      
                      <CommonStatusSelect
                        value={u.status}
                        options={statusOptions}
                        onChange={(value) => handleStatusChange(u, value)}
                      />
                    </div>
                  );
                },
                width: 100,
              },
              {
                title: "Actions",
                render: (record) => (
                  <div
                    onClick={() => handleEdit(record.roleId)}
                    className="cursor-pointer"
                  >
                    <ImageLoader imageKey="EditIcons" />
                  </div>
                ),
              },
            ]}
            maxHeight="calc(100vh - 280px)"
          />
        </div>
      )}

      {shouldShowPagination && (
        <div className="mt-4">
          <Pagination
            state={[]}
            currentPage={page}
            // totalPages={totalPages}
            rowsPerPage={limit}
            // setCurrentPage={setPage}
            setRowsPerPage={setLimit}
            // totalRecords={agentListData?.total}
          />
        </div>
      )}
    </div>
  );
};

export default RolesPage;
