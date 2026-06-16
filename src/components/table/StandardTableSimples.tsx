import { Table, TableProps, Typography } from "antd";
import { TablePaginationConfig } from "antd/lib/table";
import { ReactNode } from "react";

const { Text } = Typography;

interface StandardTableProps<T> extends TableProps<T> {
  loading?: boolean;
  emptyText?: ReactNode;
  pagination?: false | TablePaginationConfig;
}

const headerStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  padding: "4px 3px", 
};

export function StandardTable<T extends object>({
  dataSource,
  rowSelection,
  columns,
  loading = false,
  emptyText = "Nenhum registro encontrado.",
  pagination = false,
  ...rest
}: StandardTableProps<T>) {
  return (
    <Table<T>
      bordered
      style={{
        textAlign: "end",
        maxWidth: "100%",
      }}
      footer={() => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {`Total de registros: ${dataSource?.length ?? 0}`}
        </Text>
      )}
      rowKey={(record) => (record as any).id ?? JSON.stringify(record)}
      dataSource={dataSource}
      rowSelection={rowSelection}
      columns={columns?.map((col) => ({
        ...col,
        onHeaderCell: () => ({
          style: headerStyle,
        }),
        onCell: () => ({
          style: {
            padding: "6px 6px", 
            fontSize: "12px", 
          },
        }),
      }))}
      rowClassName={() => "compact-row"}
      loading={loading}
      pagination={pagination}
      locale={{ emptyText: <Text type="secondary">{emptyText}</Text> }}
      size="small"
      {...rest}
    />
  );
}
