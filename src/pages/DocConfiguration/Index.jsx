import React, { useEffect, useState } from "react";
import ImageLoader from "../../components/ui/ImageLoader";
import { removeUnderScore, showFailure, showSuccess } from "../../utils";

import SwitchField from "../../components/ui/SwitchField";
import { Check } from "lucide-react";

import SecondaryButton from "../../components/buttons/SecondaryButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import useEntityStore from "../../store/Entity/useEntityStore";
import { Radio } from "antd";
import { useHeaderStore } from "../../store/Header/useHeaderStore";
import CommonNoData from "../../components/ui/CommonNoData";

const DocConfiguration = () => {
    const { setHeader, clearHeader } = useHeaderStore();
    const { getEntityList, updateEntity } = useEntityStore();
    const [page] = useState(1);
    const [limit] = useState(10);
    const [entities, setEntities] = useState([]);
    const [idxEntity, setIdxEntity] = useState(0);
    const [showbtn, setShowBtn] = useState(false);
    const params = {
        page,
        limit,
    };

    const handleToggle = (idx) => {
        setIdxEntity((prev) => (prev === idx ? null : idx));
    };

    const handleSubmit = async () => {
        if (!entities?.length) return;

        const hasInvalidSelectable = entities.some((entity) =>
            entity?.documents?.every((doc) => doc?.selectable === false)
        );

        if (hasInvalidSelectable) {
            showFailure("At least one document must be selectable for each entity type");
            return;
        }

        const hasNoCaptureSelectable = entities.some(
            (entity) =>
                !entity?.documents?.some(
                    (doc) => doc?.sourceType === "capture" && doc?.selectable === true
                )
        );

        if (hasNoCaptureSelectable) {
            showFailure("At least one capture document must be selectable for each entity");
            return;
        }

        const payload = entities.map((entity) => ({
            entityType: entity?.entityType,
            documents:
                entity?.documents?.map((doc) => ({
                    documentType: doc?.documentType,
                    mandatory: doc?.mandatory,
                    selectable: doc?.selectable,
                    sourceType: doc?.sourceType,
                })) || [],
        }));

        const res = { entities: payload };

        await updateEntity(res, (response) => {
            if (response?.data?.success) {
                showSuccess(response?.data?.message || "Entity updated successfully");
                setShowBtn(false);
            }
        });
    };
    const handleEdit = () => {
        setShowBtn(true);
    };
    useEffect(() => {
        setHeader({
            title: "",
            actions: (
                <div className="flex gap-3">
                    {showbtn ? (
                        <>
                            <SecondaryButton
                                iconLeft="cancelIcon"
                                label="Cancel"
                                onNotify={() => setShowBtn(false)}
                            />
                            <PrimaryButton
                                iconLeft="saveicon"
                                label="Save"
                                onNotify={handleSubmit}
                            />
                        </>
                    ) : (
                        <PrimaryButton iconLeft="saveicon" label="Edit" onNotify={handleEdit} />
                    )}
                </div>
            ),
        });

        return () => clearHeader();
    }, [clearHeader, setHeader, entities, showbtn]);

    const handleTable = () => {
        const fetchData = async () => {
            await getEntityList(params).then((res) => {
                setEntities(res?.data?.data || []);
            });
        };

        fetchData();
    };
    useEffect(() => {
        handleTable();
    }, [page, limit, getEntityList]);

    const handleSelectBox = (doc, d) => {
        const updatedEntities = entities.map((entity, e) => {
            if (e === idxEntity) {
                const updatedDocs = entity?.documents?.map((document, i) => {
                    if (i === d) {
                        return {
                            ...document,
                            selectable: !document.selectable,
                            mandatory: document.selectable ? false : document.mandatory,
                        };
                    }
                    return document;
                });
                return { ...entity, documents: updatedDocs };
            }
            return entity;
        });
        setEntities(updatedEntities);
    };
    const handleBreakChange = (value, doc, d) => {
        const updatedEntities = entities?.map((entity, entityIndex) => {
            if (entityIndex === idxEntity) {
                const updatedDocs = entity?.documents?.map((document, i) => {
                    if (i === d) {
                        return { ...document, mandatory: value };
                    }
                    return document;
                });

                return { ...entity, documents: updatedDocs };
            }

            return entity;
        });

        setEntities(updatedEntities);
    };

    const handleSourceChange = (value, entityIndex, docIndex) => {
        const updatedEntities = entities.map((entity, e) => {
            if (e === entityIndex) {
                const updatedDocs = entity?.documents?.map((doc, d) => {
                    if (d === docIndex) {
                        return {
                            ...doc,
                            sourceType: value,
                        };
                    }
                    return doc;
                });
                return { ...entity, documents: updatedDocs };
            }
            return entity;
        });

        setEntities(updatedEntities);
    };

    return (
        <div className="p-2">
            <div className="border-b border-[#CDD0D1] pb-4">
                <p className="text-[18px] font-extrabold text-[#000] mb-4 max-[500px]:text-[14px]">
                    Doc Configuration
                </p>
                <p className="text-[14px] text-[#6A7174] m-0! max-[500px]:text-[10px]">
                    Configure required documents for different business types and entities
                </p>
            </div>
            <div className="bg-[#F9FAFB] mt-5 py-2 px-4 rounded-xl">
                {entities?.length > 0 ? (
                    entities.map((entity, e) => (
                        <div key={e}>
                            <div
                                className={`flex items-center px-3 pt-3 ${idxEntity === e ? "pb-6" : ""} gap-4 cursor-pointer ${
                                    e !== entities.length - 1 ? "" : ""
                                }`}
                                onClick={() => handleToggle(e)}
                            >
                                <div
                                    className={`-mt-1 transform transition-transform duration-300 ${
                                        idxEntity === e ? "rotate-180" : "rotate-0"
                                    }`}
                                >
                                    <ImageLoader
                                        imageKey="dropdownArrowIcon"
                                        className="w-2.5 h-2.5"
                                    />
                                </div>
                                <p className="capitalize text-[#000] text-[16px]">
                                    {entity?.entityType === "ngo_trust"
                                        ? "NGO Trust"
                                        : removeUnderScore(entity?.entityName)}
                                </p>
                            </div>
                            <div
                                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5  ${e !== entities.length - 1 ? `border-b border-[#E6E7E8] ${idxEntity === e ? "pb-[21px]" : "pb-2"}` : ""}`}
                            >
                                {idxEntity === e &&
                                    entity?.documents?.map((doc, d) => (
                                        <div
                                            className="flex max-[500px]:flex-wrap justify-between border border-[#E6E7E8] rounded-lg pt-4 pb-1 px-4 bg-[#fff]"
                                            key={d}
                                        >
                                            <div className="flex gap-2">
                                                <div
                                                    className={`w-4 h-4 ${doc.selectable ? "bg-[#18667C]" : "bg-[#fff]"} ${showbtn ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}  border border-[#E6E7E8] rounded-full `}
                                                    onClick={() =>
                                                        showbtn ? handleSelectBox(doc, d) : null
                                                    }
                                                >
                                                    {doc.selectable && (
                                                        <div
                                                            className={`flex justify-center items-center mt-0.5`}
                                                        >
                                                            <Check className="w-3 h-3 text-white!" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[#101828] text-[16px]">
                                                        {doc?.documentName}
                                                    </p>
                                                    {/* <p className="text-[#818A8C] text-[12px]">
                                                        {doc?.description}
                                                    </p> */}

                                                    {doc?.sourceType !== "api" && (
                                                        <div className="mb-3">
                                                            <p className="text-[#101828] text-[16px] pt-3 max-[500px]:text-[12px]">
                                                                Source Type
                                                            </p>

                                                            <Radio.Group
                                                                value={doc.sourceType}
                                                                disabled={
                                                                    !showbtn || !doc?.selectable
                                                                }
                                                                onChange={(event) =>
                                                                    showbtn
                                                                        ? handleSourceChange(
                                                                              event.target.value,
                                                                              e,
                                                                              d
                                                                          )
                                                                        : null
                                                                }
                                                                className={
                                                                    showbtn && doc?.selectable
                                                                        ? "custom-radio-group"
                                                                        : null
                                                                }
                                                            >
                                                                <Radio
                                                                    value="capture"
                                                                    className="text-[12px]!"
                                                                >
                                                                    Capture
                                                                </Radio>
                                                                <Radio
                                                                    value="upload"
                                                                    className="text-[12px]!"
                                                                >
                                                                    Upload
                                                                </Radio>
                                                            </Radio.Group>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[#6A7174] text-[12px]">
                                                    Is Mandatory
                                                </p>
                                                <div className="">
                                                    <SwitchField
                                                        name={`mandatory-${d}`}
                                                        enabled={doc?.mandatory}
                                                        disabled={!showbtn || !doc?.selectable}
                                                        buttonStyle="w-5 h-3"
                                                        setEnabled={(value) =>
                                                            showbtn
                                                                ? handleBreakChange(value, doc, d)
                                                                : null
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <CommonNoData
                            message={"Oops! There’s nothing here"}
                            describemessage={
                                "There are currently no document configurations to display."
                            }
                        />
                    </div>
                )}
                <div></div>
            </div>
        </div>
    );
};

export default DocConfiguration;
