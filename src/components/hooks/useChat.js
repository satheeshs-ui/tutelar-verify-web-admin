import { useEffect, useRef } from "react";
import socket from "../../socket";

export default function useChat({
    maximized,
    bottomRef,
    messages,
    caseId,
    unreadCount,
    handleChatHistory,
    handleSentMessage,
    handleReceiveChatMessage,
    handleChatTyping,
    handleChatDelivered,
    handleChatSeen,
}) {
    const socketRef = useRef(socket);
    const currentSocket = socketRef.current;
    const maximizedRef = useRef(maximized);
    const messagesRef = useRef(messages);

    const seenSentRef = useRef(new Set());

    useEffect(() => {
        maximizedRef.current = maximized;
    }, [maximized]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        if (!maximizedRef.current) return;

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });

        for (const msg of messagesRef.current) {
            if (msg.senderRole === "agent") continue;

            if (msg.seenAt) continue;
            if (seenSentRef.current.has(msg.messageId)) continue;

            currentSocket.emit("chat-seen", {
                caseId,
                messageId: msg.messageId,
            });

            seenSentRef.current.add(msg.messageId);
        }
    }, [maximized, unreadCount, messages, caseId]);

    useEffect(() => {
        socket.on("chat-history", handleChatHistory);
        socket.on("sent-chat-message", handleSentMessage);
        socket.on("receive-chat-message", handleReceiveChatMessage);
        socket.on("chat-typing", handleChatTyping);
        socket.on("chat-delivered", handleChatDelivered);
        socket.on("chat-seen", handleChatSeen);

        return () => {
            socket.off("chat-history");
            socket.off("sent-chat-message");
            socket.off("receive-chat-message");
            socket.off("chat-typing");
            socket.off("chat-delivered");
            socket.off("chat-seen");
        };
    }, []);

    const handleDeliverEvent = ({ msg }) => {
        currentSocket.emit("chat-delivered", { caseId, messageId: msg.messageId });
    };

    const handleSeenEvent = ({ msg }) => {
        currentSocket.emit("chat-seen", { caseId, messageId: msg.messageId });
    };

    const handleSentMessageEvent = ({ input }) => {
        socket.emit("send-chat-message", { message: input, caseId });
    };

    const handleChatTypingEvent = () => {
        socket.emit("chat-typing", { caseId, role: "agent" });
    };

    return {
        handleDeliverEvent,
        handleSeenEvent,
        handleSentMessageEvent,
        handleChatTypingEvent,
    };
}
