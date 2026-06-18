import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useCategory } from "../hook/useCategory";
import { Category } from "../model/moviment.model";
import { CategoryForm } from "./category.form";
import { FormEditing } from "../../components/form/formConfig";

export const CategoryList = () => {
  const { listCategory, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  // Busca os dados (passando objeto vazio se não houver filtros)
  const { data: categories, isLoading } = listCategory({});

  const handleOpenForm = (mode: FormEditing, record: Category | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deleteCategory.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Categoria removida com sucesso!" });
      },
      onError: () => {
        notification.error({ message: "Erro ao remover categoria." });
      }
    });
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "codcategoria",
      key: "codcategoria",
      width: 100,
    },
    {
      title: "Descrição",
      dataIndex: "desccategoria",
      key: "desccategoria",
    },
    {
      title: "Status",
      dataIndex: "indativo",
      key: "indativo",
      width: 120,
      render: (ativo: boolean) => (ativo ? "Ativo" : "Inativo"),
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: "#1890ff" }} />} 
            onClick={() => handleOpenForm("editar", record)}
          />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(record.codcategoria)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Listagem de Categorias" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("editar")}>
          Nova Categoria
        </Button>
      }
    >
      <Table 
        dataSource={categories} 
        columns={columns} 
        rowKey="codcategoria" 
        loading={isLoading}
      />

      <Modal
        title={formMode === "criar" ? "Nova Categoria" : "Editar Categoria"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={650}
      >
        <CategoryForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};