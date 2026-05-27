import { useEffect, useMemo, useState, useCallback } from "react";
import UniversalTable from "../../components/ui/Table/UniversalTable";
import Pagination from "../../components/ui/Table/Pagination";
import { checkValue, shouldShowPagination } from "../../utils";
import { TooltipCellOrFirstObject } from "../../components/ui/TooltipCell";
import LottieLoader from "../../components/ui/LottieUnique/LottieLoader";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import ImageLoader from "../../components/ui/ImageLoader";
import { ModalPopUp } from "../../components/ui/Modal/ModalPopUp";
import CommonPopover from "../../components/ui/CommonPopOver";
import UserFilter from "./Filter";
import useUserStore from "../../store/User/useUserStore";
import { Button, Form, Select, Tag, Tooltip } from "antd";
import { useHeaderStore } from "../../store/Header/useHeaderStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { designationSchema } from "./Validation/designationSchema";
import AntdInput from "../../components/ui/AntdInput";
import { CustomPrimaryButton } from "../../components/buttons/CustomPrimaryButton";
import CustomSecondaryButton from "../../components/buttons/CustomSecondaryButton";
import CommonStatusSelect from "../../components/ui/CommonStatusSelect";

const DesignationList = () => {
  // const { setHeaderAction } = useOutletContext();

  const navigate = useNavigate();
  const { getUserList, userList, updateUser, isLoading } = useUserStore();

  const agentListData = userList;
  const { setHeader, clearHeader } = useHeaderStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectType, setSelectType] = useState("email");
  const [status, setStatus] = useState("");
  const [appUserType, setRole] = useState("");
  const [clear, setClear] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deptDetails, setDesignationDetail] = useState(null);

  const [filter, setFilter] = useState(false);

  const [dateRange, setDateRange] = useState([null, null]);
  const totalRecords = agentListData?.total;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 0;
  const startDate = dateRange?.[0]?.format("YYYY-MM-DD");
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD");
  const [isEdit, setIsEdit] = useState(false);
  const {
    control,

    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: "",
    },
  });

  console.log(deptDetails);
  const params = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { [selectType]: search } : {}),
      ...(status && status !== "all" ? { status } : {}),
      ...(appUserType && appUserType !== "all" ? { appUserType } : {}),

      ...(startDate && endDate && { startDate, endDate }),
    }),
    [page, limit, search, status, appUserType, selectType, endDate, startDate],
  );

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

  const handleTable = useCallback(() => {
    const fetchData = async () => {
      await getUserList(params);
    };

    fetchData();
  }, [getUserList, params]);

  useEffect(() => {
    handleTable();
  }, [handleTable]);

  const handleStatusChange = (user, value) => {
    if (!user?.userId) {
      return;
    }

    updateUser(user.userId, { status: value }, (res) => {
      if (res) {
        getUserList(params);
      }
    });
  };

  const handleApply = () => {
    handleTable();
    setPage(1);
  };
  const handleReset = () => {
    setSearch("");
    setSelectType("email");
    setStatus("");
    setClear(true);
    setPage(1);
    setDateRange([null, null]);
    setRole("");
  };

  const handleClose = () => {
    setDesignationDetail(null);
    setOpenModal(false);
    setDeleteModal(false);
  };

  //   const handleSubmit = () => {
  //     console.log("submit");
  //   };

  const onSubmit = (data) => {
    console.log("Form data:", data);
    // You can perform further actions with the form data here, such as making an API call to save the department information.
  };
  const onError = (err) => {
    console.error("Validation errors:", err);
  };

  const createDesignation = () => {
    setDesignationDetail(null);
    setOpenModal(true);
    setIsEdit(false);
  };
  useEffect(() => {
    setHeader({
      title: "",
      actions: (
        <div className="flex gap-3">
          <div
            className="bg-[#F9FAFB] border border-[#E6E7E8] rounded-xl py-3 px-[15px] cursor-pointer"
            onClick={() => setFilter(true)}
          >
            <ImageLoader imageKey={"userFilter"} />
          </div>
          <div>
            <PrimaryButton
              iconLeft="userCreate"
              label="Add"
              onNotify={createDesignation}
            />
          </div>
        </div>
      ),
    });

    return () => clearHeader();
  }, [clearHeader, setHeader, navigate]);
  return (
    <>
      <div className="">
        {isLoading ? (
          <LottieLoader lottieKey="loaderIcon" playerClass="w-[80px]" />
        ) : (
          <>
            <UniversalTable
              rowKey="user_id"
              data={agentListData?.users}
              maxHeight="calc(100vh - 280px)"
              columns={[
                {
                  title: (
                    <div className="flex items-center gap-2">
                      <span>Designation Name</span>
                    </div>
                  ),
                  render: (u) => (
                    <div className="flex items-center gap-2 text-[#0B1C20]">
                      <span className="cursor-pointer">
                        {" "}
                        {checkValue(u?.userId)}
                      </span>
                    </div>
                  ),
                  width: 100,
                },
                {
                  title: (
                    <div className="flex items-center gap-1">
                      <span>Created By</span>
                    </div>
                  ),
                  dataIndex: "name",
                  width: 100,
                  render: (u) => {
                    const name = u?.name || "";
                    const truncate =
                      name.length > 16 ? name.slice(0, 16) + "..." : name;
                    return (
                      <Tooltip title={name}>
                        <span className="text-gray-900 font-normal capitalize cursor-pointer">
                          {truncate}
                        </span>
                      </Tooltip>
                    );
                  },
                },

                {
                  title: "Created At",
                  render: (u) =>
                    TooltipCellOrFirstObject({
                      device: u,
                      field: "createdAt",
                      from: "time",
                    }),

                  width: 100,
                },

                {
                  title: "Status",
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
                  title: "Action",
                  render: (u) => (
                    <div className="flex items-center gap-2">
                      <div className="">
                        <ImageLoader
                          imageKey="EditIcons"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => {
                            setDesignationDetail(u);
                            setOpenModal(true);
                            setIsEdit(true);
                          }}
                        />
                      </div>
                      <div>
                        <ImageLoader
                          imageKey="deleteiconwhite"
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setDesignationDetail(u);
                            setDeleteModal(true);
                            setIsEdit(false);
                          }}
                        />
                      </div>
                    </div>
                  ),
                  width: 100,
                },
              ]}
            />

            {shouldShowPagination(agentListData, page) && (
              <div className="mt-4">
                <Pagination
                  state={agentListData}
                  currentPage={page}
                  totalPages={totalPages}
                  rowsPerPage={limit}
                  setCurrentPage={setPage}
                  setRowsPerPage={setLimit}
                  totalRecords={agentListData?.total}
                />
              </div>
            )}
            {openModal && (
              <ModalPopUp
                isOpen={openModal}
                onClose={handleClose}
                closeBtn={false}
              >
                <div className="p-[18px]">
                  <div className="flex justify-between items-center border-b border-[#CDD0D1] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-primary-black-15 text-[18px] font-medium">
                          {isEdit
                            ? "Edit Designation Name"
                            : "Add New Designation"}
                        </div>
                      </div>
                      {isEdit && (
                        <div className="text-[#888C93] text-[12px] font-normal mt-1">
                          The Designation “Chief Technology Officer” will be
                          edited
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <Form layout="vertical">
                      <div className="grid grid-cols-1 gap-x-5 gap-y-2 space-y-3">
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <AntdInput
                              {...field}
                              label="Designation Name"
                              placeholder="Enter designation name"
                              isMandatory
                              error={errors.name?.message}
                              onValueChange={(data) =>
                                field.onChange(data.value)
                              }
                            />
                          )}
                        />
                      </div>
                    </Form>
                    <div className="flex justify-end gap-3 mt-6">
                      <div className="flex gap-3">
                        <SecondaryButton
                          iconLeft="cancelIcon"
                          label="Cancel"
                          onNotify={handleClose}
                        />
                        <PrimaryButton
                          iconLeft="saveicon"
                          label={isEdit ? "Save" : "Create"}
                          onNotify={handleSubmit(onSubmit, onError)}
                          //   disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalPopUp>
            )}

            {deleteModal && (
              <ModalPopUp
                isOpen={deleteModal}
                onClose={handleClose}
                closeBtn={false}
                customStyle={true}
              >
                <div className="p-[18px]">
                  <div className="flex justify-between items-center border-b border-[#CDD0D1] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-[#0B1C20] text-[18px] font-medium flex items-center gap-2">
                          <div className="bg-[#FEF3F2]! p-3 rounded-sm mr-2">
                            <ImageLoader imageKey={"deleteIconimage"} />
                          </div>{" "}
                          Are you sure you want to delete Designation?
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-[18px] bg-[#F9FAFB] py-3 px-[18px] rounded">
                    <p className="text-[#0B1C20]! text-[16px]! font-medium!">
                      Chief Technology Officer
                    </p>
                    <p className="text-[12px]!">
                      <span className="text-[#6A7174]!">Created By : </span>{" "}
                      <span className="text-[#0B1C20]"> Admin User</span>
                    </p>
                  </div>

                  <div className="mt-[18px]">
                    <p className="text-[#7A2E0E]! text-[14px]! flex items-center gap-3">
                      <ImageLoader
                        imageKey={"warningtriangle"}
                        className="w-4 h-4"
                      />
                      Warning
                    </p>
                    <p className="text-[12px]! text-[#F79009]! font-normal mt-3">
                      Deleting this Designation will remove all associated data
                      permanently. This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="flex-col gap-3!">
                      <CustomPrimaryButton
                        iconLeft="deleteWhitecolor"
                        label={"Yes, Delete Designation"}
                        onNotify={handleSubmit(onSubmit, onError)}
                        //   disabled={loading}
                      />
                      <div className="mt-5">
                        <CustomSecondaryButton
                          iconLeft="cancelIcon"
                          label="Cancel"
                          onNotify={handleClose}
                          customDesign={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalPopUp>
            )}
            <UserFilter
              filter={filter}
              setFilter={setFilter}
              handleSubmit={handleApply}
              handleReset={handleReset}
              search={search}
              setSearch={setSearch}
              selectType={selectType}
              setSelectType={setSelectType}
              status={status}
              setStatus={setStatus}
              role={appUserType}
              setRole={setRole}
              dateRange={dateRange}
              setDateRange={setDateRange}
              clear={clear}
              setClear={setClear}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DesignationList;
