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
  fontWeight: 600,
  padding: "6px 8px",
  backgroundColor: "#fafafa",
};

const cellStyle: React.CSSProperties = {
  padding: "6px 8px",
  fontSize: "12px",
  lineHeight: "1.4",
};

export function StandardTable<T extends object>({
  dataSource,
  rowSelection,
  columns,
  loading = false,
  emptyText = "Nenhum registro encontrado.",
  pagination = false,
  scroll,
  ...rest
}: StandardTableProps<T>) {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table<T>
        bordered
        size="small"
        style={{
          width: "100%",
        }}
        footer={() => (
          <div style={{ padding: "2px 4px" }}>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 500 }}>
              {`Total de registros encontrados: ${dataSource?.length ?? 0}`}
            </Text>
          </div>
        )}
        rowKey={(record) => (record as any).codusuario ?? (record as any).id ?? JSON.stringify(record)}
        dataSource={dataSource}
        rowSelection={rowSelection}
        
        columns={columns?.map((col) => ({
          ...col,
          onHeaderCell: () => ({
            style: {
              ...headerStyle,
              textAlign: col.align || "start", 
            },
          }),
          onCell: (record, rowIndex) => {
            const originalCellProps = col.onCell ? col.onCell(record, rowIndex) : {};
            return {
              ...originalCellProps,
              style: {
                ...cellStyle,
                textAlign: col.align || "start",
                ...originalCellProps.style,
              },
            };
          },
        }))}
        
        loading={loading}
        pagination={pagination}
        
        scroll={scroll ?? { x: "max-content" }}
        
        locale={{
          emptyText: (
            <div style={{ padding: "16px 0" }}>
              <Text type="secondary">{emptyText}</Text>
            </div>
          ),
        }}
        {...rest}
      />
    </div>
  );
}