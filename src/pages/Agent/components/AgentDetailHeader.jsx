import { useState } from "react";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { useNavigate } from "react-router-dom";

const dateOptions = [
    { label: "Last 7 days", value: 7 },
    { label: "Last 15 days", value: 15 },
    { label: "Last 30 days", value: 30 },
    { label: "Last 3 months", value: 90 },
    { label: "Last 6 months", value: 180 },
];

const AgentDetailHeader = ({ userId, onRangeChange }) => {
    const navigate = useNavigate();
    const [active, setActive] = useState(7); // default last 7 days

    const handleEdit = () => {
        navigate(`/agents/agents-list/edit-user/${userId}`);
    };

    const handleRange = (val) => {
        setActive(val);
        onRangeChange?.(val);
    };

    return (
        <div className="bg-white border border-[#CDD0D1]! rounded-[18px] p-4 flex flex-col gap-2">
            {/* edit button */}
            <SecondaryButton
                label="Edit Agent"
                iconLeft="EditIcons"
                className="w-auto!"
                onNotify={handleEdit}
            />

            {/* date buttons */}
            <div className="flex gap-2">
                {dateOptions.map((item) => (
                    <SecondaryButton
                        key={item.value}
                        label={item.label}
                        className={`w-auto! ${
                            active === item.value ? "bg-[#18667C]! text-white!" : ""
                        }`}
                        onNotify={() => handleRange(item.value)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AgentDetailHeader;
