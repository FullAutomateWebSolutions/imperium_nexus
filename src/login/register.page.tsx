import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom"; 
import { RestHttpService } from "@/api/axios";

const { Title, Text } = Typography;

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const httpService = new RestHttpService();
  const api = httpService.getHttpInstance();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
      });

      message.success("Usuário cadastrado com sucesso! Redirecionando para o login...");
      
      // setTimeout(() => {
      //   navigate("/login"); 
      // }, 1500);
    } catch (error: any) {
      httpService.translateError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
    // style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Criar Conta</Title>
          <Text type="secondary">Cadastre-se para começar o controle financeiro</Text>
        </div>

        <Form form={form} name="register_form" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="nome"
            label="Nome Completo"
            rules={[
              { required: true, message: "Por favor, insira seu nome completo!" },
              { min: 3, message: "O nome deve ter no mínimo 3 caracteres!" }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="João da Silva" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: "Por favor, insira seu e-mail!" },
              { type: "email", message: "Insira um e-mail válido!" }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="exemplo@email.com" size="large" />
          </Form.Item>

          <Form.Item
            name="senha"
            label="Senha"
            rules={[
              { required: true, message: "Por favor, insira sua senha!" },
              { min: 6, message: "A senha deve ter pelo menos 6 caracteres!" }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Crie uma senha forte" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmarSenha"
            label="Confirmar Senha"
            dependencies={["senha"]}
            rules={[
              { required: true, message: "Por favor, confirme sua senha!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("senha") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As duas senhas não coincidem!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Repita a senha" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Cadastrar
            </Button>
          </Form.Item>
        </Form>

        {/* <div style={{ textAlign: "center" }}>
          Já possui uma conta? <Link to="/login">Faça Login</Link>
        </div> */}
      </Card>
    </div>
  );
};