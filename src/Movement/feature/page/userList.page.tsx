import { useState } from "react";
import { Button, Space, Popconfirm, notification, Modal, Card, Tag, Typography, Grid, Drawer, Flex, Divider } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useUser } from "../../hook/useUsers";
import { User } from "../../model/moviment.model";
import { UserForm } from "../form/user.form";
import { FormEditing } from "../../../components/form/formConfig";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

export const UserList = () => {
  const { listUser, deleteUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<FormEditing>("criar"); 

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const { data: UserData, isLoading } = listUser({});
  const usersDataSource = Array.isArray(UserData) ? UserData : [];

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
        notification.success({ 
          message: "Sucesso", 
          description: "Usuário removido com sucesso!" 
        });
      }
    });
  };

  const renderRoleTag = (role: string) => {
    const isAdmin = role?.toUpperCase() === "ADMIN";
    return (
      <Tag 
        color={isAdmin ? "red" : "blue"} 
        style={{ 
          fontWeight: 600, 
          borderRadius: "4px",
          padding: "2px 8px",
          margin: 0
        }}
      >
        {isAdmin ? "ADMINISTRADOR" : "USUÁRIO"}
      </Tag>
    );
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
      render: (nome: string) => <Text strong style={{ color: "#262626" }}>{nome}</Text>
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
      width: 140,
      render: (role: string) => renderRoleTag(role),
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: "#1890ff" }} />} 
            onClick={() => handleOpenForm("editar", record)} 
            title="Editar Usuário"
          />
          <Popconfirm 
            title="Excluir Usuário"
            description="Tem certeza que deseja remover este usuário permanentemente?"
            onConfirm={() => handleDelete(record.codusuario!)} 
            okText="Sim, excluir" 
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              title="Excluir Usuário"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cabeçalho unificado para Modal/Drawer
  const titleContent = (
    <Text strong style={{ fontSize: "16px" }}>
      {formMode === "criar" ? "Cadastrar Novo Usuário" : "Atualizar Dados do Usuário"}
    </Text>
  );

  return (
    <div style={{ padding: isMobile ? "8px" : "0px" }}>
      {/* Topbar Adaptativo */}
      <Flex justify="space-between" align="center" style={{ marginBottom: isMobile ? 16 : 24 }} wrap="wrap" gap="12px">
        <div>
          <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Gestão de Usuários</Title>
          <Text type="secondary" style={{ fontSize: isMobile ? "13px" : "14px" }}>
            Administre perfis de acesso, permissões e dados das credenciais.
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => handleOpenForm("criar")}
          style={{ borderRadius: "6px", fontWeight: 500 }}
          block={isMobile}
        >
          Novo Usuário
        </Button>
      </Flex>

      {isMobile ? (
        // Grid de Cards Operacionais Mobile
        <Flex vertical gap="12px" style={{ marginTop: "8px" }}>
          {usersDataSource.length === 0 ? (
            <Card bodyStyle={{ padding: 24, textAlign: "center" }}>
              <Text type="secondary">Nenhum usuário cadastrado.</Text>
            </Card>
          ) : (
            usersDataSource.map((user: User) => (
              <Card 
                key={user.codusuario}
                size="small"
                style={{ borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.01)" }}
                actions={[
                  <Button 
                    type="text" 
                    icon={<EditOutlined style={{ color: "#1890ff" }} />} 
                    onClick={() => handleOpenForm("editar", user)}
                  >
                    Editar
                  </Button>,
                  <Popconfirm 
                    title="Excluir Usuário?"
                    onConfirm={() => handleDelete(user.codusuario!)} 
                    okText="Sim" 
                    cancelText="Não"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Excluir
                    </Button>
                  </Popconfirm>
                ]}
              >
                <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                  <Space size="small">
                    <UserOutlined style={{ color: "#8c8c8c" }} />
                    <Text strong style={{ fontSize: "14px" }}>{user.nome}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: "12px" }}>#{user.codusuario}</Text>
                </Flex>
                
                <Flex align="center" gap="8px" style={{ marginBottom: 12 }}>
                  <MailOutlined style={{ color: "#bfbfbf", fontSize: "13px" }} />
                  <Text type="secondary" style={{ fontSize: "13px" }} ellipsis>{user.email}</Text>
                </Flex>

                <Divider style={{ margin: "8px 0" }} />
                
                <Flex justify="space-between" align="center" style={{ paddingTop: "2px" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>Perfil de Acesso:</Text>
                  {renderRoleTag(user.role)}
                </Flex>
              </Card>
            ))
          )}
        </Flex>
      ) : (
        // Renderização para Desktop padrão
        <Card bordered={false} style={{ background: "transparent" }} bodyStyle={{ padding: 0 }}>
          <StandardTable 
            dataSource={usersDataSource} 
            columns={columns} 
            rowKey="codusuario" 
            loading={isLoading} 
          />
        </Card>
      )}

      {/* Container Adaptativo para o Formulário */}
      {isMobile ? (
        <Drawer
          title={titleContent}
          placement="right"
          onClose={handleCloseForm}
          open={isModalOpen}
          width="100%"
          destroyOnClose
          styles={{ body: { padding: "16px" }, mask: { backdropFilter: "blur(4px)" } }}
        >
          <UserForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
        </Drawer>
      ) : (
        <Modal 
          title={titleContent} 
          open={isModalOpen} 
          onCancel={handleCloseForm} 
          footer={null} 
          destroyOnClose 
          width={550}
          centered
          styles={{ mask: { backdropFilter: "blur(4px)" } }}
        >
          <div style={{ paddingTop: "12px" }}>
            <UserForm formEditing={formMode} data={selectedData as any} onClose={handleCloseForm} />
          </div>
        </Modal>
      )}
    </div>
  );
};