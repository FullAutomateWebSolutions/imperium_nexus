import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { usePaymentMethod } from "../../hook/usePaymentMethod";
import { PaymentMethod } from "../../model/moviment.model";
import { PaymentMethodForm } from "../form/paymentMethod.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

export const PaymentMethodList = () => {
  const { listPaymentMethod, deletePaymentMethod } = usePaymentMethod();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<PaymentMethod | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const { data: methods, isLoading } = listPaymentMethod({});

  const handleOpenForm = (mode: FormEditing, record: PaymentMethod | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deletePaymentMethod.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Forma de pagamento removida!" });
      }
    });
  };

  const columns = [
    { title: "Código", dataIndex: "codformpag", key: "codformpag", width: 100 },
    { title: "Tipo", dataIndex: "tipoformpag", key: "tipoformpag" },
    { title: "Descrição", dataIndex: "descformpag", key: "descformpag" },
    { title: "Status", dataIndex: "indativo", key: "indativo", render: (ativo: boolean) => (ativo ? "Ativo" : "Inativo") },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, record: PaymentMethod) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir este método?" onConfirm={() => handleDelete(record.codformpag!)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Formas de Pagamento" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>Nova Forma</Button>}>
      <StandardTable dataSource={Array.isArray(methods) ? methods : []} columns={columns} rowKey="codformpag" loading={isLoading} />
      <Modal title={formMode === "criar" ? "Nova Forma de Pagamento" : "Editar Forma de Pagamento"} open={isModalOpen} onCancel={handleCloseForm} footer={null} destroyOnClose width={650}>
        <PaymentMethodForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};