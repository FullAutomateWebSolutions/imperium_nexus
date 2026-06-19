import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Avatar, Space, Typography, Grid } from "antd";
import { 
  DashboardOutlined, 
  TransactionOutlined, 
  UserAddOutlined, 
  UserOutlined, 
  UserSwitchOutlined,
  LogoutOutlined 
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/assets/Frame.svg";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string>("Usuário");
  const [userRole, setUserRole] = useState<string>("USER");
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const firstName = userName.split(" ")[0];

  useEffect(() => {
    const savedUser = localStorage.getItem("faws:user"); 
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        
        if (userObj && userObj.nome) {
          setUserName(userObj.nome);
        } else if (typeof userObj === "string") {
          setUserName(userObj);
        }

        if (userObj && userObj.role) {
          setUserRole(userObj.role.toUpperCase());
        }
      } catch {
        setUserName(savedUser);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const baseMenuItems = [
    {
      key: "/usuarios",
      icon: <UserOutlined />,
      label: "Gestão de Usuários",
      onClick: () => navigate("/usuarios"),
      adminOnly: true, 
    },
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
      adminOnly: false,
    },
    {
      key: "/movimentacao",
      icon: <TransactionOutlined />,
      label: "Movimentações",
      onClick: () => navigate("/movimentacao"),
      adminOnly: false,
    },
    {
      key: "/cadastro",
      icon: <UserAddOutlined />,
      label: "Cadastros",
      onClick: () => navigate("/cadastro"),
      adminOnly: false,
    },
    {
      key: "/register",
      icon: <UserSwitchOutlined />,
      label: "Registrar",
      onClick: () => navigate("/register"),
      adminOnly: true, 
    },
  ];

  const allowedMenuItems = baseMenuItems.filter(item => {
    if (item.adminOnly && userRole !== "ADMIN") {
      return false;
    }
    return true; 
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
 
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0"
        style={{
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 1002 
        }}
      >
        <div 
          style={{ 
            height: 32, 
            margin: 16, 
            background: "rgba(255, 255, 255, 0.2)", 
            borderRadius: 6, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            color: '#fff', 
            fontWeight: 'bold' 
          }}
        >
          <img 
            src={logo} 
            alt="Logo FAWS"
            style={{ objectFit: 'contain', display: 'block' }} 
            width="20" 
            height="20"
          />
          <span>FAWS Financeiro</span>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={allowedMenuItems} 
        />
      </Sider>

      <Layout style={{ height: "100vh", overflowY: "auto" }}>
        
        <Header style={{ 
          background: "#fff", 
          padding: isMobile ? "0 16px 0 60px" : "0 24px", 
          display: "flex", 
          justifyContent: isMobile ? "space-between" : "flex-end", 
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px #f0f0f0", 
          width: "100%"
        }}>
          
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <img 
                src={logo} 
                alt="Logo FAWS" 
                style={{ objectFit: "contain" }} 
                width="24" 
                height="24" 
              />
              <Text strong style={{ fontSize: "14px", color: "#111" }}>FAWS</Text>
            </div>
          )}

          <Space size={isMobile ? "small" : "large"}>
            <Space style={{ marginRight: 2 }}>
              <Avatar style={{ backgroundColor: '#a2b2c0' }} icon={<UserOutlined />} />
              
              {isMobile ? (
                <Text strong style={{ color: "#333", fontSize: "13px" }}>{firstName}</Text>
              ) : (
                <Space direction="vertical" size={0} style={{ lineHeight: 'normal' }}>
                  <Text strong style={{ color: "#333" }}>Olá, {userName}</Text>
                  <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>{userRole}</Text>
                </Space>
              )}
            </Space>
            
            <Button 
              type="primary" 
              danger 
              onClick={handleLogout}
              icon={isMobile ? <LogoutOutlined /> : undefined}
              shape={isMobile ? "circle" : "default"} 
            >
              {!isMobile && "Sair"}
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: isMobile ? "16px 8px" : "24px 16px" }}>
          <div style={{ padding: isMobile ? 16 : 24, minHeight: 360, background: "#fff", borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};