import React, { useState } from "react";
import { Collapse } from "antd";
import { ChevronDown } from "lucide-react";
import NoDataMessage from "../../components/ui/NoMessage";

const { Panel } = Collapse;

const AgentPermissionSummary = ({ menuList }) => {
    // const navigate = useNavigate();
    const [activeKeys, setActiveKeys] = useState([]);
    // const [isLoader, setIsLoader] = useState(false);

    const enabledMenus = menuList?.filter((menu) => menu.enabled);

    // const handleSubmit = () => {
    //     if (!state.name || !state.email || !state.mobile || !state.roleId) {
    //         showFailure("Please fill all required fields");
    //         return;
    //     }

    //     const payload = {
    //         name: state.name,
    //         email: state.email,
    //         mobile: state.mobile,
    //         roleId: state.roleId,
    //     };

    //     setIsLoader(true);

    //     const apiCall = userId
    //         ? ApiCall.patch(`agents/${userId}`, payload)
    //         : ApiCall.post("agents", payload);

    //     apiCall.then((response) => {
    //         setIsLoader(false);
    //         if (response?.success) {
    //             showSuccess(response?.message);
    //             navigate(-1);
    //         } else {
    //             showFailure(response?.message);
    //         }
    //     });
    // };

    return (
        <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-xl">
                <h1 className="text-[15px] font-semibold text-[#111928]">Permissions Given For</h1>
                <p className="text-[12px] text-[#4A5565] m-0!">Role based access summary</p>
            </div>

            {enabledMenus?.length ? (
                <div className="mt-4 min-h-[600px] max-h-[600px] overflow-y-auto px-4">
                    <Collapse
                        ghost
                        activeKey={activeKeys}
                        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
                        expandIcon={() => null}
                    >
                        {enabledMenus.map((parent) => {
                            const isOpen = activeKeys.includes(parent.menuId);

                            return (
                                <Panel
                                    key={parent.menuId}
                                    header={
                                        <div className="flex justify-between items-center px-3 py-2 border rounded-xl bg-white">
                                            <div>
                                                <h3 className="text-sm font-semibold">
                                                    {parent.menuName}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {parent.childMenu?.length || 0} permissions
                                                </p>
                                            </div>

                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform ${
                                                    isOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </div>
                                    }
                                >
                                    <div className="pl-3 space-y-2">
                                        {parent.childMenu?.map((child) => (
                                            <div
                                                key={child.menuId}
                                                className="text-sm text-gray-600 capitalize"
                                            >
                                                {child.menuName}
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            );
                        })}
                    </Collapse>
                </div>
            ) : (
                <div className="min-h-[600px] flex items-center justify-center">
                    <NoDataMessage
                        isNeedIcon={false}
                        contentOne="No Permissions Found"
                        contentTwo="Select a role to view permissions."
                    />
                </div>
            )}

            {/* <div className="flex justify-end gap-2 p-4">
                <PrimaryButton label="Cancel" onNotify={() => navigate(-1)} />
                <PrimaryButton
                    label="Submit"
                    htmlType="submit"
                    isLoader={isLoader}
                    onNotify={handleSubmit}
                />
            </div> */}
        </div>
    );
};

export default AgentPermissionSummary;
