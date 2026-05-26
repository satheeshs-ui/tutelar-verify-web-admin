import { useEffect, useState } from "react";
import socket from "../../socket";
import { useAppStore } from "../../store/app.store";

export default function useAgentBucket(role) {
    const [bucket, setBucket] = useState([]);
    const [caseId, setCaseId] = useState(null);
    const [status, setStatus] = useState(() => (role === "agent" ? "available" : "idle"));

    const [onlineCustomers, setOnlineCustomers] = useState([]); // ✅ FIXED

    const { userDetails, setNotifications } = useAppStore() || {};

    const agentId = userDetails?.userDetails?.userId;
    const clientId = userDetails?.userDetails?.parentId;

    useEffect(() => {
        // ✅ Wait until userDetails ready
        if (!agentId || role !== "agent") return;

        if (!socket.connected) {
            socket.connect();
        }

        // ✅ JOIN EVENTS (only once)
        socket.emit("join-agent-bucket", {
            agentId,
            clientId,
        });

        socket.emit("join-notification", {
            agentId,
        });

        // ✅ HANDLERS
        const handleCustomerArrived = (newItem) => {
            if (!newItem?.caseId) return;

            setOnlineCustomers((prev) => {
                const exists = prev.some((c) => c.caseId === newItem.caseId);

                return exists
                    ? prev.map((c) => (c.caseId === newItem.caseId ? newItem : c))
                    : [...prev, newItem];
            });
        };

        const handleCustomerTaken = (data) => {
            setOnlineCustomers((prev) => prev.filter((c) => c.caseId !== data?.caseId));
        };

        const handleFetchCustomers = (data) => {
            setOnlineCustomers(data?.customers || []);
        };

        const handleNotification = (data) => {
            setNotifications((prev) => [
                { ...data, id: crypto.randomUUID(), read: false },
                ...prev,
            ]);
        };

        const onUpdateBucket = (list) => setBucket(list);
        const onNoAgents = () => setStatus("idle");

        const onMatchFound = ({ roomId }) => {
            setCaseId(roomId);
            setStatus("matched");
        };

        // ✅ SOCKET LISTENERS
        socket.on("customer-arrived", handleCustomerArrived);
        socket.on("customer-taken", handleCustomerTaken);
        socket.on("fetch-customers", handleFetchCustomers);
        socket.on("case-notification", handleNotification);

        socket.on("server:update_agent_bucket", onUpdateBucket);
        socket.on("server:no_agents", onNoAgents);
        socket.on("server:match_found", onMatchFound);

        // ✅ CLEANUP (VERY IMPORTANT)
        return () => {
            socket.off("customer-arrived", handleCustomerArrived);
            socket.off("customer-taken", handleCustomerTaken);
            socket.off("fetch-customers", handleFetchCustomers);
            socket.off("case-notification", handleNotification);

            socket.off("server:update_agent_bucket", onUpdateBucket);
            socket.off("server:no_agents", onNoAgents);
            socket.off("server:match_found", onMatchFound);

            socket.emit("agent:offline");
        };
    }, [agentId, clientId, role, setNotifications]);

    // ✅ ACTIONS
    const requestAgent = () => {
        setStatus("searching");
        socket.emit("customer:request_agent");
    };

    const removeOnlineCustomer = (id) => {
        setOnlineCustomers((prev) => prev.filter((item) => item.caseId !== id));
    };

    return {
        bucket,
        caseId,
        status,
        requestAgent,
        onlineCustomers,
        removeOnlineCustomer,
    };
}
