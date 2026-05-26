import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function ChatHistory({ messages = [] }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative group">
                    <button
                        onClick={() => setOpen(true)}
                        aria-describedby="chat-tooltip"
                        className="
                            w-14 h-14 rounded-full
                            bg-indigo-200 text-indigo-600
                            border border-indigo-200
                            flex items-center justify-center
                            shadow-sm
                            transition-all duration-200
                            hover:bg-indigo-100 hover:shadow-md
                            focus:bg-indigo-100 focus:ring-2 focus:ring-indigo-300
                        "
                    >
                        <MessageCircle className="w-6 h-6" />
                    </button>

                    {/* Tooltip */}
                    <div
                        id="chat-tooltip"
                        role="tooltip"
                        className="
        absolute right-16 top-1/2 -translate-y-1/2
        whitespace-nowrap rounded-md
        bg-gray-900 text-white text-xs
        px-2 py-1
        opacity-0
        group-hover:opacity-100
        group-focus-within:opacity-100
        transition
        pointer-events-none
    "
                    >
                        View chat history
                    </div>
                </div>
            </div>

            {/* Drawer */}
            {open && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Overlay */}
                    <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />

                    {/* Drawer Panel */}
                    <div
                        className="w-[360px] bg-white shadow-xl flex flex-col 
                          animate-slide-in-right"
                    >
                        {/* Header */}
                        <div className="h-14 px-4 border-b flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Chat History</h3>
                            <button onClick={() => setOpen(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col">
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                                    No chat messages available
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.messageId}
                                        className={`text-sm max-w-[80%] px-3 py-2 rounded-lg
          ${
              msg.senderRole === "agent"
                  ? "bg-blue-50 text-blue-900 self-start"
                  : "bg-gray-100 text-gray-800 self-end"
          }`}
                                    >
                                        <span className="block text-[10px] opacity-60 mb-1 capitalize">
                                            {msg.senderRole}
                                        </span>
                                        {msg.message}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div
                            className="h-10 border-t text-xs text-gray-500 
                            flex items-center justify-center"
                        >
                            Chat history is read-only
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
