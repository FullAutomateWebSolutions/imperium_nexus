import React, { useState, useMemo } from "react";
import { Form, Input, Button, Typography, message, Grid } from "antd";
import { MailOutlined, LockOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 
import { RestHttpService } from "@/api/axios";
import logo from "../../public/assets/Frame.svg";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  
  const isMobile = screens.md === false;

  // Evita a re-instanciação do serviço HTTP a cada render do componente
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
      const response = await api.client.post("/auth/login", values);
      
      localStorage.setItem("faws:token", response.data.token);
      localStorage.setItem("faws:user", JSON.stringify(response.data.user));
      
      message.success(`Bem-vindo de volta, ${response.data.user.nome}!`);
      navigate("/movimentacao");
    } catch (error: any) {
      api.translateError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      backgroundColor: "#f0f2f5",
      overflow: "hidden"
    }}>
      {/* 1. PAINEL LATERAL ESQUERDO (Apenas para Desktop/Tablet) */}
      {!isMobile && (
        <div style={{
          flex: "1 1 50%",
          background: "linear-gradient(135deg, #001529 0%, #002140 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          color: "#fff"
        }}>
          <div style={{ maxWidth: "420px", textAlign: "center" }}>
            <img 
              src={logo} 
              alt="Logo FAWS" 
              width="64" 
              height="64" 
              style={{ marginBottom: "24px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.15))" }} 
            />
            <Title level={1} style={{ color: "#fff", margin: "0 0 16px 0", fontWeight: 700, letterSpacing: "-0.5px" }}>
              FAWS Financeiro
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: "1.6" }}>
              Otimize sua gestão de fluxo de caixa, controle despesas, receitas e organize planos de conta de forma inteligente.
            </Text>
          </div>
        </div>
      )}

      {/* 2. ÁREA DO FORMULÁRIO DE LOGIN */}
      <div style={{
        flex: isMobile ? "1 1 100%" : "1 1 50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "20px" : "40px",
        backgroundColor: "#ffffff"
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          
          {/* Cabeçalho do Form (Mostra logo reduzida no Mobile) */}
          <div style={{ marginBottom: "32px", textAlign: isMobile ? "center" : "left" }}>
            {isMobile && (
              <img 
                src={logo} 
                alt="Logo FAWS" 
                width="40" 
                height="40" 
                style={{ marginBottom: "16px", background: "#001529", padding: "8px", borderRadius: "8px" }} 
              />
            )}
            <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700, color: "#141414" }}>
              Acessar plataforma
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Insira suas credenciais abaixo para continuar.
            </Text>
          </div>

          {/* Formulário Ant Design */}
          <Form 
            name="login_form" 
            layout="vertical" 
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label={<Text strong style={{ fontSize: "13px" }}>E-mail corporativo</Text>}
              rules={[
                { required: true, message: "Por favor, insira seu e-mail!" },
                { type: "email", message: "Insira um endereço de e-mail válido!" }
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} 
                placeholder="nome@empresa.com" 
                size="large" 
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item
              name="senha"
              label={<Text strong style={{ fontSize: "13px" }}>Senha de acesso</Text>}
              rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />} 
                placeholder="Digite sua senha" 
                size="large" 
                style={{ borderRadius: "6px" }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                style={{ 
                  borderRadius: "6px", 
                  fontWeight: 600, 
                  height: "44px",
                  backgroundColor: "#001529",
                  borderColor: "#001529"
                }}
              >
                Entrar no Sistema
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};