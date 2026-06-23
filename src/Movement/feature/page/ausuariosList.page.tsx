import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  notification,
  Grid,
  Tag,
  List,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface Usuario {
  codusuario: number;
  nome: string;
  email: string;
  role: "ADMIN" | "USER";
  indativo: boolean;
}

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/usuario", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
    } catch (error: any) {
      notification.error({ message: error.response?.data?.message || "Erro ao carregar usuários." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    form.setFieldsValue(usuario);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:3001/usuarios/${editingUser?.codusuario}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });

      notification.success({ message: "Usuário atualizado com sucesso!" });
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsuarios();
    } catch (error: any) {
      notification.error({ message: error.response?.data?.message || "Erro ao atualizar usuário." });
    }
  };

  const handleDelete = async (codusuario: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/usuarios/${codusuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: "Usuário removido com sucesso!" });
      fetchUsuarios();
    } catch (error: any) {
      notification.error({ message: error.response?.data?.message || "Erro ao remover usuário." });
    }
  };

  const RoleTag = ({ role }: { role: string }) => (
    <Tag color={role === "ADMIN" ? "magenta" : "blue"} style={{ fontWeight: "bold", margin: 0 }}>
      {role}
    </Tag>
  );

  const columns = [
    { title: "ID", dataIndex: "codusuario", key: "codusuario", width: 80 },
    { title: "Nome", dataIndex: "nome", key: "nome" },
    { title: "E-mail", dataIndex: "email", key: "email" },
    {
      title: "Perfil (Role)",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <RoleTag role={role} />,
    },
    {
      title: "Ações",
      key: "acoes",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Usuario) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(record.codusuario)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "16px 8px" : "0" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <Typography.Title level={isMobile ? 4 : 3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <UserOutlined /> Controle Geral de Usuários
        </Typography.Title>
      </div>

      {isMobile ? (
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={usuarios}
          renderItem={(item: Usuario) => (
            <List.Item
              key={item.codusuario}
              style={{ background: "#fff", padding: "12px 16px", marginBottom: 8, borderRadius: 8, border: "1px solid #f0f0f0" }}
              actions={[
                <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEdit(item)} />,
                <Popconfirm
                  key="delete"
                  title="Deletar?"
                  onConfirm={() => handleDelete(item.codusuario)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space size="small" align="center">
                    <span style={{ fontWeight: 600 }}>{item.nome}</span>
                    <RoleTag role={item.role} />
                  </Space>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
                    <Text type="secondary" ><b>ID:</b> {item.codusuario}</Text>
                    <Text type="secondary" >{item.email}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <StandardTable dataSource={usuarios} columns={columns} rowKey="codusuario" loading={loading} />
      )}

      <Modal
        title="Alterar Permissões e Dados do Usuário"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => { setIsModalOpen(false); setEditingUser(null); }}
        okText="Salvar"
        cancelText="Cancelar"
        destroyOnClose
        width={isMobile ? "100%" : 550}
        styles={{ body: { padding: isMobile ? "12px" : "24px" } }}
        centered={!isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: isMobile ? 8 : 20 }}>
          <Form.Item name="nome" label="Nome do Usuário" rules={[{ required: true, message: "Insira o nome" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email", message: "Insira um e-mail válido" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Nível de Acesso (Role)" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="USER">USER (Acesso Comum)</Select.Option>
              <Select.Option value="ADMIN">ADMIN (Controle Total)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};