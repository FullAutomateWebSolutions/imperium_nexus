import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAccount } from "../hook/useAccount";
import { Account } from "../model/moviment.model";
import { AccountForm } from "./account.form";
import { FormEditing } from "../../components/form/formConfig";

export const AccountList = () => {
  const { listAccount, deleteAccount } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Account | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const { data: accounts, isLoading } = listAccount({});

  const handleOpenForm = (mode: FormEditing, record: Account | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deleteAccount.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Conta removida com sucesso!" });
      }
    });
  };

  const columns = [
    { title: "Código", dataIndex: "codconta", key: "codconta", width: 100 },
    { title: "Tipo", dataIndex: "tipoconta", key: "tipoconta" },
    { title: "Descrição", dataIndex: "descconta", key: "descconta" },
    { 
      title: "Status", 
      dataIndex: "indativo", 
      key: "indativo",
      render: (ativo: boolean) => (ativo ? "Ativo" : "Inativo") 
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, record: Account) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir esta conta?" onConfirm={() => handleDelete(record.codconta)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Listagem de Contas" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>Nova Conta</Button>}>
      <Table dataSource={accounts} columns={columns} rowKey="codconta" loading={isLoading} />
      <Modal title={formMode === "criar" ? "Nova Conta" : "Editar Conta"} open={isModalOpen} onCancel={handleCloseForm} footer={null} destroyOnClose width={650}>
        <AccountForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};