import { useState } from "react";
import {
  Button,
  Space,
  Popconfirm,
  notification,
  Modal,
  Grid,
  Tag,
  List,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { useStatus } from "../../hook/useStatus";
import { Status } from "../../model/moviment.model";
import { StatusForm } from "../form/status.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export const StatusList = () => {
  const { listStatus, deleteStatus } = useStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Status | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const { data: statusData, isLoading } = listStatus({});

  const handleOpenForm = (mode: FormEditing, record: Status | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deleteStatus.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Status removido com sucesso!" });
      }
    });
  };

  const StatusTag = ({ active }: { active: boolean }) => (
    <Tag color={active ? "green" : "red"} style={{ margin: 0 }}>
      {active ? "Ativo" : "Inativo"}
    </Tag>
  );

  const columns = [
    { title: "Código", dataIndex: "codstatus", key: "codstatus", width: 100 },
    { title: "Status", dataIndex: "descstatus", key: "descstatus" },
    { title: "Descrição Completa", dataIndex: "desccompleta", key: "desccompleta" },
    {
      title: "Status",
      dataIndex: "indativo",
      key: "indativo",
      width: 120,
      render: (ativo: boolean) => <StatusTag active={ativo} />,
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Status) => (
        <Space >
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir este status?" onConfirm={() => handleDelete(record.codstatus!)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const safeStatusData = Array.isArray(statusData) ? statusData : [];

  return (
    <div style={{ padding: isMobile ? "16px 8px" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          Listagem de Status
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>
          {!isMobile && "Novo Status"}
        </Button>
      </div>

      {isMobile ? (
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={safeStatusData}
          renderItem={(item: Status) => (
            <List.Item
              key={item.codstatus}
              style={{ background: "#fff", padding: "12px 16px", marginBottom: 8, borderRadius: 8, border: "1px solid #f0f0f0" }}
              actions={[
                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", item)} />,
                <Popconfirm key="delete" title="Excluir?" onConfirm={() => handleDelete(item.codstatus!)} okText="Sim" cancelText="Não">
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ background: "#f6ffed", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center" }}>
                    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 18 }} />
                  </div>
                }
                title={
                  <Space  align="center">
                    <span style={{ fontWeight: 600 }}>{item.descstatus}</span>
                    <StatusTag active={!!item.indativo} />
                  </Space>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Text type="secondary" ><b>Cód:</b> {item.codstatus}</Text>
                    {item.desccompleta && (
                      <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                        {item.desccompleta}
                      </Text>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <StandardTable dataSource={safeStatusData} columns={columns} rowKey="codstatus" loading={isLoading} />
      )}

      <Modal
        title={formMode === "criar" ? "Novo Status" : "Editar Status"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : 650}
        styles={{ body: { padding: isMobile ? "12px" : "24px" } }}
        centered={!isMobile}
      >
        <StatusForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
};