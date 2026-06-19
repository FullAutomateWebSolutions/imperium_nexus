import { useState } from "react";
import { Button, Card, Col, Row, Typography, Modal, Divider } from "antd";
import { 
  AppstoreOutlined, 
  WalletOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  BarcodeOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";

// Importações dos formulários e listagens
import { FormEditing } from "../../../components/form/formConfig";
import { CategoryForm } from "../form/category.form";
import { AccountForm } from "../form/account.form";
import { CardForm } from "../form/card.form";
import { StatusForm } from "../form/status.form";
import { PaymentMethodForm } from "../form/paymentMethod.form";

import { CategoryList } from "./Category.page";
import { AccountList } from "./Account.page";
import { CardList } from "./Card.page";
import { StatusList } from "./StatusList.page";
import { PaymentMethodList } from "./PaymentMethod.page";
import { Movement } from "./movimentList.page";

const { Title, Text } = Typography;

export const ManagementDashboard = () => {
  // Estados para controlar qual modal específico está aberto
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [activeList, setActiveList] = useState<string | null>(null);

  const handleCloseAll = () => {
    setActiveForm(null);
    setActiveList(null);
  };

  // Configuração mapeando chaves, títulos, ícones, formulários e listagens correspondentes
  const menuItems = [
    {
      key: "category",
      title: "Categorias",
      description: "Gerenciar categorias de movimentos",
      icon: <AppstoreOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      form: <CategoryForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <CategoryList />
    },
    {
      key: "account",
      title: "Contas Bancárias",
      description: "Gerenciar contas e saldos",
      icon: <WalletOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      form: <AccountForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <AccountList />
    },
    {
      key: "card",
      title: "Cartões de Crédito",
      description: "Cadastrar e editar cartões",
      icon: <CreditCardOutlined style={{ fontSize: 24, color: "#faad14" }} />,
      form: <CardForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <CardList />
    },
    {
      key: "status",
      title: "Status",
      description: "Fluxos e situações de lançamentos",
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: "#13c2c2" }} />,
      form: <StatusForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <StatusList />
    },
    {
      key: "payment",
      title: "Formas de Pagamento",
      description: "Gerenciar métodos de pagamento",
      icon: <BarcodeOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      form: <PaymentMethodForm formEditing={"criar"} data={{} as any} onClose={handleCloseAll} />,
      list: <PaymentMethodList />
    },
     {
      key: "Movement",
      title: "Movimentos",
      description: "Gerenciar todos os movimentos",
      icon: <AppstoreOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      with: 1200,
    //   form: <PaymentMethodForm formEditing={"editar"} data={{} as any} onClose={handleCloseAll} />,
      list: <Movement />
    },
  ];
//Movement
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Painel de Cadastros</Title>
        <Text type="secondary">Selecione uma das opções abaixo para realizar operações no sistema.</Text>
      </div>
      
      <Divider />

      {/* Grid com os Cards de ação */}
      <Row gutter={[16, 16]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.key}>
            <Card
              hoverable
              extra={
                <Button 
                  type="text" 
                  icon={<UnorderedListOutlined />} 
                  onClick={() => setActiveList(item.key)}
                >
                  Ver Lista
                </Button>
              }
              actions={[
                <>{!item.form ? <></> :
                    <Button 
                  type="primary" 
                  key="open" 
                  onClick={() => setActiveForm(item.key)}
                >
                  Cadastra
                </Button>
                           
                }</>
                
              ]}
            >
              <Card.Meta
                avatar={item.icon}
                title={item.title}
                description={item.description}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modais de Formulário */}
      {menuItems.map((item) => (
        <Modal
          key={`modal-form-${item.key}`}
          title={`Formulário de ${item.title}`}
          open={activeForm === item.key}
          onCancel={handleCloseAll}
          footer={null}
          destroyOnClose
          width={650}
        >
          <div style={{ marginTop: 20 }}>
            {item.form}
          </div>
        </Modal>
      ))}

      {/* Modais de Listagem (Tabelas) */}
      {menuItems.map((item) => (
        <Modal
          key={`modal-list-${item.key}`}
          title={`Gerenciamento de ${item.title}`}
          open={activeList === item.key}
          onCancel={handleCloseAll}
          footer={null}
          destroyOnClose
          width={item.with ? item.with : 900} 
        >
          <div style={{ marginTop: 20 }}>
            {item.list}
          </div>
        </Modal>
      ))}
    </div>
  );
};