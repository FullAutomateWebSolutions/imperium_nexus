import React, { useState, useEffect } from 'react';
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
  LineChartOutlined,
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
  PercentageOutlined,
  WalletOutlined,
  CheckSquareOutlined,
  MenuOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

// --- OBJETO DE CORES CENTRALIZADO (PALETA AZUL) ---
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

export default function DashboardResponsivo() {
  const [activeMenuKey, setActiveMenuKey] = useState('integrar');
  const [isMobile, setIsMobile] = useState(false);

  // Hook para monitorar o tamanho da tela em tempo real
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Define mobile para telas menores ou iguais a 768px
    };
    
    handleResize(); // Executa no primeiro carregamento
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- SUBMENUS (DROPDOWNS) ---
  const menuIntegracoesDesktop = (
    <div style={{ backgroundColor: '#fff', padding: '24px 32px', borderRadius: '0 0 12px 12px', boxShadow: '0 12px 24px rgba(0,0,0,0.08)', display: 'flex', gap: '32px', minWidth: '400px', borderTop: `1px solid ${COLORS.bgLayout}` }}>
      <div style={{ width: '100%' }}>
        <Title level={5} style={{ fontSize: '14px', marginBottom: '16px', color: COLORS.textDark }}>Integrações</Title>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'center', cursor: 'pointer', width: '100px' }}><Avatar size={48} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<PlusOutlined />} /><div style={{ marginTop: 8, fontSize: '12px', fontWeight: 500, color: COLORS.textDark }}>Nova Integração</div></div>
          <div style={{ textAlign: 'center', cursor: 'pointer', width: '100px' }}><Avatar size={48} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<AppstoreOutlined />} /><div style={{ marginTop: 8, fontSize: '12px', fontWeight: 500, color: COLORS.textDark }}>Minhas Integrações</div></div>
          <div style={{ textAlign: 'center', cursor: 'pointer', width: '100px' }}><Avatar size={48} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<CodeOutlined />} /><div style={{ marginTop: 8, fontSize: '12px', fontWeight: 500, color: COLORS.textDark }}>Portal do Dev</div></div>
        </div>
      </div>
    </div>
  );

  const menuIntegracoesMobile = (
    <div style={{ backgroundColor: '#fff', padding: '20px 16px 24px 16px', borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 16px rgba(0,0,0,0.1)', width: '100vw', borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ width: '40px', height: '4px', backgroundColor: COLORS.border, borderRadius: '2px', margin: '0 auto 16px auto' }} />
      <Title level={5} style={{ fontSize: '15px', marginBottom: '20px', color: COLORS.textDark, textAlign: 'center' }}>Integrações</Title>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center', flex: 1 }}><Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<PlusOutlined />} /><div style={{ marginTop: 6, fontSize: '11px', fontWeight: 500 }}>Nova Integração</div></div>
        <div style={{ textAlign: 'center', flex: 1 }}><Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<AppstoreOutlined />} /><div style={{ marginTop: 6, fontSize: '11px', fontWeight: 500 }}>Minhas Opções</div></div>
        <div style={{ textAlign: 'center', flex: 1 }}><Avatar size={44} style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }} icon={<CodeOutlined />} /><div style={{ marginTop: 6, fontSize: '11px', fontWeight: 500 }}>Portal do Dev</div></div>
      </div>
    </div>
  );

  const menuGenericoMock = (titulo) => (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '0 0 8px 8px', boxShadow: '0 8px 16px rgba(0,0,0,0.06)', minWidth: '200px' }}>
      <Text strong style={{ color: COLORS.textDark }}>{titulo}</Text>
      <div style={{ marginTop: '8px', fontSize: '12px', color: COLORS.textMuted }}>Configurações de {titulo}...</div>
    </div>
  );

  const navigationItems = [
    { key: 'inicio', icon: <HomeOutlined />, label: 'Início', dropdown: null },
    { key: 'conta', icon: <BankOutlined />, label: 'Conta Digital', dropdown: menuGenericoMock('Conta Digital') },
    { key: 'pix', icon: <DollarOutlined />, label: 'Pix', dropdown: menuGenericoMock('Pix') },
    { key: 'maquininhas', icon: <PercentageOutlined />, label: 'Maquininhas', dropdown: menuGenericoMock('Maquininhas') },
    { key: 'cobrar', icon: <WalletOutlined />, label: 'Cobrar ou Receber', dropdown: menuGenericoMock('Cobrar ou Receber') },
    { key: 'pagar', icon: <CreditCardOutlined />, label: 'Pagar ou Transferir', dropdown: menuGenericoMock('Pagar ou Transferir') },
    { key: 'aprovar', icon: <CheckSquareOutlined />, label: 'Aprovar', dropdown: menuGenericoMock('Aprovar') },
    { key: 'cartoes', icon: <CreditCardOutlined />, label: 'Cartões', dropdown: menuGenericoMock('Cartões') },
    { key: 'investir', icon: <LineChartOutlined />, label: 'Investir', dropdown: menuGenericoMock('Investir') },
    { key: 'integrar', icon: <ApiOutlined />, label: 'Integrar', dropdown: menuIntegracoesDesktop },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: COLORS.bgLayout, paddingBottom: isMobile ? '60px' : 0 }}>
      
      {/* --- HEADER CONDICIONAL (DESKTOP VS MOBILE) --- */}
      <Header style={{ 
        backgroundColor: '#fff', 
        padding: isMobile ? '0 16px' : '0 40px', 
        height: 'auto', 
        lineHeight: 'normal',
        borderBottom: `1px solid ${COLORS.border}`,
        position: 'sticky', top: 0, zIndex: 1000
      }}>
        {isMobile ? (
          /* Cabeçalho Mobile */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ color: COLORS.primary, fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>FAWS</span>
                <span style={{ color: COLORS.textMuted, fontSize: '11px', fontWeight: '500' }}>empresas</span>
              </div>
              <Space size="middle">
                <SearchOutlined style={{ fontSize: '18px', color: COLORS.textMuted }} />
                <EyeOutlined style={{ fontSize: '18px', color: COLORS.primary }} />
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: COLORS.bgLayout, color: COLORS.textMuted }} />
              </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 12px 0', borderTop: `1px solid ${COLORS.bgLayout}` }}>
              <div>
                <div style={{ fontSize: '10px', color: COLORS.textMuted, lineHeight: '12px' }}>ALEX SANDRO ALVES DE LIMA</div>
                <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '14px' }}>R$ 662,69</div>
              </div>
              <Button icon={<GlobalOutlined style={{ color: COLORS.success }} />} size="small" style={{ fontSize: '11px' }}>BR</Button>
            </div>
          </>
        ) : (
          /* Cabeçalho Desktop (Original) */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                <span style={{ color: COLORS.primary, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>FAWS</span>
                <span style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: '500', marginTop: '2px' }}>empresas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                <Space size="large">
                  <SearchOutlined style={{ fontSize: '18px', color: COLORS.textMuted }} />
                  <EyeOutlined style={{ fontSize: '18px', color: COLORS.primary }} />
                  <div>
                    <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Saldo</div>
                    <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '15px' }}>R$ 662,69</div>
                  </div>
                </Space>
                <div style={{ borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '24px', height: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11px', color: COLORS.textMuted }}>533714655</div>
                  <div style={{ fontWeight: '700', color: COLORS.textDark, fontSize: '12px' }}>ALEX SANDRO ALVES DE LIMA DESENVOLV</div>
                </div>
                <Space size="middle">
                  <Button icon={<GlobalOutlined style={{ color: COLORS.success }} />}>Brasil</Button>
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: COLORS.bgLayout, color: COLORS.textMuted }} />
                </Space>
              </div>
            </div>
            {/* Barra de Menus Desktop */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                {navigationItems.map((item) => {
                  const isSelected = activeMenuKey === item.key;
                  const itemContent = (
                    <div onClick={() => setActiveMenuKey(activeMenuKey === item.key ? null : item.key)} style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', borderBottom: isSelected ? `3px solid ${COLORS.primary}` : '3px solid transparent', backgroundColor: isSelected ? COLORS.primaryLight : 'transparent', color: isSelected ? COLORS.primary : COLORS.textDark, minWidth: '90px' }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: isSelected ? '600' : '400' }}>{item.label}</span>
                    </div>
                  );
                  return item.dropdown ? (
                    <Dropdown key={item.key} overlay={item.dropdown} visible={isSelected} trigger={['click']} placement="bottomLeft" getPopupContainer={(trigger) => trigger.parentElement}>{itemContent}</Dropdown>
                  ) : <React.Fragment key={item.key}>{itemContent}</React.Fragment>;
                })}
              </div>
              <div style={{ color: COLORS.textDark, fontSize: '13px', fontWeight: '500' }}>Soluções Para sua Empresa</div>
            </div>
          </>
        )}
      </Header>

      {/* --- GRID DE CONTEÚDO RESPONSIVO --- */}
      <Content style={{ padding: isMobile ? '16px' : '32px 40px', position: 'relative' }}>
        {/* Cortina escura se houver menu aberto */}
        {activeMenuKey && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.15)', zIndex: 50 }} onClick={() => setActiveMenuKey(null)} />
        )}

        <div style={{ 
          display: 'grid', 
          // Grid dinâmico: 1 coluna no mobile, 4 colunas no Desktop
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 320px', 
          gap: isMobile ? '16px' : '24px', 
          position: 'relative', zIndex: 10 
        }}>
          
          {/* Card Extrato */}
          <Card size={isMobile ? "small" : "default"} title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong>Extrato</strong><ArrowRightOutlined style={{ color: COLORS.primary }} /></div>}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Saldo em conta</div>
                <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700' }}>R$ 662,69</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Em processamento</div>
                <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: COLORS.textMuted }}>R$ 0,00</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Button size="small" shape="round" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary, borderColor: COLORS.primaryLight }}>Entradas</Button>
              <Button size="small" shape="round">Saídas</Button>
            </div>
            <List
              dataSource={[
                { date: 'Terça, 17 jun.', title: 'Pix enviado', value: '-R$ 178,31', desc: 'Receita Federal' },
                { date: 'Segunda, 16 jun.', title: 'Pix enviado', value: '-R$ 259,00', desc: 'Agilize Tecnologia' }
              ]}
              renderItem={item => (
                <div style={{ padding: '10px 0', borderBottom: `1px solid ${COLORS.bgLayout}`, fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><strong>{item.title}</strong><div style={{ color: COLORS.textMuted, fontSize: '11px' }}>{item.desc} • {item.date}</div></div>
                    <span style={{ fontWeight: '700' }}>{item.value}</span>
                  </div>
                </div>
              )}
            />
          </Card>

          {/* Card Pagamentos */}
          <Card size={isMobile ? "small" : "default"} title="<strong>Pagamentos</strong>">
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '12px' }}>Pague boletos e tributos com código de barras</Text>
            <Input placeholder="Digite o código de barras" suffix={<BarcodeOutlined style={{ color: COLORS.textMuted }} />} style={{ height: '44px', marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '10px', background: '#F4F5F7', padding: '12px', borderRadius: '6px', marginBottom: '16px', border: `1px solid ${COLORS.border}`, fontSize: '11px' }}>
              <InfoCircleOutlined style={{ marginTop: '2px' }} />
              <span>Apenas DARF permite pagamentos <strong>sem código de barras</strong> no momento.</span>
            </div>
            <Button type="primary" block disabled style={{ background: COLORS.border, color: COLORS.textMuted, height: '40px', fontWeight: '600' }}>Continuar</Button>
          </Card>

          {/* Card Pix */}
          <Card size={isMobile ? "small" : "default"} title="<strong>Pix</strong>">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: '600' }}>Chave</span>
              <a href="#favoritos" style={{ color: COLORS.primary, fontSize: '12px' }}>Meus favoritos</a>
            </div>
            <Input placeholder="CPF, CNPJ, celular ou e-mail" style={{ height: '44px', marginBottom: isMobile ? '24px' : '114px' }} />
            <Button type="primary" block disabled style={{ background: COLORS.border, color: COLORS.textMuted, height: '40px', fontWeight: '600' }}>Continuar</Button>
          </Card>

          {/* Banners Corporativos Laterais / Finais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, borderRadius: '12px', padding: '20px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: isMobile ? 'auto' : '120px' }}>
              <div style={{ fontSize: '15px', fontWeight: '700' }}>Conta Global corporativa</div>
              <div style={{ marginTop: isMobile ? '12px' : 0 }}><span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', padding: '4px 10px', borderRadius: '20px' }}>Gratuito</span></div>
            </div>
            <div style={{ background: COLORS.bannerBg, borderRadius: '12px', padding: '20px', color: '#fff' }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Cartão Internacional sem anuidade pro seu negócio</div>
              <div style={{ fontSize: '12px', color: COLORS.primaryLight, fontWeight: '700', marginTop: '16px', cursor: 'pointer' }}>Abrir Conta Global gratuita</div>
            </div>
          </div>

        </div>
      </Content>

      {/* --- BOTTOM MENU APENAS MOBILE --- */}
      {isMobile && (
        <Footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', backgroundColor: '#fff', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderTop: `1px solid ${COLORS.border}`, zIndex: 1100 }}>
          <div onClick={() => setActiveMenuKey('inicio')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeMenuKey === 'inicio' ? COLORS.primary : COLORS.textMuted }}><HomeOutlined style={{ fontSize: '18px' }} /><span style={{ fontSize: '10px' }}>Início</span></div>
          <div onClick={() => setActiveMenuKey('conta')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeMenuKey === 'conta' ? COLORS.primary : COLORS.textMuted }}><BankOutlined style={{ fontSize: '18px' }} /><span style={{ fontSize: '10px' }}>Conta</span></div>
          <div onClick={() => setActiveMenuKey('pix')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeMenuKey === 'pix' ? COLORS.primary : COLORS.textMuted }}><DollarOutlined style={{ fontSize: '18px' }} /><span style={{ fontSize: '10px' }}>Pix</span></div>
          <Dropdown overlay={menuIntegracoesMobile} visible={activeMenuKey === 'integrar'} trigger={['click']} placement="topCenter">
            <div onClick={() => setActiveMenuKey(activeMenuKey === 'integrar' ? null : 'integrar')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeMenuKey === 'integrar' ? COLORS.primary : COLORS.textMuted }}><ApiOutlined style={{ fontSize: '18px' }} /><span style={{ fontSize: '10px', fontWeight: '700' }}>Integrar</span></div>
          </Dropdown>
          <div onClick={() => setActiveMenuKey('mais')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeMenuKey === 'mais' ? COLORS.primary : COLORS.textMuted }}><MenuOutlined style={{ fontSize: '18px' }} /><span style={{ fontSize: '10px' }}>Mais</span></div>
        </Footer>
      )}

    </Layout>
  );
}