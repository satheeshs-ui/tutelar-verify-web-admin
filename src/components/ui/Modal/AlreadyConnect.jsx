import { Modal } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function AlreadyConnect({ open }) {
    const navigate = useNavigate();

    const handleClose = () => {
        if (window.opener) {
            window.opener.postMessage("Exception", "*");
            window.close();
        } else {
            navigate("/case-bucket");
        }
    };
    return (
        <Modal open={open} footer={null} closable={false} maskClosable={false} centered width={440}>
            <div className="text-center px-6 py-6">
                <div
                    className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full 
          bg-linear-to-br from-blue-50 to-indigo-100
          dark:from-slate-700 dark:to-slate-800
          shadow-inner"
                >
                    <UserSwitchOutlined className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                    Session Currently in Progress
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    This call is already being handled by another agent. Please return to the
                    dashboard.
                </p>

                <button
                    onClick={handleClose}
                    className="cursor-pointer w-full bg-linear-to-b from-[#0f6f79] to-[#094e55] text-white! py-3 rounded-xl font-medium hover:opacity-90 transition"
                >
                    Return to Dashboard
                </button>
            </div>
        </Modal>
    );
}
