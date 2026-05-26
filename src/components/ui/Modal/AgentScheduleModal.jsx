import { Modal } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import ModalSessionTimer from "./ModalSessionTimer";

export default function AgentScheduleModal({ open, scheduledDateTime, setIsSchedulePending }) {
    const handleClose = () => {
        setIsSchedulePending(false);
    };

    return (
        <Modal
            open={open}
            footer={null}
            closable={true}
            maskClosable={true}
            onCancel={handleClose}
            centered
            width={440}
        >
            <div className="text-center px-6 py-6">
                <div
                    className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full
                       bg-linear-to-br from-blue-50 to-indigo-100
                       dark:from-slate-700 dark:to-slate-800
                       shadow-inner animate-pulse"
                >
                    <ClockCircleOutlined className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>

                <h2 className="text-xl font-semibold text-gray-800! dark:text-gray-100">
                    Secure Session Scheduled
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Your assigned session has not started yet.
                </p>

                <ModalSessionTimer expiresAt={scheduledDateTime} />

                {/* Footer Note */}
                <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                    Access will be enabled automatically at the scheduled time in accordance with
                    security protocols.
                </p>
            </div>
        </Modal>
    );
}
