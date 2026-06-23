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
  BankOutlined,
} from "@ant-design/icons";

import { useAccount } from "../../hook/useAccount";
import { Account } from "../../model/moviment.model";
import { AccountForm } from "../form/account.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export const AccountList = () => {
  const { listAccount, deleteAccount } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Account | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

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

  const StatusTag = ({ active }: { active: boolean }) => (
    <Tag color={active ? "green" : "red"} style={{ margin: 0 }}>
      {active ? "Ativo" : "Inativo"}
    </Tag>
  );

  const columns = [
    { title: "Código", dataIndex: "codconta", key: "codconta", width: 100 },
    { title: "Tipo", dataIndex: "tipoconta", key: "tipoconta" },
    { title: "Descrição", dataIndex: "descconta", key: "descconta" },
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
      render: (_: any, record: Account) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir esta conta?" onConfirm={() => handleDelete(record.codconta!)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const safeAccounts = Array.isArray(accounts) ? accounts : [];

  return (
    <div style={{ padding: isMobile ? "16px 8px" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          Listagem de Contas
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>
          {!isMobile && "Nova Conta"}
        </Button>
      </div>

      {isMobile ? (
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={safeAccounts}
          renderItem={(item: Account) => (
            <List.Item
              key={item.codconta}
              style={{ background: "#fff", padding: "12px 16px", marginBottom: 8, borderRadius: 8, border: "1px solid #f0f0f0" }}
              actions={[
                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", item)} />,
                <Popconfirm key="delete" title="Excluir?" onConfirm={() => handleDelete(item.codconta!)} okText="Sim" cancelText="Não">
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ background: "#e6fffb", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center" }}>
                    <BankOutlined style={{ color: "#13c2c2", fontSize: 18 }} />
                  </div>
                }
                title={
                  <Space size="small" align="center">
                    <span style={{ fontWeight: 600 }}>{item.descconta}</span>
                    <StatusTag active={!!item.indativo} />
                  </Space>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Text type="secondary"><b>Cód:</b> {item.codconta} | <b>Tipo:</b> {item.tipoconta}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <StandardTable dataSource={safeAccounts} columns={columns} rowKey="codconta" loading={isLoading} />
      )}

      <Modal
        title={formMode === "criar" ? "Nova Conta" : "Editar Conta"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : 650}
        styles={{ body: { padding: isMobile ? "12px" : "24px" } }}
        centered={!isMobile}
      >
        <AccountForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
};