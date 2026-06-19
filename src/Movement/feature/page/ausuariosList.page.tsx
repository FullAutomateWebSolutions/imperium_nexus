import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Modal, Form, Input, Select, Popconfirm, message, Card } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios"; 
import { StandardTable } from "@/components/table/StandardTableSimples";

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

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get("http://localhost:3001/usuario", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Erro ao carregar usuários.");
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

      message.success("Usuário atualizado com sucesso!");
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsuarios();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Erro ao atualizar usuário.");
    }
  };

  const handleDelete = async (codusuario: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/usuarios/${codusuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success("Usuário removido com sucesso!");
      fetchUsuarios();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Erro ao remover usuário.");
    }
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
      key: "acoes",
      width: 180,
      render: (_: any, record: Usuario) => (
        <Space size="middle">

          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => handleEdit(record)}
          />
         <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(record.codusuario)}
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
    <Card title={<span><UserOutlined /> Controle Geral de Usuários</span>} style={{ borderRadius: 8 }}>
      <StandardTable 
        dataSource={usuarios} 
        columns={columns} 
        rowKey="codusuario" 
        loading={loading}
        bordered
      />
      <Modal
        title="Alterar Permissões e Dados do Usuário"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => { setIsModalOpen(false); setEditingUser(null); }}
        okText="Salvar"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
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
    </Card>
  );
};