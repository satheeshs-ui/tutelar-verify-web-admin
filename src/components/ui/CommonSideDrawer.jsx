import React from "react";
import { Drawer } from "antd";
import ImageLoader from "./ImageLoader";
// import ImageLoader from "../ImageLoader"; // adjust path if needed

const CommonSideDrawer = ({
    open,
    onClose,
    title,
    children,
    width = 600,
    placement = "right",
    footer = null,
    closable = false,
    maskClosable = true,
    destroyOnClose = true,
    closeIcon = true,
    extra = null,
    className = "",
}) => {
    return (
        <Drawer
            open={open}
            zIndex={9999}
            onClose={onClose}
            placement={placement}
            width={width}
            closable={closable}
            maskClosable={maskClosable}
            destroyOnClose={destroyOnClose}
            className={className}
            title={
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        <p className="text-[#0B1C20] text-[18px] font-medium m-0">{title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {extra}
                        {closeIcon && (
                            <div className="cursor-pointer" onClick={onClose}>
                                <ImageLoader imageKey={"closeIcon"} />
                            </div>
                        )}
                    </div>
                </div>
            }
            footer={footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
            styles={{
                body: {
                    padding: "20px",
                },
                header: {
                    padding: "16px 20px",
                    borderBottom: "1px solid #E5E7EB",
                },
                footer: {
                    padding: "16px 20px",
                    borderTop: "1px solid #E5E7EB",
                },
            }}
        >
            {children}
        </Drawer>
    );
};

export default CommonSideDrawer;
