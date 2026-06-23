import { useState } from "react";
import { Button, Card, Col, Row, Typography, Divider, Grid, Drawer, Modal, Space, Flex } from "antd";
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

export const ManagementDashboardDrawer = () => {
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
      description: "Organize seus lançamentos por categorias de forma simples.",
      icon: <AppstoreOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      color: "#1890ff",
      form: <CategoryForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <CategoryList />,
      width: 650
    },
    {
      key: "account",
      title: "Contas Bancárias",
      description: "Gerencie suas contas corrente, saldos e instituições financeiras.",
      icon: <WalletOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      color: "#52c41a",
      form: <AccountForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <AccountList />,
      width: 750
    },
    {
      key: "card",
      title: "Cartões de Crédito",
      description: "Cadastre limites, bandeiras, fechamentos e vencimentos.",
      icon: <CreditCardOutlined style={{ fontSize: 24, color: "#faad14" }} />,
      color: "#faad14",
      form: <CardForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <CardList />,
      width: 750
    },
    {
      key: "status",
      title: "Status de Lançamento",
      description: "Configure os fluxos, etapas e situações permitidas no sistema.",
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      color: "#13c2c2",
      form: <StatusForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <StatusList />,
      width: 650
    },
    {
      key: "payment",
      title: "Formas de Pagamento",
      description: "Configure métodos aceitos como Pix, Boleto bancário ou Dinheiro.",
      icon: <BarcodeOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      color: "#722ed1",
      form: <PaymentMethodForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <PaymentMethodList />,
      width: 650
    },
    {
      key: "Movement",
      title: "Movimentações",
      description: "Painel operacional estratégico e fluxo de caixa completo.",
      icon: <TransactionOutlined style={{ fontSize: 24, color: "#eb2f96" }} />,
      color: "#eb2f96",
      form: null, 
      list: <Movement />,
      width: 1350
    },
  ];

  // Renderizador adaptativo para os Formulários externos
  const renderFormContainer = (item: typeof menuItems[0]) => {
    const titleContent = (
      <Flex align="center" gap="10px">
        <div style={{ background: `${item.color}12`, padding: "6px", borderRadius: "6px", display: "flex" }}>
          {item.icon}
        </div>
        <Text strong style={{ fontSize: "16px" }}>{`Novo Cadastro de ${item.title}`}</Text>
      </Flex>
    );

    if (isMobile) {
      return (
        <Drawer
          key={`adaptive-form-${item.key}`}
          title={titleContent}
          placement="right"
          onClose={handleCloseAll}
          open={activeForm === item.key}
          width="100%"
          destroyOnClose
          styles={{ body: { padding: "16px" }, mask: { backdropFilter: "blur(4px)" } }}
        >
          {item.form}
        </Drawer>
      );
    }

    return (
      <Modal
        key={`adaptive-form-${item.key}`}
        title={titleContent}
        open={activeForm === item.key}
        onCancel={handleCloseAll}
        footer={null}
        destroyOnClose
        centered
        width={650}
        styles={{ mask: { backdropFilter: "blur(4px)" } }}
      >
        <div style={{ paddingTop: "12px" }}>{item.form}</div>
      </Modal>
    );
  };

  // Renderizador adaptativo para as Tabelas/Listagens
  const renderListContainer = (item: typeof menuItems[0]) => {
    const titleContent = (
      <Flex align="center" gap="10px">
        <div style={{ background: `${item.color}12`, padding: "6px", borderRadius: "6px", display: "flex" }}>
          {item.icon}
        </div>
        <Text strong style={{ fontSize: "16px" }}>{`Gerenciador: ${item.title}`}</Text>
      </Flex>
    );

    if (isMobile) {
      return (
        <Drawer
          key={`adaptive-list-${item.key}`}
          title={titleContent}
          placement="right"
          onClose={handleCloseAll}
          open={activeList === item.key}
          width="100%"
          destroyOnClose
          styles={{ body: { padding: "16px 8px" }, mask: { backdropFilter: "blur(4px)" } }}
        >
          {item.list}
        </Drawer>
      );
    }

    return (
      <Modal
        key={`adaptive-list-${item.key}`}
        title={titleContent}
        open={activeList === item.key}
        onCancel={handleCloseAll}
        footer={null}
        destroyOnClose
        centered
        width={item.width}
        styles={{ mask: { backdropFilter: "blur(4px)" } }}
      >
        <div style={{ paddingTop: "12px" }}>{item.list}</div>
      </Modal>
    );
  };

  return (
    <div style={{ padding: isMobile ? "8px" : "4px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: isMobile ? "16px" : "24px" }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>
          Configurações e Parâmetros
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? "13px" : "14px" }}>
          Gerencie os parâmetros operacionais globais, tabelas de apoio e o fluxo financeiro.
        </Text>
      </div>
      
      <Divider style={{ margin: isMobile ? "16px 0" : "20px 0" }} />

      {/* Grid de Cards */}
      <Row gutter={[16, 16]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={8} key={item.key}>
            <Card
              hoverable
              style={{ 
                borderRadius: "10px", 
                overflow: "hidden", 
                borderTop: `4px solid ${item.color}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
              }}
              bodyStyle={{ padding: isMobile ? "16px 16px 12px 16px" : "20px" }}
              // No desktop mantém o botão "Ver Lista" no canto superior direito
              extra={!isMobile && (
                <Button 
                  type="text" 
                  icon={<UnorderedListOutlined />} 
                  onClick={() => setActiveList(item.key)}
                  style={{ color: "#595959", fontSize: "13px" }}
                >
                  Ver Lista
                </Button>
              )}
            >
              <Card.Meta
                avatar={
                  <div style={{ 
                    background: `${item.color}12`, 
                    padding: "12px", 
                    borderRadius: "8px", 
                    display: "flex", 
                    alignItems: "center" 
                  }}>
                    {item.icon}
                  </div>
                }
                title={<Text strong style={{ fontSize: "15px", color: "#1f1f1f" }}>{item.title}</Text>}
                description={
                  <div style={{ height: isMobile ? "auto" : "44px", overflow: "hidden", fontSize: "13px", lineHeight: "1.4" }}>
                    {item.description}
                  </div>
                }
              />

              {/* Botões adaptativos baseados no Breakpoint físico */}
              <div style={{ marginTop: "18px" }}>
                {isMobile ? (
                  // Layout Mobile: Botões empilhados 100% de largura para melhor ergonomia de toque
                  <Flex vertical gap="8px">
                    <Button 
                      type="primary" 
                      block
                      icon={<UnorderedListOutlined />}
                      onClick={() => setActiveList(item.key)}
                      style={{ fontWeight: 500, height: "38px", borderRadius: "6px" }}
                    >
                      Visualizar Registros
                    </Button>
                    {item.form && (
                      <Button 
                        type="default" 
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setActiveForm(item.key)}
                        style={{ fontWeight: 500, height: "38px", borderRadius: "6px" }}
                      >
                        Novo Cadastro
                      </Button>
                    )}
                  </Flex>
                ) : (
                  // Layout Desktop: Mantém a assinatura limpa original
                  <Flex justify="center">
                    {item.form ? (
                      <Button 
                        type="primary" 
                        ghost
                        icon={<PlusOutlined />}
                        onClick={() => setActiveForm(item.key)}
                        style={{ width: "100%", borderRadius: "6px", fontWeight: 500 }}
                      >
                        Novo Cadastro
                      </Button>
                    ) : (
                      <Button 
                        type="primary" 
                        icon={<ArrowRightOutlined />}
                        onClick={() => setActiveList(item.key)}
                        style={{ width: "100%", borderRadius: "6px", fontWeight: 500, backgroundColor: item.color, borderColor: item.color }}
                      >
                        Gerenciar Painel
                      </Button>
                    )}
                  </Flex>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {menuItems.map((item) => item.form && renderFormContainer(item))}
      {menuItems.map((item) => renderListContainer(item))}
    </div>
  );
};