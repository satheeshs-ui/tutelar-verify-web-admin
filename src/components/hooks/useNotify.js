import { useEffect } from "react";
import socket from "../../socket";
import { useAppStore } from "../../store/app.store";
import { showSocketToast } from "../ui/showSocketToast";
import { useNavigate } from "react-router-dom";

const useNotify = () => {
    const { userDetails, setNotifications } = useAppStore();

    const navigate = useNavigate();
    const agentId = userDetails?.userDetails?.userId;
    const isAgent = userDetails?.userDetails?.appUserType === "agent";

    useEffect(() => {
        if (!isAgent || !agentId) return;

        if (!socket.connected) {
            socket.connect();
        }

        const joinRoom = () => {
            socket.emit("join-notification", { agentId });
        };

        if (socket.connected) {
            joinRoom();
        }

        socket.on("connect", joinRoom);

        const handleNotification = (data) => {
            setNotifications((prev) => [
                { ...data, id: crypto.randomUUID(), read: false },
                ...prev,
            ]);
            if (data.type === "CASE_ASSIGNED") {
                showSocketToast({
                    message: data.message,
                    caseId: data.caseId,
                    autoClose: true,
                    type: data.type,
                });
            }

            if (data.type === "CUSTOMER_JOINED") {
                showSocketToast({
                    type: data.type,
                    message: data.message,
                    caseId: data.caseId,
                    scheduledTime: data.scheduledTime,
                    entity: data.entity,
                    languages: data.languages,
                    navigate,
                    name: data?.name,
                });
            }
        };

        socket.on("case-notification", handleNotification);

        return () => {
            socket.off("connect", joinRoom);
            socket.off("case-notification", handleNotification);
        };
    }, [userDetails?.userDetails?.userId, setNotifications, navigate]);

    return null;
};

export default useNotify;
