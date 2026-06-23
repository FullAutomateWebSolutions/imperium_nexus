import React, { useState, useMemo } from "react";
import { Form, Input, Button, Card, Typography, message, Grid } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import { RestHttpService } from "@/api/axios";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  
  const isMobile = screens.md === false;

  // Evita a re-instanciação do serviço HTTP a cada renderização do componente
  const api = useMemo(() => {
    const httpService = new RestHttpService();
    return {
      client: httpService.getHttpInstance(),
      translateError: httpService.translateError.bind(httpService)
    };
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.client.post("/auth/register", {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
      });

      message.success("Novo usuário cadastrado com sucesso!");
      form.resetFields(); // Limpa o formulário para permitir novos cadastros em sequência
    } catch (error: any) {
      api.translateError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: isMobile ? "0 auto" : "12px 0",
      padding: isMobile ? "0" : "4px" 
    }}>
      {/* Cabeçalho Operacional Alinhado com o Sistema */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>
          Prover Novo Usuário
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? "13px" : "14px" }}>
          Registre novas credenciais de acesso para funcionários ou administradores no sistema.
        </Text>
      </div>

      <Card 
        bordered={false} 
        style={{ 
          borderRadius: "8px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          borderTop: "4px solid #1890ff"
        }}
        bodyStyle={{ padding: isMobile ? "20px 16px" : "28px" }}
      >
        <Form 
          form={form} 
          name="register_form" 
          layout="vertical" 
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="nome"
            label={<Text strong style={{ fontSize: "13px" }}>Nome Completo</Text>}
            rules={[
              { required: true, message: "Por favor, insira o nome completo!" },
              { min: 3, message: "O nome deve ter no mínimo 3 caracteres!" }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="Ex: João da Silva" 
              size="large" 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text strong style={{ fontSize: "13px" }}>E-mail de Acesso</Text>}
            rules={[
              { required: true, message: "Por favor, insira o e-mail!" },
              { type: "email", message: "Insira um e-mail válido!" }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="nome.sobrenome@faws.com" 
              size="large" 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            name="senha"
            label={<Text strong style={{ fontSize: "13px" }}>Senha Provisória</Text>}
            rules={[
              { required: true, message: "Por favor, defina uma senha!" },
              { min: 6, message: "A senha deve ter pelo menos 6 caracteres!" }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="Mínimo de 6 caracteres" 
              size="large" 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item
            name="confirmarSenha"
            label={<Text strong style={{ fontSize: "13px" }}>Confirmar Senha</Text>}
            dependencies={["senha"]}
            rules={[
              { required: true, message: "Por favor, confirme a senha definida!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("senha") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As duas senhas informadas não coincidem!"));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />} 
              placeholder="Repita a senha provisória" 
              size="large" 
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              icon={<UserAddOutlined />}
              block={isMobile}
              style={{ 
                borderRadius: "6px", 
                fontWeight: 600, 
                paddingLeft: "32px", 
                paddingRight: "32px",
                height: "42px"
              }}
            >
              Concluir Cadastro
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};