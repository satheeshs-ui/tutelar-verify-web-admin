import React from "react";
import { Drawer, Empty } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Timeline from "./Timeline";

const CaseLogs = ({ open, onClose, items = [] }) => {
    const hasData = Array.isArray(items) && items.length > 0;

    return (
        <Drawer
            placement="right"
            zIndex={9999}
            open={open}
            onClose={onClose}
            size={500}
            destroyOnHidden
            closeIcon={null}
            rootClassName="filter-drawer"
            title={
                <div className="flex justify-between items-center w-full">
                    <span className="text-lg font-semibold text-[#111928]">Timeline</span>
                    <CloseOutlined
                        onClick={onClose}
                        className="cursor-pointer text-gray-500 hover:text-black"
                    />
                </div>
            }
        >
            {hasData ? (
                <Timeline items={items} />
            ) : (
                <div className="flex items-center justify-center h-full py-10">
                    <Empty description="No History Found" />
                </div>
            )}
        </Drawer>
    );
};

export default CaseLogs;
