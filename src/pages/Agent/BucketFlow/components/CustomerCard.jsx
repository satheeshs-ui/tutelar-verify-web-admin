// import { Card, Avatar, Popover, Button } from "antd";
// import { TooltipCellOrFirstObject } from "../../../../components/ui/TooltipCell";

// function CustomerCard({ customer, onPick }) {
//     const firstLetter = customer?.name?.charAt(0).toUpperCase();

//     const getPriorityButtonClass = (priority) => {
//         switch (priority) {
//             case "Urgent":
//                 return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0";
//             case "High":
//                 return "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0";
//             default:
//                 return "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-0";
//         }
//     };

//     const popoverContent = (
//         <div className="text-center">
//             <Button
//                 type="primary"
//                 size="small"
//                 onClick={() => {
//                     onPick();
//                 }}
//                 className={`${getPriorityButtonClass(customer?.priority)} text-white font-medium`}
//             >
//                 Pick
//             </Button>
//         </div>
//     );

//     return (
//         <div className="relative">
//             <Popover content={popoverContent} trigger="hover" placement="top">
//                 <Card hoverable className="w-40 shadow-sm relative z-10">
//                     <div className="p-2 flex items-center gap-3">
//                         <Avatar size={40} className="bg-blue-500! shrink-0">
//                             {firstLetter}
//                         </Avatar>

//                         <div className="flex flex-col min-w-0 flex-1">
//                             <span className="text-xs text-gray-500 font-medium">
//                                 {customer.caseId}
//                             </span>
//                             <span className="text-sm font-semibold text-gray-900 capitalize truncate">
//                                 <TooltipCellOrFirstObject device={customer} field="name" />
//                             </span>
//                         </div>
//                     </div>
//                 </Card>
//             </Popover>
//         </div>
//     );
// }

// export default CustomerCard;

import { Card, Avatar, Popover, Button, Tag } from "antd";
import { TooltipCellOrFirstObject } from "../../../../components/ui/TooltipCell";

function CustomerCard({ customer, onPick }) {
    const firstLetter = customer?.name?.charAt(0)?.toUpperCase();
    const formatTime = (isoTime) => {
        if (!isoTime) return "-";
        return new Date(isoTime).toLocaleString();
    };

    // const getPriorityColor = (priority) => {
    //     switch (priority) {
    //         case "Urgent":
    //             return "red";
    //         case "High":
    //             return "orange";
    //         default:
    //             return "green";
    //     }
    // };

    const getEntityColor = (entity) => {
        switch (entity?.toLowerCase()) {
            case "individual":
                return "blue";
            case "partnership":
                return "purple";
            default:
                return "default";
        }
    };

    const popoverContent = (
        <div className="w-64">
            <div className="mb-3">
                <p className="text-sm font-semibold text-gray-900 capitalize">{customer?.name}</p>
                <p className="text-xs text-gray-500">Case ID: {customer?.caseId}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-400">Scheduled</span>
                    <span className="text-gray-700 font-medium text-right">
                        {formatTime(customer?.scheduledDateTime)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Entity</span>
                    {customer?.entity ? (
                        <Tag color={getEntityColor(customer?.entity)} className="capitalize">
                            {customer?.entity}
                        </Tag>
                    ) : (
                        "-"
                    )}
                </div>
                {/* languages: {
                primary: data?.primaryLanguages,
                secondary: data?.secondaryLanguages,
            } */}
                <div className="">
                    <span className="text-gray-400">Primary Language</span>
                    {customer?.languages?.primary ? (
                        <p className="ml-3 pt-2">1.{customer?.languages?.primary}</p>
                    ) : (
                        <p className="ml-3 pt-2">-</p>
                    )}
                </div>
                <div className="">
                    <span className="text-gray-400 mb-3">Secondary Language</span>
                    <ul className="ml-3 pt-2">
                        {customer?.languages?.secondary.length > 0
                            ? customer?.languages?.secondary.map((item, i) => {
                                  return (
                                      <li key={i} className="mb-1">
                                          {i + 1}.{item}
                                      </li>
                                  );
                              })
                            : "-"}
                    </ul>
                </div>

                {/* <div className="flex justify-between items-center">
                    <span className="text-gray-400">Priority</span>
                    <Tag color={getPriorityColor(customer?.priority)}>
                        {customer?.priority || "Normal"}
                    </Tag>
                </div> */}
            </div>

            <Button
                type="primary"
                block
                size="small"
                onClick={onPick}
                className="bg-linear-to-r from-[#0f6f79] to-[#094e55] border-0 font-medium"
            >
                Pick Case
            </Button>
        </div>
    );

    return (
        <div className="relative">
            <Popover
                content={popoverContent}
                trigger="hover"
                placement="top"
                classNames={{ root: "fintech-popover" }}
            >
                <Card hoverable className="w-40 shadow-sm relative z-10">
                    <div className="p-2 flex items-center gap-3">
                        <Avatar size={40} className="bg-[#0f6f79]! shrink-0">
                            {firstLetter}
                        </Avatar>

                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs text-gray-500 font-medium">
                                {customer.caseId}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 capitalize truncate">
                                <TooltipCellOrFirstObject device={customer} field="name" from="" />
                            </span>
                        </div>
                    </div>
                </Card>
            </Popover>
        </div>
    );
}

export default CustomerCard;
