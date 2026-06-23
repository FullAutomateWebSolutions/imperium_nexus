import React, { useState } from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  Card, 
  List, 
  Avatar, 
  Dropdown, 
  Space, 
  Typography 
} from 'antd';
import {
  HomeOutlined,
  BankOutlined,
  DollarOutlined,
  CreditCardOutlined,
  ApiOutlined,
  SearchOutlined,
  EyeOutlined,
  GlobalOutlined,
  UserOutlined,
  ArrowRightOutlined,
  BarcodeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  AppstoreOutlined,
  CodeOutlined,
  MenuOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

// --- CENTRALIZAÇÃO DE CORES (PALETA AZUL) ---
const COLORS = {
  primary: '#0052CC',       // Azul Principal (Faws)
  primaryLight: '#E6F0FF',  // Azul claro para destaques/avatares
  primaryDark: '#0747A6',   // Azul escuro para gradientes
  bgLayout: '#F4F5F7',      // Cinza de fundo
  border: '#DFE1E6',        // Bordas
  textDark: '#172B4D',      // Texto principal
  textMuted: '#7A869A',     // Texto secundário
  success: '#36B37E',       // Verde de confirmação
  bannerBg: '#091E42'       // Azul quase preto para banners
};

export default function DashboardMobileFAWS() {
  // Estado para controlar o menu inferior ativo
  const [activeTab, setActiveTab] = useState('integrar');

  // Menu de integrações flutuante adaptado para a base da tela (estilo Drawer/BottomSheet mobile)
  const menuIntegracoesMobile = (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px 16px 24px 16px',
      borderRadius: '16px 16px 0 0',
      boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
      width: '100vw',
      borderTop: `1px solid ${COLORS.border}`
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ width: '40px', height: '4px', backgroundColor: COLORS.border, borderRadius: '2px', margin: '0 auto 16px auto' }} />
        <Title level={5} style={{ fontSize: '15px', marginBottom: '20px', color: COLORS.textDark, textAlign: 'center' }}>Integrações</Title>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
            <Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<PlusOutlined />} />
            <div style={{ marginTop: 6, fontSize: '11px', fontWeight: 500, color: COLORS.textDark, lineHeight: '13px' }}>Nova Integração</div>
          </div>
          <div style={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
            <Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<AppstoreOutlined />} />
            <div style={{ marginTop: 6, fontSize: '11px', fontWeight: 500, color: COLORS.textDark, lineHeight: '13px' }}>Minhas Integrações</div>
          </div>
          <div style={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
            <Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<CodeOutlined />} />
            <div style={{ marginTop: 6, fontSize: '11px', fontWeight: 500, color: COLORS.textDark, lineHeight: '13px' }}>Portal do Dev</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: COLORS.bgLayout, paddingBottom: '60px' }}>
      
      {/* --- HEADER MOBILE --- */}
      <Header style={{ 
        backgroundColor: '#fff', 
        padding: '0 16px', 
        height: 'auto', 
        lineHeight: 'normal',
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ color: COLORS.primary, fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>FAWS</span>
            <span style={{ color: COLORS.textMuted, fontSize: '11px', fontWeight: '500' }}>empresas</span>
          </div>

          {/* Ações Rápidas */}
          <Space size="middle">
            <SearchOutlined style={{ fontSize: '18px', color: COLORS.textMuted }} />
            <EyeOutlined style={{ fontSize: '18px', color: COLORS.primary }} />
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: COLORS.bgLayout, color: COLORS.textMuted }} />
          </Space>
        </div>

        {/* Resumo da Conta (Empilhado para mobile) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 12px 0', borderTop: `1px solid ${COLORS.bgLayout}` }}>
          <div>
            <div style={{ fontSize: '10px', color: COLORS.textMuted, lineHeight: '12px' }}>ALEX SANDRO ALVES DE LIMA</div>
            <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '14px' }}>R$ 662,69</div>
          </div>
          <Button icon={<GlobalOutlined style={{ color: COLORS.success }} />} size="small" style={{ fontSize: '11px', borderRadius: '4px' }}>
            BR
          </Button>
        </div>
      </Header>

      {/* --- CONTEÚDO EM FILA VERTICAL SINGLE COLUMN --- */}
      <Content style={{ padding: '16px', position: 'relative' }}>
        {/* Backdrop de foco do menu flutuante */}
        {activeTab === 'integrar' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(9, 30, 66, 0.2)', zIndex: 50
          }} onClick={() => setActiveTab(null)} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 10 }}>
          
          {/* Card Extrato */}
          <Card size="small" title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontWeight: 700 }}>Extrato</span><ArrowRightOutlined style={{ color: COLORS.primary }} /></div>}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Saldo em conta</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: COLORS.textDark }}>R$ 662,69</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Em processamento</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: COLORS.textMuted }}>R$ 0,00</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Button size="small" shape="round" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary, borderColor: COLORS.primaryLight, fontSize: '12px' }}>Entradas</Button>
              <Button size="small" shape="round" style={{ fontSize: '12px' }}>Saídas</Button>
            </div>

            <Text type="secondary" style={{ fontSize: '10px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>JUNHO</Text>
            <List
              itemLayout="horizontal"
              dataSource={[
                { date: 'Terça, 17 jun.', title: 'Pix enviado', value: '-R$ 178,31', desc: 'Receita Federal' },
                { date: 'Segunda, 16 jun.', title: 'Pix enviado', value: '-R$ 259,00', desc: 'Agilize Tecnologia Ltda' }
              ]}
              renderItem={item => (
                <div style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.bgLayout}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: COLORS.textDark }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{item.desc} • {item.date}</div>
                    </div>
                    <span style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '12px' }}>{item.value}</span>
                  </div>
                </div>
              )}
            />
          </Card>

          {/* Card Pagamentos */}
          <Card size="small" title={<span style={{ fontWeight: 700 }}>Pagamentos</span>}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}>
              Pague boletos e tributos com código de barras
            </Text>
            <Input 
              placeholder="Digite o código de barras" 
              suffix={<BarcodeOutlined style={{ color: COLORS.textMuted }} />} 
              style={{ height: '44px', marginBottom: '12px', borderRadius: '6px' }}
            />
            <div style={{ display: 'flex', gap: '8px', background: '#F4F5F7', padding: '10px', borderRadius: '6px', marginBottom: '16px', border: `1px solid ${COLORS.border}` }}>
              <InfoCircleOutlined style={{ color: COLORS.textMuted, marginTop: '2px', fontSize: '12px' }} />
              <span style={{ fontSize: '10px', color: COLORS.textDark, lineHeight: '13px' }}>
                Apenas DARF permite pagamentos <strong>sem código de barras</strong> no momento.
              </span>
            </div>
            <Button type="primary" block disabled style={{ background: COLORS.border, borderColor: COLORS.border, color: COLORS.textMuted, height: '38px', borderRadius: '6px', fontWeight: '600' }}>
              Continuar
            </Button>
          </Card>

          {/* Card Pix */}
          <Card size="small" title={<span style={{ fontWeight: 700 }}>Pix</span>}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: COLORS.textDark, fontSize: '12px' }}>Chave</span>
              <a href="#favoritos" style={{ color: COLORS.primary, fontSize: '11px' }}>Meus favoritos</a>
            </div>
            <Input 
              placeholder="CPF, CNPJ, celular ou e-mail" 
              style={{ height: '44px', marginBottom: '16px', borderRadius: '6px' }}
            />
            <Button type="primary" block disabled style={{ background: COLORS.border, borderColor: COLORS.border, color: COLORS.textMuted, height: '38px', borderRadius: '6px', fontWeight: '600' }}>
              Continuar
            </Button>
          </Card>

          {/* Banners Laterais convertidos para carrossel/pilha vertical */}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, borderRadius: '8px', padding: '16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Conta Global corporativa</div>
            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '10px' }}>Gratuito</span>
          </div>
          
          <div style={{ background: COLORS.bannerBg, borderRadius: '8px', padding: '16px', color: '#fff' }}>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>Cartão Internacional sem anuidade pro seu negócio</div>
            <div style={{ fontSize: '11px', color: COLORS.primaryLight, fontWeight: '700', marginTop: '12px', cursor: 'pointer' }}>
              Abrir Conta Global gratuita <ArrowRightOutlined style={{ fontSize: '9px' }} />
            </div>
          </div>
        </div>
      </Content>

      {/* --- MENU INFERIOR MOBILE (BOTTOM APP NAVIGATION) --- */}
      <Footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#fff',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTop: `1px solid ${COLORS.border}`,
        zIndex: 1100
      }}>
        {/* Aba Home */}
        <div onClick={() => setActiveTab('inicio')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'inicio' ? COLORS.primary : COLORS.textMuted }}>
          <HomeOutlined style={{ fontSize: '18px' }} />
          <span style={{ fontSize: '10px', marginTop: '2px' }}>Início</span>
        </div>
        {/* Aba Conta */}
        <div onClick={() => setActiveTab('conta')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'conta' ? COLORS.primary : COLORS.textMuted }}>
          <BankOutlined style={{ fontSize: '18px' }} />
          <span style={{ fontSize: '10px', marginTop: '2px' }}>Conta</span>
        </div>
        {/* Aba Pix */}
        <div onClick={() => setActiveTab('pix')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'pix' ? COLORS.primary : COLORS.textMuted }}>
          <DollarOutlined style={{ fontSize: '18px' }} />
          <span style={{ fontSize: '10px', marginTop: '2px' }}>Pix</span>
        </div>
        {/* Aba Integrar (Como está selecionada, dispara o menu flutuante de baixo) */}
        <Dropdown 
          overlay={menuIntegracoesMobile} 
          visible={activeTab === 'integrar'} 
          trigger={['click']}
          placement="topCenter"
        >
          <div onClick={() => setActiveTab(activeTab === 'integrar' ? null : 'integrar')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'integrar' ? COLORS.primary : COLORS.textMuted }}>
            <ApiOutlined style={{ fontSize: '18px' }} />
            <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: activeTab === 'integrar' ? '700' : '400' }}>Integrar</span>
          </div>
        </Dropdown>
        {/* Aba Mais/Menu */}
        <div onClick={() => setActiveTab('mais')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === 'mais' ? COLORS.primary : COLORS.textMuted }}>
          <MenuOutlined style={{ fontSize: '18px' }} />
          <span style={{ fontSize: '10px', marginTop: '2px' }}>Mais</span>
        </div>
      </Footer>

    </Layout>
  );
}