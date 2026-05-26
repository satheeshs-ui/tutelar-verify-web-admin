import ImageLoader from "../../../components/ui/ImageLoader";
import { checkValue, shortName } from "../../../utils";

const AgentDetailProfileCard = ({ data }) => {
    return (
        <div className="bg-white border border-[#CDD0D1]! rounded-[18px] p-4 flex flex-col gap-2">
            <div className="flex flex-wrap justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-[#D0D0D0] flex items-center justify-center text-[22px] font-bold text-[#0B1C20]">
                        {shortName(data?.name)}
                    </div>

                    <div>
                        <h2 className="text-[20px] font-semibold text-[#0B1C20] capitalize max-[500px]:text-[14px]">
                            {data?.name || "-"}
                        </h2>

                        <p className="text-[12px] font-normal">
                            <span className="text-[#6A7174]">Agent ID :</span>{" "}
                            <span className="text-[#0B1C20]">{checkValue(data?.userId)}</span>
                        </p>
                    </div>
                </div>

                <div
                    className="flex items-center gap-2 border border-[#CDD0D1] rounded-[30px] bg-white py-1.5 px-3"
                    style={{ padding: "6px 12px" }}
                >
                    <span
                        className={`w-2 h-2 ${data?.status === "inactive" ? "bg-[#e91717]" : "bg-[#17B26A]"}  rounded-full`}
                    ></span>
                    <span className="text-[12px] leading-4 font-normal text-[#0B1C20] capitalize">
                        {data.status}
                    </span>
                </div>
            </div>

            <div className="border-t border-[#CDD0D1] my-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
                <InfoBox
                    label="Email Address"
                    value={data?.email}
                    icon={<ImageLoader imageKey="DetailMail" />}
                />
                <InfoBox
                    label="Phone Number"
                    value={data?.mobile}
                    icon={<ImageLoader imageKey="DetailPhone" />}
                />
                <LanguageBox
                    label="Language"
                    value={data?.languages}
                    icon={<ImageLoader imageKey="DetailLanguage" />}
                />
                {/* <InfoBox
                    label="Agent Type"
                    value={data?.appUserType}
                    icon={<ImageLoader imageKey="DetailAgent" />}
                /> */}
            </div>
        </div>
    );
};

const InfoBox = ({ label, value, icon }) => (
    <div className="bg-[#F9FAFB] rounded-xl flex gap-3 px-4 py-4 ">
        {icon && <div className="w-[14.66px] h-[13.33px] shrink-0 mt-0.5">{icon}</div>}
        <div className="flex flex-col gap-1">
            <p className="text-[12px] leading-4 font-normal text-[#6A7174]">{label}</p>
            <p
                className={`text-[16px] max-[500px]:text-[11px] leading-4 font-normal text-[#0B1C20] ${label === "Agent Type" ? "capitalize" : ""}`}
            >
                {checkValue(value)}
            </p>
        </div>
    </div>
);

const LanguageBox = ({ label, value = [], icon }) => (
    <div className="bg-[#F9FAFB] rounded-xl flex flex-col gap-2 px-4 py-4">
        <div className="flex gap-2">
            {icon && <div className="w-[14.66px] h-[13.33px] shrink-0 mt-0.5">{icon}</div>}
            <p className="text-[12px] leading-4 font-normal text-[#6A7174]">{label}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
            {(value || []).map((lang, i) => (
                <span
                    key={i}
                    className="text-[12px] leading-4 font-normal text-[#18667C] flex items-center justify-center"
                    style={{
                        borderRadius: 30,
                        border: "1px solid #18667C",
                        padding: "4px 10px",
                    }}
                >
                    {lang}
                </span>
            ))}
        </div>
    </div>
);
export default AgentDetailProfileCard;
