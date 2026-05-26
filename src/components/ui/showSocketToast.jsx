import { toast } from "react-hot-toast";
import ImageLoader from "./ImageLoader";

const formatTime = (isoTime) => {
    if (!isoTime) return "";
    return new Date(isoTime).toLocaleString();
};

export const showSocketToast = ({
    type,
    message,
    caseId,
    scheduledTime,
    entity,
    // navigate,
    languages,
    name,
}) => {
    toast.remove();
    const isAssigned = type === "CASE_ASSIGNED";
    const isJoined = type === "CUSTOMER_JOINED";

    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                } w-[430px] bg-white rounded-2xl shadow-xl p-5 border border-gray-200`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{message}</p>
                        <p className="text-xs text-gray-500 mt-1">Case ID: {caseId}</p>
                    </div>

                    <button
                        onClick={() => toast.remove(t.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <ImageLoader imageKey="closeIcon" className="w-4 h-4" />
                    </button>
                </div>

                {isJoined && (
                    <>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs mb-2">
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-gray-400">Scheduled Time</p>
                                <p className="font-medium text-gray-800">
                                    {formatTime(scheduledTime)}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-gray-400">Entity</p>
                                <p className="font-medium text-gray-800 capitalize">{entity}</p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-xl">
                                <p className="text-gray-400">Primary Language</p>
                                {languages?.primary ? (
                                    <p className="ml-3 pt-2">1.{languages?.primary}</p>
                                ) : (
                                    "-"
                                )}
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="text-gray-400 mb-3">Secondary Language</span>
                                <ul className="ml-3 pt-2">
                                    {languages?.secondary.length > 0
                                        ? languages?.secondary.map((item, i) => {
                                              return (
                                                  <li key={i} className="mb-1">
                                                      {i + 1}.{item}
                                                  </li>
                                              );
                                          })
                                        : "-"}
                                </ul>
                            </div>
                        </div>

                        {/* <button
                            onClick={() => {
                                toast.remove(t.id);
                                navigate(`/agents/agent-call/${caseId}?name=${name}`);
                            }}
                            className="mt-4 w-full bg-linear-to-b from-[#0f6f79] to-[#094e55] text-white! text-sm font-medium py-2 rounded-xl transition cursor-pointer"
                        >
                            Connect Now
                        </button> */}

                        <a
                            href={`/agents/agent-call/${caseId}?name=${name}`}
                            rel="noopener noreferrer"
                            className="cursor-pointer mt-4 display-block w-full text-center bg-linear-to-b from-[#0f6f79] to-[#094e55] text-sm font-medium p-2! rounded-xl transition text-white block"
                            onClick={() => {
                                toast.remove(t.id);
                            }}
                        >
                            Connect Now
                        </a>
                    </>
                )}
            </div>
        ),
        {
            duration: isAssigned ? 3000 : Infinity,
        }
    );
};
