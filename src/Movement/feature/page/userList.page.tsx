import { useState } from "react";
import { Table, Button, Space, Popconfirm, notification, Modal, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useUser } from "../../hook/useUsers";
import { User } from "../../model/moviment.model";
import { UserForm } from "../form/user.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

export const UserList = () => {
  const { listUser, deleteUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar"); 

  const { data: UserData, isLoading } = listUser({});

  const handleOpenForm = (mode: FormEditing, record: User | null = null) => {
    setFormMode(mode);
    setSelectedData(record);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleDelete = (id: number) => {
    deleteUser.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "User removido com sucesso!" });
      }
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "codusuario",
      key: "codusuario",
      width: 80,
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Perfil (Role)",
      dataIndex: "role",
      key: "role",
      // render: (role: string) => (
      //   <Tag color={role === "ADMIN" ? "red" : "blue"} style={{ fontWeight: "bold" }}>
      //     {role}
      //   </Tag>
      // ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => handleOpenForm("editar", record)} />
          <Popconfirm title="Excluir este User?" onConfirm={() => handleDelete(record.codusuario!)} okText="Sim" cancelText="Não">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Listagem de User" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm("criar")}>Novo User</Button>}>
      <StandardTable dataSource={Array.isArray(UserData) ? UserData : []} columns={columns} rowKey="codusuario" loading={isLoading} />
      <Modal title={formMode === "criar" ? "Novo User" : "Editar User"} open={isModalOpen} onCancel={handleCloseForm} footer={null} destroyOnClose width={650}>
        <UserForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
      </Modal>
    </Card>
  );
};