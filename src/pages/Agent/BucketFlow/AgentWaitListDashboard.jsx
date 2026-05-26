import { useState, useEffect } from "react";
import WiFiVisualization from "./components/WiFiVisualization";
import { useBucketStore } from "../../../store/bucket.store";
import CustomerCard from "./components/CustomerCard";
import useAgentBucket from "../../../components/hooks/AgentManager";
import SwitchField from "../../../components/ui/SwitchField";

const AgentWaitListDashboard = () => {
    const { setClickedCustomerName } = useBucketStore();
    const { onlineCustomers, removeOnlineCustomer } = useAgentBucket("agent");

    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const computePositions = () => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight - 50;
            const rings = 3;
            const customers = onlineCustomers || [];
            const perRing = Math.ceil(customers.length / rings);
            const minR = window.innerWidth * 0.18;
            const ringGap = window.innerWidth * 0.08;

            let positions = [];
            let index = 0;

            for (let r = 0; r < rings; r++) {
                const radius = minR + r * ringGap;
                const count = Math.min(perRing, customers.length - r * perRing);
                if (count <= 0) continue;

                const startAngle = Math.PI * 0.15;
                const endAngle = Math.PI * 0.85;

                for (let i = 0; i < count; i++) {
                    const angle = startAngle + (i / (count - 1 || 1)) * (endAngle - startAngle);
                    const x = cx + Math.cos(angle) * radius;
                    const y = cy - Math.sin(angle) * radius;
                    positions[index++] = { x, y };
                }
            }
            return positions;
        };

        const update = () => setPositions(computePositions());
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [onlineCustomers]);

    const handlePickCustomer = (c, caseId) => {
        const url = `/agents/agent-call/${caseId}?name=${c.name}`;
        window.open(url, "_self");
        removeOnlineCustomer(caseId);
        setClickedCustomerName(c.name);
    };

    return (
        <div className="fixed inset-0 overflow-hidden">
            <WiFiVisualization />

            {onlineCustomers?.map((c, i) => {
                return (
                    Object.keys(c).length > 0 && (
                        <div
                            key={c.caseId}
                            className="absolute"
                            style={{
                                left: positions[i]?.x ?? 0,
                                top: positions[i]?.y ?? 0,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <CustomerCard
                                customer={c}
                                onPick={() => handlePickCustomer(c, c.caseId)}
                            />
                        </div>
                    )
                );
            })}
        </div>
    );
};

export default AgentWaitListDashboard;
