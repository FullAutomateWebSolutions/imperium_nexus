import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useCategory } from "../../hook/useCategory";
import { Category } from "../../model/moviment.model";
import { CategoryForm } from "../form/category.form";
import { FormEditing } from "../../../components/form/formConfig";
import dayjs from "dayjs";
import { StandardTable } from "@/components/table/StandardTableSimples";

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

  const handleDelete = (record: Category) => {
    const id = record.codcategoria;

    if (id === undefined || id === null) {
      notification.error({ message: "ID da categoria inválido." });
      return;
    }

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
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => handleOpenForm("editar", record)}
          />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(record)}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>
          Nova Categoria
        </Button>
      }
    >
      <StandardTable
        dataSource={Array.isArray(categories) ? categories : []}
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
        <CategoryForm formEditing={formMode} data={selectedData as Category} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};