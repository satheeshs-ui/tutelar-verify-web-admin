import { useEffect, useState, useRef, useCallback } from "react";
import { Checkbox, Form } from "antd";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePickerField from "../../../../components/ui/DatePickerField";
import AntdInput from "../../../../components/ui/AntdInput";
import AntdSelect from "../../../../components/ui/AntdSelect";
import { PrimaryButton } from "../../../../components/buttons/PrimaryButton";
import ApiCall from "../../../../config/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../../components/buttons/SecondaryButton";
import ImageLoader from "../../../../components/ui/ImageLoader";
import { caseSchema } from "../../Validation/caseSchema";
import { showFailure } from "../../../../utils";
import TestAreaField from "../../../../components/ui/TextAreaField";
import useCaseStore from "../../../../store/Case/useCaseStore";
import { useHeaderStore } from "../../../../store/Header/useHeaderStore";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const CreateCasePage = () => {
    const navigate = useNavigate();
    const {
        getCaseList,
        createCase,
        getAgentSlotList,
        getDefaultSlotList,
        agentSlotList,
        getAvailableSlots,
    } = useCaseStore();

    const { setHeader, clearHeader } = useHeaderStore();

    const [primaryLanguages, setPrimaryLanguages] = useState([]);
    const [agentList, setAgentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [slotErr, setSlotErr] = useState(false);
    const dropdownRef = useRef(null);
    const [slotList, setSlotList] = useState(agentSlotList ?? []);

    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const [filteredLanguages, setFilteredLanguages] = useState([]);

    const SIGN_LANG = "Sign Language";
    const MAX_SECONDARY = 3;

    const {
        control,
        setValue,
        reset,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(caseSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            dob: null,
            entityType: "individual",
            panNumber: "",
            address: "",
            primaryLanguages: "",
            secondaryLanguages: [],
            url: "",
            agent: undefined,
            scheduledDate: dayjs(),
            timeSlot: "",
        },
    });
    const [entityTypes] = useState([
        { label: "Individual", value: "individual" },
        { label: "Partnership / LLP", value: "partnership" },
        { label: "Private Limited", value: "private_limited" },
        { label: "Sole Proprietorship", value: "sole_proprietorship" },
        { label: "Trust/NGO", value: "ngo_trust" },
    ]);

    const params = {
        page: 1,
        limit: 10,
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const primaryLang = watch("primaryLanguages");
    const date = watch("scheduledDate");
    const entity = watch("entityType");

    const secondaryLangs = watch("secondaryLanguages") || [];

    const selectedLanguages = [...(primaryLang ? [primaryLang] : []), ...(secondaryLangs ?? [])];

    useEffect(() => {
        if (!primaryLang || secondaryLangs.length === 0) return;
        if (secondaryLangs.includes(primaryLang)) {
            const filtered = secondaryLangs.filter((lang) => lang !== primaryLang);

            setValue("secondaryLanguages", filtered, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [primaryLang]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const timesSlot = watch("timeSlot");

            if (!timesSlot) {
                setSlotErr(true);
                return;
            }
            setSlotErr(false);

            setLoading(true);

            const baseDate =
                data?.scheduledDate && dayjs(data.scheduledDate).isAfter(dayjs())
                    ? data.scheduledDate
                    : new Date();

            const datePart = dayjs(baseDate).format("YYYY-MM-DD");

            const timePart = timesSlot.includes("-") ? timesSlot.split("-")[0] : timesSlot;

            let finalTime = "";

            if (timePart.includes("AM") || timePart.includes("PM")) {
                const [time, modifier] = timePart.split(" ");
                let [hours, minutes, seconds] = time.split(":");

                hours = parseInt(hours, 10);

                if (modifier === "PM" && hours !== 12) {
                    hours += 12;
                }
                if (modifier === "AM" && hours === 12) {
                    hours = 0;
                }

                finalTime = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
            } else {
                finalTime = timePart;
            }

            const localDate = dayjs(`${datePart} ${finalTime}`, "YYYY-MM-DD HH:mm:ss");

            if (!localDate.isValid()) {
                return;
            }
            const now = new Date();
            now.setMinutes(now.getMinutes() + 1);

            const payload = {
                name: data?.name,
                dateOfBirth: data?.dob ? dayjs(data.dob).format("YYYY-MM-DD") : null,
                email: data?.email,
                phone: {
                    countryCode: data?.mobile ? "+91" : "",
                    number: data?.mobile || "",
                },
                address: data?.address,
                returnUrl: data?.url,
                languages: {
                    primary: data?.primaryLanguages,
                    secondary: data?.secondaryLanguages,
                },
                entity: data?.entityType,
                // scheduledDateTime: localDate.toDate().toISOString(),
                scheduledDateTime: now.toISOString(),

                ...(data?.panNumber && { pan: data.panNumber }),

                ...(data?.agent && {
                    agent: {
                        id: data.agent,
                        name: data?.agentName ?? "",
                    },
                }),
            };

            createCase(payload, (res) => {
                if (res) {
                    setLoading(false);
                    handleClose();
                    getCaseList(params);
                    navigate(-1);
                }
            });
        } catch (err) {
            console.error("Create case error:", err);
        } finally {
            setLoading(false);
        }
    };

    const onError = () => {
        if (!selectedTimeSlot) {
            setSlotErr(true);
        }
    };
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
                            label="Save"
                            onNotify={handleSubmit(onSubmit, onError)}
                            disabled={loading}
                        />
                    </div>
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, navigate]);

    useEffect(() => {
        getLanguageList();
    }, []);

    useEffect(() => {
        handleDefaultslot();
    }, []);

    useEffect(() => {
        getAgentList();
    }, [filteredLanguages, date]);

    const handleDefaultslot = () => {
        getDefaultSlotList().then((res) => {
            setSlotList(
                (res?.data?.data || []).map((item) => ({
                    ...item,
                    selected: false,
                }))
            );
        });
    };

    const handleClose = () => {
        reset({
            name: "",
            email: "",
            mobile: "",
            panNumber: "",
            dob: null,
            address: "",
            url: "",
            primaryLanguages: "",
            secondaryLanguages: [],
            entityType: "individual",
            agent: undefined,
            scheduledDate: dayjs(),
        });
    };

    const handleDateChange = (e, name) => {
        if (name === "scheduledDate") {
            setValue("scheduledDate", e);
        } else {
            setValue("dob", e);
        }
    };

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleTimeSlotClick = (slot) => {
        if (!slot) return;

        const agentId = watch("agent");

        const updateSelectedSlot = () => {
            setSlotList((prev) =>
                prev.map((item) => {
                    if (item.timing === slot.timing) {
                        const newSelected = !item.selected;

                        setSelectedTimeSlot(newSelected ? item.timing : "");
                        setSlotErr(newSelected ? false : true);
                        setValue("timeSlot", newSelected ? item.timing : "");
                        return { ...item, selected: newSelected };
                    }

                    return { ...item, selected: false };
                })
            );
        };

        if (agentId) {
            getAvailableSlots(agentId).then((res) => {
                const data = res?.data?.data || {};

                if (!data?.isSlotAvailable) {
                    showFailure(
                        res?.data?.message ||
                            "Selected slot is not available. Please choose another slot or agent."
                    );

                    getAgentSlotList(agentId).then((res) => {
                        setSlotList(
                            (res?.data?.data || []).map((item) => ({
                                ...item,
                                selected: false,
                            }))
                        );
                    });

                    setSelectedTimeSlot("");
                    setSlotErr(true);
                    return;
                }

                updateSelectedSlot();
            });
        } else {
            updateSelectedSlot();
        }
    };

    const handleTimeSlotRemove = () => {
        if (!selectedTimeSlot) return;

        setSlotList((prev) =>
            prev.map((item) => ({
                ...item,
                selected: item.timing === selectedTimeSlot ? false : item.selected,
            }))
        );

        setSelectedTimeSlot("");
        setSlotErr(true);
    };

    const getLanguageList = useCallback(async () => {
        try {
            const response = await ApiCall.get("video-kyc/case/languages");

            if (response?.data?.success) {
                const formatted = response.data.data.map((item) => ({
                    label: item,
                    value: item,
                }));

                setPrimaryLanguages(formatted);
            } else {
                showFailure(response?.message);
            }
        } catch (error) {
            console.error("Error fetching languages:", error);
        }
    }, []);

    const getAgentList = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            selectedLanguages?.length > 0 &&
                selectedLanguages?.forEach((lang) => {
                    if (lang !== SIGN_LANG) {
                        params.append("languages", lang);
                    }
                });
            params.append("status", "active");
            params.append("appUserType", "agent");
            params.append(
                "date",
                watch("scheduledDate")
                    ? dayjs(watch("scheduledDate")).format("YYYY-MM-DD")
                    : dayjs().format("YYYY-MM-DD")
            );
            if (selectedLanguages?.length > 0 && selectedLanguages?.includes(SIGN_LANG)) {
                params.append("is_sign_language", "true");
            } else {
                params.delete("is_sign_language");
            }
            const response = await ApiCall.get(`video-kyc/user/agents?${params.toString()}`);

            if (response?.data?.success) {
                const formatted = response?.data?.data?.agents?.map((item) => ({
                    label: `${item.name} (${item.email})`,
                    value: item.userId,
                    name: item.name,
                }));

                setAgentList(formatted);
            } else {
                showFailure(response?.message);
            }
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    }, [selectedLanguages]);

    const handleClear = () => {
        setValue("secondaryLanguages", []);
    };

    const isPastSlot = (timing) => {
        if (!timing || !date) return false;

        const [startTime] = timing.split(" - ");

        const now = new Date();
        const appointmentDate = new Date(date);

        let [time, modifier] = startTime.split(" ");
        let [hours, minutes] = time.split(":");

        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const slotDate = new Date(appointmentDate);
        slotDate.setHours(hours, minutes, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDay = new Date(appointmentDate);
        selectedDay.setHours(0, 0, 0, 0);

        if (selectedDay < today) return true;

        if (selectedDay.getTime() === today.getTime()) {
            return slotDate < now;
        }

        return false;
    };
    const disablePastDates = (current) => {
        return current && current.startOf("day") < dayjs().startOf("day");
    };
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mx-auto">
            <Form layout="vertical">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-2 space-y-3">
                    <div className="col-span-full font-semibold text-[#222E32] text-[14px]">
                        Basic Information
                    </div>

                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Full Name"
                                placeholder="Enter full name"
                                isMandatory
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
                                {...field}
                                label="Email ID"
                                error={errors.email?.message}
                                placeholder="Enter email ID"
                                onValueChange={(data) => field.onChange(data.value)}
                            />
                        )}
                    />

                    <Controller
                        name="mobile"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Phone Number"
                                placeholder="Enter phone number"
                                onValueChange={(d) =>
                                    field.onChange(d.value.replace(/\D/g, "").slice(0, 10))
                                }
                                error={errors.mobile?.message}
                            />
                        )}
                    />

                    {entity === "individual" && (
                        <Controller
                            name="dob"
                            control={control}
                            render={({ field }) => (
                                <DatePickerField
                                    label="Date Of Birth"
                                    placeholder="DD/MM/YYY"
                                    suffixIcon={"DatePickericon"}
                                    value={field.value}
                                    dobDate={true}
                                    onValueChange={(date) => {
                                        field.onChange(date);
                                        handleDateChange(date, "dob");
                                    }}
                                />
                            )}
                        />
                    )}

                    <div className="col-span-full font-semibold text-[#222E32] text-[14px] border-t border-[#E6E7E8] pt-3 mt-2 flex items-center justify-between">
                        KYC Information{" "}
                    </div>

                    <Controller
                        name="entityType"
                        control={control}
                        render={({ field }) => (
                            <AntdSelect
                                label="Entity Type"
                                placeholder="Select entity types"
                                isMandatory
                                allowClear={false}
                                onClear={null}
                                options={entityTypes}
                                value={field.value || undefined}
                                onChange={(value) => {
                                    field.onChange(value);
                                    setValue("dob", null);
                                }}
                                optionRender={(option) => (
                                    <div
                                        className={`flex items-center gap-2 cursor-pointer
                                        `}
                                    >
                                        <span>{option.label}</span>
                                    </div>
                                )}
                                error={errors.entityType?.message}
                            />
                        )}
                    />
                    <Controller
                        name="panNumber"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="PAN Number"
                                placeholder="Enter pan number"
                                error={errors.panNumber?.message}
                                onValueChange={(data) => {
                                    const value = data?.value?.toUpperCase();
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />

                    <div className="col-span-full font-semibold text-[#222E32] text-[14px] border-t border-[#E6E7E8] pt-3 mt-2">
                        Address Information
                    </div>

                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TestAreaField
                                label="Address"
                                placeholder="Enter address"
                                value={field.value}
                                onChange={field.onChange}
                                name={field.name}
                                error={errors.address?.message}
                                maxLength={400}
                            />
                        )}
                    />

                    <div className="col-span-full font-semibold text-gray-700 border-t border-[#E6E7E8] pt-3 mt-2">
                        Language Information
                    </div>

                    <Controller
                        name="primaryLanguages"
                        control={control}
                        render={({ field }) => (
                            <AntdSelect
                                label="Primary Languages"
                                placeholder="Select languages"
                                showClear
                                onClear={handleClear}
                                options={primaryLanguages}
                                value={field.value}
                                onChange={(value) => {
                                    setFilteredLanguages((prev) => {
                                        return [value, ...prev];
                                    });
                                    setValue("agent", undefined, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });

                                    field.onChange(value);
                                }}
                                optionRender={(option) => (
                                    <div className="flex items-center gap-2">
                                        <span>{option.label}</span>
                                    </div>
                                )}
                            />
                        )}
                    />

                    <Controller
                        name="secondaryLanguages"
                        control={control}
                        render={({ field }) => (
                            <AntdSelect
                                label="Secondary Languages"
                                mode="multiple"
                                placeholder="Select languages"
                                options={primaryLanguages}
                                value={field.value ?? []}
                                disabled={!primaryLang}
                                onChange={(value) => {
                                    let newValue = [...value];

                                    if (primaryLang) {
                                        newValue = newValue.filter((lang) => lang !== primaryLang);
                                    }

                                    if (newValue.includes(SIGN_LANG)) {
                                        newValue = [SIGN_LANG];
                                    }

                                    if (newValue.length > MAX_SECONDARY) {
                                        newValue = newValue.slice(0, MAX_SECONDARY);
                                    }

                                    setFilteredLanguages((prev) => {
                                        return [...prev, newValue];
                                    });

                                    setValue("agent", undefined, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                    field.onChange(newValue);
                                }}
                                optionRender={(option) => {
                                    const selected = (field.value ?? []).includes(option.value);

                                    const selectedValues = field.value ?? [];
                                    const isSelected = selectedValues.includes(option.value);

                                    const disabled =
                                        option.value === primaryLang ||
                                        (selectedValues.includes(SIGN_LANG) &&
                                            option.value !== SIGN_LANG) ||
                                        (option.value === SIGN_LANG &&
                                            selectedValues.length > 0 &&
                                            !isSelected) ||
                                        (selectedValues.length >= MAX_SECONDARY && !isSelected);

                                    return (
                                        <div
                                            className={`flex items-center gap-2 ${
                                                disabled ? "cursor-not-allowed opacity-60" : ""
                                            }`}
                                        >
                                            <Checkbox checked={selected} disabled={disabled} />
                                            <span>{option.label}</span>
                                        </div>
                                    );
                                }}
                            />
                        )}
                    />

                    <div className="col-span-full font-semibold text-[#222E32] text-[14px] border-t border-[#E6E7E8] pt-3 mt-2">
                        Case Information
                    </div>

                    <Controller
                        name="url"
                        control={control}
                        render={({ field }) => (
                            <AntdInput
                                {...field}
                                label="Return url"
                                placeholder="Enter url"
                                prefixIcon={"linkIcon"}
                                error={errors.url?.message}
                                onValueChange={(data) => {
                                    const value = data?.value;
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="scheduledDate"
                        control={control}
                        render={({ field }) => (
                            <DatePickerField
                                label={
                                    <p className="mb-0!">
                                        Appointment Date <span className="text-red-500">*</span>
                                    </p>
                                }
                                value={field.value}
                                disabledDate={disablePastDates}
                                onValueChange={(d) => {
                                    field.onChange(d);
                                    handleDateChange(d, "scheduledDate");
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="agent"
                        control={control}
                        render={({ field }) => (
                            <AntdSelect
                                label={<p>Assign Agent</p>}
                                placeholder="Select agents"
                                options={agentList}
                                value={field.value || undefined}
                                onClear={() => {
                                    setSelectedTimeSlot(null);

                                    handleDefaultslot();
                                    field.onChange(undefined);
                                }}
                                onChange={(value) => {
                                    agentList.forEach((agent) => {
                                        if (agent?.value === value) {
                                            setValue("agentName", agent.name, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }
                                    });
                                    if (value) {
                                        getAgentSlotList(value).then((res) => {
                                            setSlotList(
                                                (res?.data?.data || []).map((item) => ({
                                                    ...item,
                                                    selected: false,
                                                }))
                                            );
                                        });
                                        field.onChange(value);
                                        setSelectedTimeSlot(null);
                                    }
                                }}
                                optionRender={(option) => (
                                    <div className="flex items-center gap-2">
                                        <span>{option.label}</span>
                                    </div>
                                )}
                            />
                        )}
                    />
                    <div ref={dropdownRef}>
                        <p className="text-[#0B1C20] font-normal text-[14px] -mb-1.5!">
                            Available Slot <span className="text-red-500">*</span>
                        </p>
                        <div className="mt-4 relative">
                            {open && (
                                <div className="absolute z-20 bottom-13 grid grid-cols-2 gap-3 max-h-[300px] overflow-auto my-2 border border-[#E6E7E8] rounded-lg p-3 bg-white!">
                                    {slotList.length > 0 ? (
                                        slotList.map((slot, i) => {
                                            const isSelected = slot.selected;
                                            const occupied = slot.status === "occupied";
                                            const isPast = isPastSlot(slot.timing);

                                            const isDisabled = occupied || isPast;

                                            return (
                                                <div
                                                    key={i}
                                                    className={`
                                rounded-xl pt-2 px-3 text-center transition
                                ${
                                    isSelected
                                        ? "bg-[#1f6b7a] text-white"
                                        : "border border-[#CDD0D1]"
                                }
                                ${
                                    isDisabled
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer hover:border-[#1f6b7a]"
                                }
                            `}
                                                    onClick={() => {
                                                        if (!isDisabled) {
                                                            handleTimeSlotClick(slot, i);
                                                        }
                                                    }}
                                                >
                                                    {/* 🔹 Time */}
                                                    <p
                                                        className={`font-medium text-sm leading-5 ${
                                                            isSelected
                                                                ? "text-white"
                                                                : isDisabled
                                                                  ? "text-[#818A8C]"
                                                                  : "text-[#16262B]"
                                                        }`}
                                                    >
                                                        {slot.timing}
                                                    </p>

                                                    <p
                                                        className={`text-xs ${
                                                            isSelected
                                                                ? "text-white"
                                                                : isDisabled
                                                                  ? "text-[#9CA1A2]"
                                                                  : "text-[#222E32]"
                                                        }`}
                                                    >
                                                        {isDisabled ? "Not Available" : "Available"}
                                                    </p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500">No slots available</p>
                                    )}
                                </div>
                            )}

                            <div
                                className={`border ${slotErr ? "border-rejected" : "border-[#E6E7E8]"}  py-2 rounded-lg cursor-pointer flex items-center justify-between`}
                                onClick={() => handleToggle()}
                            >
                                <div className="flex flex-wrap gap-2 items-center pl-2">
                                    {selectedTimeSlot ? (
                                        <>
                                            <p className="text-[#16262B] flex items-center justify-between text-xs font-normal border border-[#1f6b7a] rounded-full px-2 py-0.5">
                                                {selectedTimeSlot}
                                                <span>
                                                    <ImageLoader
                                                        imageKey="cancelIcon"
                                                        className="w-4 h-4 ml-1 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTimeSlotRemove(selectedTimeSlot);
                                                        }}
                                                    />
                                                </span>
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-[#818A8C] text-sm font-normal pl-1">
                                            Select Available Slot
                                        </p>
                                    )}
                                </div>
                                <ImageLoader
                                    imageKey="vkycDropdown"
                                    className={`w-3 h-3 mr-3 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
                                />
                            </div>
                            <p className="text-rejected text-sm mt-2!">
                                {!selectedTimeSlot && slotErr && "Please select a time slot"}
                            </p>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default CreateCasePage;
