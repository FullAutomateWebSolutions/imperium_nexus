import { useState } from "react";
import dayjs from "dayjs";
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
  FolderOutlined,
} from "@ant-design/icons";

import { useCategory } from "../../hook/useCategory";
import { Category } from "../../model/moviment.model";
import { CategoryForm } from "../form/category.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export const CategoryList = () => {
  const { listCategory, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar");

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

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

  const formatDate = (date: string | undefined) =>
    date ? dayjs(date).format("DD/MM/YYYY") : "-";

  const StatusTag = ({ active }: { active: boolean }) => (
    <Tag color={active ? "green" : "red"} style={{ margin: 0 }}>
      {active ? "Ativo" : "Inativo"}
    </Tag>
  );

  const columns = [
    { title: "Código", dataIndex: "codcategoria", key: "codcategoria", width: 100 },
    { title: "Descrição", dataIndex: "desccategoria", key: "desccategoria" },
    {
      title: "Status",
      dataIndex: "indativo",
      key: "indativo",
      width: 120,
      render: (ativo: boolean) => <StatusTag active={ativo} />,
    },
    {
      title: "Data Cr.",
      dataIndex: "datacriacao",
      key: "datacriacao",
      width: "11%",
      align: "center" as const,
      render: formatDate,
    },
    {
      title: "Data Atu.",
      dataIndex: "dataatualizacao",
      key: "dataatualizacao",
      width: "11%",
      align: "center" as const,
      render: formatDate,
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenForm("editar", record)}
          />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(record)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div style={{ padding: isMobile ? "16px 8px" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
          Listagem de Categorias
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>
          {!isMobile && "Nova Categoria"}
        </Button>
      </div>

      {isMobile ? (
        <List
          loading={isLoading}
          itemLayout="horizontal"
          dataSource={safeCategories}
          renderItem={(item: Category) => (
            <List.Item
              key={item.codcategoria}
              style={{ background: "#fff", padding: "12px 16px", marginBottom: 8, borderRadius: 8, border: "1px solid #f0f0f0" }}
              actions={[
                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleOpenForm("editar", item)} />,
                <Popconfirm
                  key="delete"
                  title="Deletar?"
                  onConfirm={() => handleDelete(item)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ background: "#f9f0ff", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center" }}>
                    <FolderOutlined style={{ color: "#722ed1", fontSize: 18 }} />
                  </div>
                }
                title={
                  <Space size="small" align="center">
                    <span style={{ fontWeight: 600 }}>{item.desccategoria}</span>
                    <StatusTag active={!!item.indativo} />
                  </Space>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Text type="secondary" ><b>Cód:</b> {item.codcategoria}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>Criado em: {formatDate(item.datacriacao)}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <StandardTable dataSource={safeCategories} columns={columns} rowKey="codcategoria" loading={isLoading} />
      )}

      <Modal
        title={formMode === "criar" ? "Nova Categoria" : "Editar Categoria"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : 650}
        styles={{ body: { padding: isMobile ? "12px" : "24px" } }}
        centered={!isMobile}
      >
        <CategoryForm formEditing={formMode} data={selectedData as Category} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
};