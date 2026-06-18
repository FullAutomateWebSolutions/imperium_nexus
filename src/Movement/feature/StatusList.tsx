import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useStatus } from "../hook/useStatus";
import { Status } from "../model/moviment.model";
import { StatusForm } from "./status.form";
import { FormEditing } from "../../components/form/formConfig";

export const StatusList = () => {
  const { listStatus, deleteStatus } = useStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Status | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

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

  const columns = [
    { title: "Código", dataIndex: "codstatus", key: "codstatus", width: 100 },
    { title: "Status", dataIndex: "descstatus", key: "descstatus" },
    { title: "Descrição Completa", dataIndex: "desccompleta", key: "desccompleta" },
    { title: "Status", dataIndex: "indativo", key: "indativo", render: (ativo: boolean) => (ativo ? "Ativo" : "Inativo") },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, record: Status) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir este status?" onConfirm={() => handleDelete(record.codstatus)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Listagem de Status" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>Novo Status</Button>}>
      <Table dataSource={statusData} columns={columns} rowKey="codstatus" loading={isLoading} />
      <Modal title={formMode === "criar" ? "Novo Status" : "Editar Status"} open={isModalOpen} onCancel={handleCloseForm} footer={null} destroyOnClose width={650}>
        <StatusForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};