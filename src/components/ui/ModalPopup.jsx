import { Modal } from "antd";

export default function ModalPopUp({ children, width, open, onCancel }) {
    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            centered
            width={width || 600}
            className="rounded-2xl"
        >
            {children}
        </Modal>
    );
}
