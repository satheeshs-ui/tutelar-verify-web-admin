import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Checkbox } from "antd";
import { Select } from "antd";
import { useParams } from "react-router-dom";
import AntdInput from "../../components/ui/AntdInput";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import AntdSelect from "../../components/ui/AntdSelect";
import DatePickerField from "../../components/ui/DatePickerField";

const AgentInformationCard = ({
    control,
    errors,
    languages,
    agentShiftList,
    watch,
    agentData,
    hasMore,
    loadingMore,
    page,
    setPage,
    api,
}) => {
    const { agentId } = useParams();
    const [agent, setAgent] = useState(agentShiftList[0] || null);
    const shiftTime = watch("shiftId");
    useEffect(() => {
        if (shiftTime) {
            const res = agentShiftList?.find((agent) => agent?.value === shiftTime);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAgent(res);
        }
    }, [shiftTime, agent, agentData, agentShiftList]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
                <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-xl">
                    <h1 className="text-[15px] overall-table-text font-semibold text-[#111928]">
                        Agent Information
                    </h1>
                </div>

                <div className="px-5 py-4">
                    <div className="grid grid-cols-1! sm:grid-cols-3! gap-4 w-full auto-cols-fr">
                        <div>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        customstyle="common-input"
                                        label="Name"
                                        isMandatory
                                        value={field.value || ""}
                                        placeholder="Enter Name"
                                        error={errors.name?.message}
                                        onValueChange={(data) => field.onChange(data.value)}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        customstyle="common-input"
                                        label="Email ID"
                                        isMandatory
                                        value={field.value || ""}
                                        placeholder="Enter Email ID"
                                        error={errors.email?.message}
                                        disabled={agentId ? true : false}
                                        onValueChange={(data) => {
                                            if (!agentId) {
                                                field.onChange(
                                                    data?.value
                                                        ? data.value.toLowerCase().trim()
                                                        : ""
                                                );
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Controller
                                name="mobile"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        customstyle="common-input"
                                        label="Mobile"
                                        isMandatory
                                        maxLength={10}
                                        value={field.value || ""}
                                        placeholder="Enter Mobile Number"
                                        error={errors.mobile?.message}
                                        onValueChange={(data) =>
                                            field.onChange(data.value.replace(/\D/g, ""))
                                        }
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                name="employeeId"
                                control={control}
                                render={({ field }) => (
                                    <AntdInput
                                        customstyle="common-input"
                                        label="Employee ID"
                                        value={field.value || ""}
                                        placeholder="Enter Employee ID"
                                        error={errors.employeeId?.message}
                                        onValueChange={(data) => field.onChange(data.value)}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Controller
                                name="doj"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <DatePickerField
                                            label="Date of Joining"
                                            placeholder="Select date of joing"
                                            suffixIcon="DatePickericon"
                                            dobDate={true}
                                            value={field.value ?? null}
                                            onValueChange={(date) => {
                                                field.onChange(date);
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* <div>
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <AntdSelect
                                        label="State"
                                        placeholder="Select State"
                                        value={field.value || undefined}
                                        options={[]}
                                        error={errors.state?.message}
                                        onChange={(val) => field.onChange(val)}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                )}
                            />
                        </div> */}

                        <div>
                            <Controller
                                name="languages"
                                control={control}
                                render={({ field }) => (
                                    <AntdSelect
                                        label="Language"
                                        mode="multiple"
                                        value={field.value}
                                        options={languages}
                                        isMandatory
                                        error={errors?.languages?.message}
                                        placeholder="Select languages"
                                        optionLabelProp="label"
                                        maxTagCount="responsive"
                                        optionRender={(option) => (
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={field.value?.includes(option.value)}
                                                />
                                                <span>{option.label}</span>
                                            </div>
                                        )}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[14px] font-medium text-[#0B1C20] mt-5">
                            Agent Shift Timing
                        </label>

                        <div className="grid grid-cols-1! sm:grid-cols-3! gap-4 mt-2">
                            <Controller
                                name="shiftId"
                                control={control}
                                render={({ field }) => (
                                    <AntdSelect
                                        placeholder="Select shift"
                                        allowClear={false}
                                        onClear={false}
                                        isMandatory
                                        value={field.value}
                                        options={agentShiftList || []}
                                        error={errors.shiftId?.message}
                                        onPopupScroll={(e) => {
                                            const target = e.target;
                                            if (
                                                target.scrollTop + target.offsetHeight >=
                                                    target.scrollHeight - 10 &&
                                                hasMore &&
                                                !loadingMore
                                            ) {
                                                const nextPage = page + 1;
                                                setPage(nextPage);
                                                api(nextPage);
                                            }
                                        }}
                                        onChange={(val) => {
                                            const obj = agentShiftList?.find(
                                                (agent) => agent.value === val
                                            );
                                            field.onChange(val);
                                            setAgent(obj);
                                        }}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                )}
                            />
                            <Controller
                                name="shiftFrom"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center border border-[#E5E7EB] rounded-xl h-12 overflow-hidden">
                                        <TimePicker
                                            value={
                                                agent?.timing?.startTime
                                                    ? dayjs(agent.timing.startTime, "HH:mm")
                                                    : field?.value || null
                                            }
                                            format="hh:mm"
                                            use12Hours
                                            minuteStep={5}
                                            suffixIcon={null}
                                            bordered={false}
                                            className="flex-1 border-0 shadow-none"
                                            disabled
                                            placeholder="Start Time"
                                        />

                                        <div className="w-px h-6 bg-[#E5E7EB]" />

                                        <Select
                                            value={
                                                agent?.timing?.startTime
                                                    ? dayjs(
                                                          agent?.timing?.startTime,
                                                          "HH:mm"
                                                      ).format("A")
                                                    : null
                                            }
                                            disabled
                                            options={[
                                                { label: "AM", value: "AM" },
                                                { label: "PM", value: "PM" },
                                            ]}
                                            placeholder={"AM"}
                                            className="w-20 border-0! shadow-none! bg-transparent!"
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                name="shiftTo"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center border border-[#E5E7EB] rounded-xl h-12 overflow-hidden">
                                        <TimePicker
                                            value={
                                                agent?.timing?.endTime
                                                    ? dayjs(agent.timing.endTime, "HH:mm")
                                                    : field?.value || null
                                            }
                                            format="hh:mm"
                                            use12Hours
                                            minuteStep={5}
                                            suffixIcon={null}
                                            bordered={false}
                                            placeholder="End Time"
                                            className="flex-1 border-0! shadow-none cursor-not-allowed"
                                            disabled
                                        />

                                        <div className="w-px h-6 bg-[#E5E7EB]" />

                                        <Select
                                            value={
                                                agent?.timing?.endTime
                                                    ? dayjs(agent?.timing?.endTime, "HH:mm").format(
                                                          "A"
                                                      )
                                                    : null
                                            }
                                            disabled
                                            options={[
                                                { label: "AM", value: "AM" },
                                                { label: "PM", value: "PM" },
                                            ]}
                                            placeholder="AM"
                                            className="w-20 border-0! shadow-none! bg-transparent!"
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentInformationCard;
