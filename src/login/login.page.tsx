
import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom"; 
import { RestHttpService } from "@/api/axios";


const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const httpService = new RestHttpService();
  const api = httpService.getHttpInstance();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", values);
      console.log(response)
      localStorage.setItem("faws:token", response.data.token);
      localStorage.setItem("faws:user", JSON.stringify(response.data.user));
      message.success(`Bem-vindo de volta, ${response.data.user.nome}!`);
      navigate("/movimentacao");
    } catch (error: any) {
      httpService.translateError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>FAWS Financeiro</Title>
          <Text type="secondary">Faça login para gerenciar suas movimentações</Text>
        </div>

        <Form name="login_form" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: "Por favor, insira seu e-mail!" },
              { type: "email", message: "Insira um e-mail válido!" }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="exemplo@email.com" size="large" />
          </Form.Item>

          <Form.Item
            name="senha"
            label="Senha"
            rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Sua senha" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        {/* <div style={{ textAlign: "center" }}>
          Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </div> */}
      </Card>
    </div>
  );
};