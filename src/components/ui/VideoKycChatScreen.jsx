import React, { useState, useRef, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import useChat from "../hooks/useChat";
import { useParams } from "react-router-dom";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { Drawer } from "antd";

export default function VideoKycChatUI({ maximized, setMaximized, unreadCount, setUnreadCount }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typingRole, setTypingRole] = useState(null);
    const bottomRef = useRef(null);
    const { caseId } = useParams();

    const maximizedRef = useRef(maximized);
    const messagesRef = useRef(messages);

    useEffect(() => {
        maximizedRef.current = maximized;
    }, [maximized]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const handleReceiveChatMessage = (msg) => {
        handleDeliverEvent({ msg });
        if (maximizedRef.current === true) {
            handleSeenEvent({ msg });
        } else {
            setUnreadCount((count) => count + 1);
        }
        setMessages((prev) => [...prev, msg]);
    };

    const handleChatTyping = ({ role }) => {
        setTypingRole(role);
        setTimeout(() => setTypingRole(null), 1500);
    };

    const handleChatDelivered = ({ message }) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.messageId === message.messageId ? { ...m, deliveredAt: message.deliveredAt } : m
            )
        );
    };

    const handleChatSeen = ({ message }) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.messageId === message.messageId ? { ...m, seenAt: message.seenAt } : m
            )
        );
    };

    const handleChatHistory = ({ messages }) => {
        setMessages(messages);
    };

    const handleSentMessage = (message) => {
        messages.push(message);
        setMessages((prev) => {
            const exists = prev.some((m) => m.messageId === message.messageId);
            if (exists) return prev;
            return [...prev, message];
        });
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        handleSentMessageEvent({ input });
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });

        setInput("");
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        handleChatTypingEvent();
    };

    const { handleDeliverEvent, handleSeenEvent, handleSentMessageEvent, handleChatTypingEvent } =
        useChat({
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
        });

    return (
        <>
            <Drawer
                rootClassName="chatdrawer"
                title={null}
                placement={"right"}
                closable={false}
                onClose={() => setMaximized(false)}
                open={maximized}
                size={450}
                styles={{
                    header: {
                        padding: 0,
                        margin: 0,
                    },
                    body: {
                        padding: 0, // optional if you want full control
                    },
                }}
            >
                <div className="relative flex flex-col flex-1 overflow-hidden">
                    <div
                        className="
                            sticky top-0
                            bg-gray-100 px-4 py-2
                            flex justify-between items-center
                            border-b border-gray-300
                        "
                    >
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 bg-green-500 rounded-full" />
                            <span className="text-sm font-semibold text-gray-700">
                                Live Call Chat
                            </span>
                        </div>

                        <button
                            onClick={() => setMaximized(false)}
                            className="p-1.5 bg-white border border-gray-400 rounded-xl hover:bg-gray-200 transition"
                        >
                            <ChevronsUpDown size={18} />
                        </button>
                    </div>
                    <div className="flex flex-col flex-1 min-h-[85vh] mb-3! overflow-scroll">
                        <div className="flex-1 overflow-y-auto p-3 text-sm space-y-3 scroll-smooth  mb-3!">
                            {messages.map((msg) => (
                                <div
                                    key={msg.messageId}
                                    className={`flex flex-col max-w-[60%] ${
                                        msg.senderRole === "agent" ? "ml-auto items-end" : ""
                                    }`}
                                >
                                    <span
                                        className={`text-xs font-semibold mb-1 ${
                                            msg.senderRole === "agent"
                                                ? "text-gray-600"
                                                : "text-blue-600"
                                        }`}
                                    >
                                        {msg.senderRole === "agent" ? "You" : "Customer"}
                                    </span>

                                    <div
                                        className={`p-2 rounded-2xl w-100 wrap-break-word overflow-hidden ${
                                            msg.senderRole === "agent"
                                                ? "bg-gray-100"
                                                : "bg-blue-100"
                                        }`}
                                    >
                                        {msg.message}
                                    </div>

                                    {msg.senderRole === "agent" && msg.deliveredAt && (
                                        <span className="text-[11px] text-gray-400 mt-1">
                                            Delivered {msg.seenAt && "• Seen"}
                                        </span>
                                    )}
                                </div>
                            ))}

                            {typingRole && (
                                <div className="text-xs text-gray-300 italic animate-pulse">
                                    {typingRole === "agent"
                                        ? "Agent is typing..."
                                        : "Customer is typing..."}
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>
                    </div>

                    <div className="mt-2! shrink-0 ">
                        <div className="fixed bottom-0 w-[450px] p-2 flex items-center gap-2 bg-white border-t border-gray-200">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                type="text"
                                placeholder="Type message..."
                                className="flex-1 border border-[#c6c5c5] rounded-2xl px-3 py-2 text-sm focus:outline-none"
                            />

                            <div>
                                <PrimaryButton label="Send" onNotify={sendMessage} size="small" />
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
