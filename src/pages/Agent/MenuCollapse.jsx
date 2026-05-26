import React from "react";
import { Collapse, Checkbox, Radio } from "antd";
import { ChevronDown } from "lucide-react";

const MenuCollapse = ({ menuList = [], onChildToggle, onAccessChange }) => {
    const [activeKeys, setActiveKeys] = React.useState([]);

    const items = menuList.map((parent, pIndex) => {
        const childMenus = parent?.childMenu || [];

        return {
            key: parent.menuId,
            label: (
                <div
                    className={`
            ${parent.enabled ? "figma-row-active" : "figma-row-default"}
            flex items-center justify-between
            w-full px-4 py-4
            rounded-lg border border-[#E5E7EB]
            bg-[#F8FAFF]
          `}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#111928]">
                            {parent.menuName}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-2 py-0.5 text-xs rounded-md bg-[#E0E7FF] text-[#4338CA]">
                            {childMenus.length}
                        </div>

                        <ChevronDown
                            size={18}
                            className={`text-gray-500 transition-transform duration-200 ${
                                activeKeys.includes(parent.menuId) ? "rotate-180" : ""
                            }`}
                        />
                    </div>
                </div>
            ),
            children: (
                <div className="pl-6 mt-1">
                    {childMenus.map((child, cIndex) => (
                        <div key={child.menuId} className="py-3">
                            <Checkbox
                                checked={child.enabled}
                                disabled
                                onChange={(e) => onChildToggle(pIndex, cIndex, e.target.checked)}
                            >
                                <span className="capitalize text-[13px] text-[#111928]">
                                    {child.menuName}
                                </span>
                            </Checkbox>

                            {child.enabled && (
                                <Radio.Group
                                    className="pl-6 ml-4 mt-2 flex gap-6"
                                    value={child.access}
                                    disabled
                                    onChange={(e) => onAccessChange(pIndex, cIndex, e.target.value)}
                                >
                                    <Radio value="read">Read</Radio>
                                    <Radio value="readWrite">Read & Write</Radio>
                                </Radio.Group>
                            )}

                            <hr className="border-t border-[#E5E7EB] mt-4" />
                        </div>
                    ))}
                </div>
            ),
        };
    });

    return (
        <Collapse
            activeKey={activeKeys}
            onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
            expandIcon={() => null}
            className="bg-transparent figma-collapse"
            items={items}
        />
    );
};

export default MenuCollapse;
