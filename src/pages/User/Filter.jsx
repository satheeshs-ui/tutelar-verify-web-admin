import React from "react";
import CommonSideDrawer from "../../components/ui/CommonSideDrawer";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import AntdSelect from "../../components/ui/AntdSelect";
import FilterSearch from "../../components/ui/FilterSearch";
const { RangePicker } = DatePicker;
const UserFilter = ({ ...props }) => {
    const statusData = ["active", "inactive"];
    const filterOptions = [
        { label: "Email", value: "email" },
        { label: "Name", value: "name" },
        { label: "Phone Number", value: "mobile" },
        { label: "Agent ID", value: "userId" },
    ];
    const handleStatus = (sts) => {
        props.setStatus(sts);
    };
    const handleFilterChange = (filterType) => {
        props.setSelectType(filterType);
        props.setSearch("");
    };

    const handleValueChange = (value) => {
        props.setSearch(value.trim());
    };

    return (
        <CommonSideDrawer
            open={props.filter}
            className="py-1.5  bg-[#F9FAFB] border! border-[#E6E7E8] rounded-2xl cursor-pointer"
            onClose={() => props.setFilter(false)}
            title="Filters"
            width="500px"
            footer={
                <>
                    <div className="w-full flex justify-end mt-4">
                        <div className="flex gap-2">
                            <SecondaryButton
                                label="Reset"
                                onNotify={() => {
                                    props.handleReset();
                                }}
                            />
                            <PrimaryButton
                                label="Apply"
                                onNotify={() => {
                                    props.handleSubmit();
                                    props.setFilter(false);
                                }}
                            />
                        </div>
                    </div>
                </>
            }
        >
            <div>
                <div className="mb-4">
                    <FilterSearch
                        onFilterChange={handleFilterChange}
                        onValueChange={handleValueChange}
                        filterOptions={filterOptions}
                        reset={props.clear}
                        setClear={props.setClear}
                        value={props.search}
                        selectedFilter={props.selectType}
                    />
                </div>
                <div>
                    <p className="text-[#2C3436] text-[14px] font-normal">Date Range</p>
                    <RangePicker
                        className="custom-date-picker w-full"
                        value={props.dateRange}
                        format={"YYYY-MM-DD"}
                        disabledDate={(current) => current && current > dayjs().endOf("day")}
                        onChange={(dates) => {
                            // setDateRange({
                            //     startDate: dateStrings?.[0] || null,
                            //     endDate: dateStrings?.[1] || null,
                            // });
                            props.setDateRange(dates);
                        }}
                    />
                </div>
                <div className="mt-4">
                    <p className="text-[#2C3436] text-[14px] font-normal">Role Name</p>
                    <AntdSelect
                        isMandatory={false}
                        placeholder="Select Role Name"
                        options={[
                            // { value: "agent", label: "Agent" },
                            { value: "checker", label: "Checker" },
                            { value: "auditor", label: "Auditor" },
                        ]}
                        labelCss="text-[#40444C] text-[14px] font-medium"
                        suffixIcon={"dropdownArrowIcon"}
                        sufixCls="w-3 h-3"
                        onChange={(value) => {
                            props.setRole(value);
                        }}
                        value={props.role || undefined}
                    />
                </div>

                <div className="mt-4">
                    <p className="text-[#2C3436] text-[14px] font-normal">Status</p>
                    <div className="flex gap-3">
                        {statusData?.map((sts, s) => (
                            <div
                                key={s}
                                className={`${props.status === sts ? "py-[9px] px-[18px] bg-primary text-white" : "border border-[#CDD0D1] py-[9px] px-[18px]"} capitalize rounded-3xl cursor-pointer`}
                                onClick={() => handleStatus(sts)}
                            >
                                {sts}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CommonSideDrawer>
    );
};

export default UserFilter;
