import CommonNoData from "../CommonNoData";

const UniversalTable = ({
    columns,
    data,
    rowKey,
    maxHeight = "500px",
    nodatamessage,
    describemessage,
    // button,
}) => {
    return (
        <div className="w-full rounded-[10px] border border-[#CDD0D1] bg-white">
            <div className="w-full overflow-x-auto overflow-y-auto" style={{ maxHeight }}>
                <table className="min-w-max table-auto table-container">
                    <thead className="sticky top-0 z-20 bg-[#F3F3F3] capitalize">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className="overall-table-text text-[14px] px-4 py-3 text-sm font-normal! text-[#6A7174] border-b border-gray-200 text-left whitespace-nowrap"
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {!data?.length ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-6 text-center text-gray-500 overall-table-text text-[14px]"
                                >
                                    <CommonNoData
                                        message={nodatamessage || "No Data Found"}
                                        describemessage={describemessage}
                                        // button={button}
                                    />
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={row[rowKey] || index}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`${col.className} px-4 py-3 overall-table-text text-[14px] whitespace-nowrap ${
                                                col.align === "right"
                                                    ? "text-right"
                                                    : col.align === "center"
                                                      ? "text-center"
                                                      : "text-left"
                                            }`}
                                        >
                                            {col.render
                                                ? col.render(row, index)
                                                : row[col.dataIndex || ""]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UniversalTable;
