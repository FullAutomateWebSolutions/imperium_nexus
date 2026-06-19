import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useCard } from "../../hook/useCard";
import { Card as CardModel } from "../../model/moviment.model";
import { CardForm } from "../form/card.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";
import dayjs from "dayjs";

export const CardList = () => {
  const { listCard, deleteCard } = useCard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<CardModel | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const { data: cards, isLoading } = listCard({});

  const handleOpenForm = (mode: FormEditing, record: CardModel | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deleteCard.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Cartão removido com sucesso!" });
      }
    });
  };

  const columns = [
    { title: "Código", dataIndex: "codcartao", key: "codcartao", width: 100 },
    { title: "Tipo", dataIndex: "tipocartao", key: "tipocartao" },
    { title: "Descrição", dataIndex: "desccartao", key: "desccartao" },
    { title: "Status", dataIndex: "indativo", key: "indativo", render: (ativo: boolean) => (ativo ? "Ativo" : "Inativo") },
        {
          title: "Data Cr.",
          key: "datacriacao",
          width: "11%",
          align: "center" as const,
          dataIndex: "datacriacao",
          render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
        },
        {
          title: "Data Atu.",
          key: "dataatualizacao",
          width: "11%",
          align: "center" as const,
          dataIndex: "dataatualizacao",
          render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
        },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, record: CardModel) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir este cartão?" onConfirm={() => handleDelete(record.codcartao!)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Listagem de Cartões" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>Novo Cartão</Button>}>
      <StandardTable dataSource={Array.isArray(cards) ? cards : []} columns={columns} rowKey="codcartao" loading={isLoading} />
      <Modal title={formMode === "criar" ? "Novo Cartão" : "Editar Cartão"} open={isModalOpen} onCancel={handleCloseForm} footer={null} destroyOnClose width={650}>
        <CardForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};