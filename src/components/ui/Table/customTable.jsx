import React from "react";
import { Table } from "antd";
const CustomTable = ({ columns, data, rowKey, scroll, width, className, ...rest }) => {
    const resolvedRowKey = (record) =>
        typeof rowKey === "function" ? rowKey(record) : record[rowKey];

    return (
        <Table
            dataSource={data}
            pagination={false}
            scroll={{
                x: width ? width : scroll ? 1500 : undefined,
                y: data.length > 10 ? 700 : undefined,
            }}
            size="small"
            rowKey={resolvedRowKey}
            className={className}
            {...rest}
        >
            {columns?.map((col, index) => (
                <Table.Column
                    key={String(col.key ?? index)}
                    ellipsis={{ showTitle: true }}
                    {...col}
                />
            ))}
        </Table>
    );
};

export default CustomTable;
