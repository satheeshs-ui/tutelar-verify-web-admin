import { Button } from "antd";
import ImageLoader from "./ImageLoader";

const CommonNoData = ({ message, describemessage, button }) => {
    return (
        <div className="flex justify-center py-6">
            <div className="flex flex-col items-center gap-2">
                <ImageLoader imageKey="NoDataIcon" />
                {message && (
                    <div className="text-[#0B1C20] text-[18px] font-[500] pt-6">{message}</div>
                )}
                {describemessage && (
                    <div className="text-[#6A7174] text-[14px] font-[400] w-90 pb-6">
                        {describemessage}
                    </div>
                )}
                {button && <div>{button} </div>}
            </div>
        </div>
    );
};

export default CommonNoData;
