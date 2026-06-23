import { useState } from "react";
import { Button, Card, Col, Row, Typography, Modal, Divider, Grid, Flex } from "antd";
import { 
  AppstoreOutlined, 
  WalletOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  BarcodeOutlined,
  UnorderedListOutlined,
  TransactionOutlined,
  PlusOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

import { CategoryForm } from "../form/category.form";
import { AccountForm } from "../form/account.form";
import { CardForm } from "../form/card.form";
import { StatusForm } from "../form/status.form";
import { PaymentMethodForm } from "../form/paymentMethod.form";

import { CategoryList } from "../page/category.page";
import { AccountList } from "../page/account.page";
import { CardList } from "../page/card.page";
import { PaymentMethodList } from "../page/paymentMethodList.page";
import { Movement } from "../page/movimentList.page";
import { StatusList } from "../page/statusList.page";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const ManagementDashboard = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<string | null>(null);

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const handleCloseAll = () => {
    setActiveForm(null);
    setActiveList(null);
  };

  const menuItems = [
    {
      key: "category",
      title: "Categorias",
      description: "Organize seus lançamentos por categorias",
      icon: <AppstoreOutlined style={{ fontSize: 26, color: "#1890ff" }} />,
      color: "#1890ff",
      form: <CategoryForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <CategoryList />,
      width: 950
    },
    {
      key: "account",
      title: "Contas Bancárias",
      description: "Gerencie suas contas, saldos e instituições",
      icon: <WalletOutlined style={{ fontSize: 26, color: "#52c41a" }} />,
      color: "#52c41a",
      form: <AccountForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <AccountList />,
      width: 950
    },
    {
      key: "card",
      title: "Cartões de Crédito",
      description: "Cadastre limites, bandeiras e vencimentos",
      icon: <CreditCardOutlined style={{ fontSize: 26, color: "#faad14" }} />,
      color: "#faad14",
      form: <CardForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <CardList />,
      width: 950
    },
    {
      key: "status",
      title: "Status de Lançamento",
      description: "Configure os fluxos e situações permitidas",
      icon: <CheckCircleOutlined style={{ fontSize: 26, color: "#13c2c2" }} />,
      color: "#13c2c2",
      form: <StatusForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <StatusList />,
      width: 950
    },
    {
      key: "payment",
      title: "Formas de Pagamento",
      description: "Métodos aceitos como Pix, Boleto ou Dinheiro",
      icon: <BarcodeOutlined style={{ fontSize: 26, color: "#722ed1" }} />,
      color: "#722ed1",
      form: <PaymentMethodForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <PaymentMethodList />,
      width: 950
    },
    {
      key: "Movement",
      title: "Movimentações",
      description: "Painel operacional e fluxo de caixa completo",
      icon: <TransactionOutlined style={{ fontSize: 26, color: "#eb2f96" }} />,
      color: "#eb2f96",
      form: null, 
      list: <Movement />,
      width: 1300
    },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "32px 24px", maxWidth: "1300px", margin: "0 auto" }}>
      {/* Cabeçalho Redesenhado */}
      <div style={{ marginBottom: isMobile ? "16px" : "32px" }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>
          Painel de Controle de Cadastros
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? "14px" : "15px" }}>
          Gerencie os parâmetros globais, tabelas de apoio e o fluxo financeiro da plataforma.
        </Text>
      </div>
      
      <Divider style={{ margin: isMobile ? "16px 0" : "24px 0" }} />

      {/* Grid de Cards */}
      <Row gutter={[20, 20]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.key}>
            <Card
              hoverable
              style={{ 
                borderRadius: "8px", 
                overflow: "hidden", 
                borderTop: `4px solid ${item.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
              bodyStyle={{ padding: "24px 20px" }}
              extra={
                <Button 
                  type="link" 
                  icon={<UnorderedListOutlined />} 
                  onClick={() => setActiveList(item.key)}
                  style={{ padding: 0, color: "#595959" }}
                >
                  Ver Lista
                </Button>
              }
              actions={
                item.form 
                  ? [
                      <Button 
                        type="primary" 
                        ghost
                        icon={<PlusOutlined />}
                        onClick={() => setActiveForm(item.key)}
                        style={{ width: "85%", borderRadius: "6px" }}
                      >
                        Novo Cadastro
                      </Button>
                    ] 
                  : [
                      <Button 
                        type="primary" 
                        icon={<ArrowRightOutlined />}
                        onClick={() => setActiveList(item.key)}
                        style={{ width: "85%", borderRadius: "6px", backgroundColor: item.color, borderColor: item.color }}
                      >
                        Gerenciar
                      </Button>
                    ]
              }
            >
              <Card.Meta
                avatar={
                  <div style={{ 
                    background: `${item.color}15`, 
                    padding: "10px", 
                    borderRadius: "8px", 
                    display: "flex", 
                    alignItems: "center" 
                  }}>
                    {item.icon}
                  </div>
                }
                title={<Text strong style={{ fontSize: "16px" }}>{item.title}</Text>}
                description={<div style={{ height: "40px", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modais de Formulários (Cadastro de apoio) */}
      {menuItems.map((item) => item.form && (
        <Modal
          key={`modal-form-${item.key}`}
          title={`Novo Cadastro de ${item.title}`}
          open={activeForm === item.key}
          onCancel={handleCloseAll}
          footer={null}
          destroyOnClose
          centered={!isMobile}
          width={isMobile ? "100%" : 650}
          style={isMobile ? { top: 0, padding: 0, margin: 0 } : undefined}
          bodyStyle={{ padding: isMobile ? "16px" : "8px 24px 24px 24px" }}
        >
          {item.form}
        </Modal>
      ))}

      {/* Modais de Listagens (Tabelas Gerais / Movimentação) */}
      {menuItems.map((item) => (
        <Modal
          key={`modal-list-${item.key}`}
          title={`Gerenciador Principal: ${item.title}`}
          open={activeList === item.key}
          onCancel={handleCloseAll}
          footer={null}
          destroyOnClose
          centered={!isMobile}
          width={isMobile ? "100%" : item.width} 
          style={isMobile ? { top: 0, padding: 0, margin: 0 } : undefined}
          bodyStyle={{ padding: isMobile ? "8px" : "12px 24px 24px 24px" }}
        >
          {item.list}
        </Modal>
      ))}
    </div>
  );
};