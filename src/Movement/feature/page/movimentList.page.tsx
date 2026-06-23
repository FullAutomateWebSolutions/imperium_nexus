import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
  Flex,
  notification,
  DatePicker,
  Popconfirm,
  Select,
  Table,
  Grid,
  Divider,
  Badge,
  Drawer
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ClearOutlined, 
  EyeOutlined,
  PlusOutlined,
  FilterOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import { useMovement } from "../../hook/useMovement";
import { FormEditing } from "@/components/form/formConfig";
import { MovementType } from "../../model/moviment.model";
import { MovementForm } from "../form/moviment.form";
import { useAccount } from "@/Movement/hook/useAccount";
import { useCard } from "@/Movement/hook/useCard";
import { useCategory } from "@/Movement/hook/useCategory";
import { StandardTable } from "@/components/table/StandardTableSimples";
import { MovementDetail } from "./movementDetail";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const formatCurrency = (value: string | number) => {
  const numericValue = typeof value === "string" ? parseFloat(value || "0") : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
};

export const Movement = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false); // Controle do Filtro no Mobile
  const [editingMovement, setEditingMovement] = useState<MovementType | null>(null);
  const [editingMode, setEditingMode] = useState<FormEditing>("criar");
  const [form] = Form.useForm();
  
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailMovement, setDetailMovement] = useState<MovementType | null>(null);

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  const [query, setQuery] = useState({
    descmovimento: "",
    codcategoria: "",
    codconta: "",
    codcard: "",
    datainicio: "",
    datafim: "",
  });

  const [sorter, setSorter] = useState<{
    field: string;
    order: "ascend" | "descend" | null;
  } | null>(null);

  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  const { deleteMovement, listMovement } = useMovement();
  const { listAccount } = useAccount();
  const { listCategory } = useCategory();
  const { listCard } = useCard();
  
  const accountQuery = listAccount ? listAccount({}) : { data: null, isLoading: false };
  const categoryQuery = listCategory ? listCategory({}) : { data: null, isLoading: false };
  const cardQuery = listCard ? listCard({}) : { data: null, isLoading: false };
  //@ts-ignore
  const accountsData = accountQuery.data?.content ?? accountQuery.data ?? [];
    //@ts-ignore
  const categoriesData = categoryQuery.data?.content ?? categoryQuery.data ?? [];
    //@ts-ignore
  const cardData = cardQuery.data?.content ?? cardQuery.data ?? [];

  const handleDelete = (id: number) => {
    deleteMovement.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Movimentação removida com sucesso!" });
      }
    });
  };

  const handleSearch = (values: any) => {
    let datainicio = "";
    let datafim = "";

    if (values.periodo && values.periodo.length === 2) {
      datainicio = values.periodo[0].format("YYYY-MM-DD");
      datafim = values.periodo[1].format("YYYY-MM-DD");
    }

    setQuery({
      descmovimento: values.descmovimento || "",
      codcategoria: values.categoria || "", 
      codconta: values.conta || "",
      codcard: values.cartao || "",
      datainicio,
      datafim,
    });
    setPagination((prev) => ({ ...prev, page: 0 }));
    setDrawerVisible(false); // Fecha o menu de filtros se estiver no mobile
  };

  const handleClear = () => {
    form.resetFields();
    setQuery({
      descmovimento: "",
      codcard: "",
      codcategoria: "",
      codconta: "",
      datainicio: "",
      datafim: "",
    });
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const movementData = listMovement({
    page: pagination.page,
    size: pagination.size,
    descmovimento: query.descmovimento || undefined,
      //@ts-ignore
    codcategoria: query.codcategoria || undefined,
      //@ts-ignore
    codconta: query.codconta || undefined,
    codcard: query.codcard || undefined,
    datainicio: query.datainicio || undefined,
    datafim: query.datafim || undefined,
    ...(sorter?.field && sorter?.order
      ? { sort: `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"}` }
      : {}),
  });
  const data = movementData.data?.content ?? [];

  const columns = [
    { title: "Cód.", key: "codmovimentacao", width: 70, align: "center" as const, dataIndex: "codmovimentacao", sorter: true },
    { 
      title: "Data Mov.", 
      key: "datamov", 
      width: 110, 
      align: "center" as const, 
      dataIndex: "datamov", 
      sorter: true,
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    { title: "Descrição", key: "descmovimento", width: 180, dataIndex: "descmovimento", sorter: true, render: (text: string) => <Text strong>{text}</Text> },
    { title: "Valor Unit.", key: "valorunit", width: 120, align: "right" as const, dataIndex: "valorunit", sorter: true, render: (valor: string) => formatCurrency(valor) },
    { title: "Juros (%)", key: "porcjuros", width: 90, align: "center" as const, dataIndex: "porcjuros", sorter: true, render: (valor: string) => `${parseFloat(valor || "0")}%` },
    { title: "Valor Juros", key: "valorjuros", width: 120, align: "right" as const, dataIndex: "valorjuros", sorter: true, render: (valor: string) => formatCurrency(valor) },
    { title: "P. Atual", key: "qtdparcatual", width: 80, align: "center" as const, dataIndex: "qtdparcatual" },
    { title: "P. Final", key: "qtdparcfinal", width: 80, align: "center" as const, dataIndex: "qtdparcfinal", sorter: true },
    { title: "P. Pend.", key: "qtdparcpendente", width: 80, align: "center" as const, dataIndex: "qtdparcpendente", sorter: true },
    { title: "Total Pendente", key: "valortotalpendente", width: 130, align: "right" as const, dataIndex: "valortotalpendente", sorter: true, render: (valor: string) => formatCurrency(valor) },
    { 
      title: "Data Fim", 
      key: "datafimmov", 
      width: 110, 
      align: "center" as const, 
      dataIndex: "datafimmov", 
      sorter: true,
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    { title: "Categoria", key: "categoria", width: 130, dataIndex: ["categoria", "desccategoria"], sorter: true, render: (text: string) => text || "-" },
    { title: "Conta", key: "conta", width: 140, dataIndex: ["conta", "descconta"], render: (text: string) => text || "-" },
    { title: "Cartão", key: "cartao", width: 140, dataIndex: ["cartao", "desccartao"], render: (text: string) => text || "-" },
    { title: "Forma Pag.", key: "formapagamento", width: 130, dataIndex: ["formapagamento", "descformpag"], render: (text: string) => text || "-" },
    { 
      title: "Status", 
      key: "status", 
      width: 110, 
      align: "center" as const, 
      dataIndex: ["status", "descstatus"],
      render: (text: string) => {
        const status = text || "ABERTO";
        const isAberto = status === "ABERTO";
        return <Badge status={isAberto ? "processing" : "success"} text={status} />;
      }
    },
    { title: "Criação", key: "datacriacao", width: 140, align: "center" as const, dataIndex: "datacriacao", sorter: true, render: (date: string) => date ? dayjs(date).format("DD/MM/YY HH:mm") : "-" },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: MovementType) => (
        <Space size="middle">
          <Button type="text" size="small" icon={<EyeOutlined style={{ color: "#52c41a" }} />} onClick={() => { setDetailMovement(record); setDetailVisible(true); }} />
          <Button type="text" size="small" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => { setEditingMovement(record); setEditingMode("editar"); setModalVisible(true); }} />
          <Popconfirm title="Deletar?" onConfirm={() => handleDelete(Number(record.codmovimentacao))} okText="Sim" cancelText="Não">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totals = useMemo(() => {
    let totalUnitario = 0;
    let totalJuros = 0;
    let totalPendente = 0;
    data.forEach((record: any) => {
      totalUnitario += parseFloat(record.valorunit || "0");
      totalJuros += parseFloat(record.valorjuros || "0");
      totalPendente += parseFloat(record.valortotalpendente || "0");
    });
    return { totalUnitario, totalJuros, totalPendente };
  }, [data]);

  const renderSummary = () => (
    <Table.Summary fixed>
      <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
        <Table.Summary.Cell index={0} align="center">Total</Table.Summary.Cell>
        <Table.Summary.Cell index={1} /><Table.Summary.Cell index={2} />
        <Table.Summary.Cell index={3} align="right"><Text strong style={{ color: "#3f8600" }}>{formatCurrency(totals.totalUnitario)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={4} />
        <Table.Summary.Cell index={5} align="right"><Text strong type="danger">{formatCurrency(totals.totalJuros)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={6} /><Table.Summary.Cell index={7} /><Table.Summary.Cell index={8} />
        <Table.Summary.Cell index={9} align="right"><Text strong type="warning">{formatCurrency(totals.totalPendente)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={10} /><Table.Summary.Cell index={11} /><Table.Summary.Cell index={12} />
        <Table.Summary.Cell index={13} /><Table.Summary.Cell index={14} /><Table.Summary.Cell index={15} />
        <Table.Summary.Cell index={16} /><Table.Summary.Cell index={17} />
      </Table.Summary.Row>
    </Table.Summary>
  );

  // Conteúdo do formulário isolado para reuso (no Card para Desktop ou Drawer para Mobile)
  const FilterForm = () => (
    <Form layout="vertical" form={form} onFinish={handleSearch}>
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={12} md={5} lg={5}>
          <Form.Item label="Descrição" name="descmovimento">
            <Input placeholder="Ex: Compra Mercado" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <Form.Item label="Categoria" name="categoria">
            <Select
              placeholder="Selecione..."
              allowClear
              showSearch
              loading={categoryQuery.isLoading}
              optionFilterProp="children"
              options={categoriesData?.map((cat: any) => ({ value: cat.codcategoria, label: cat.desccategoria }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <Form.Item label="Conta" name="conta">
            <Select
              placeholder="Selecione..."
              allowClear
              showSearch
              loading={accountQuery.isLoading}
              optionFilterProp="children"
              options={accountsData?.map((acc: any) => ({ value: acc.codconta, label: acc.descconta }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4} lg={4}>
          <Form.Item label="Cartão" name="cartao">
            <Select
              placeholder="Selecione..."
              allowClear
              showSearch
              loading={cardQuery.isLoading}
              optionFilterProp="children"
              options={cardData?.map((acc: any) => ({ value: acc.codcartao, label: acc.desccartao }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={7} lg={7}>
          <Form.Item label="Período (Data Mov.)" name="periodo">
            <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder={['Início', 'Fim']} />
          </Form.Item>
        </Col>
      </Row>
      <Flex gap="12px" justify="end" style={{ marginTop: isMobile ? 16 : 0, marginBottom: isMobile ? 0 : 16 }}>
        <Button icon={<ClearOutlined />} onClick={handleClear} block={isMobile}>Limpar</Button>
        <Button type="primary" htmlType="submit" icon={<SearchOutlined />} block={isMobile}>Filtrar</Button>
      </Flex>
    </Form>
  );

  return (
    <div style={{ padding: isMobile ? "8px" : "0px" }}>
      {/* Cabeçalho */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }} wrap="wrap" gap="12px">
        <div>
          <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>Movimentações</Title>
          <Text type="secondary">Consulte ou gerencie as movimentações financeiras.</Text>
        </div>
        <Space size="small">
          {isMobile && (
            <Button icon={<FilterOutlined />} onClick={() => setDrawerVisible(true)}>
              Filtros
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => { setEditingMovement(null); setEditingMode("criar"); setModalVisible(true); }}
          >
            {isMobile ? "Nova" : "Nova Movimentação"}
          </Button>
        </Space>
      </Flex>

      {/* Filtros em formato Desktop */}
      {!isMobile && (
        <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: "24px 24px 0 24px" }}>
          <FilterForm />
        </Card>
      )}

      {/* Filtros em formato Mobile (Drawer lateral) */}
      <Drawer title="Filtrar Movimentações" placement="right" onClose={() => setDrawerVisible(false)} open={drawerVisible} width="85%">
        <FilterForm />
      </Drawer>

      {/* Listagem Principal */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {isMobile ? (
            <Flex vertical gap="12px">
              {/* Card de Resumo Financeiro Mobile */}
              <Card size="small" style={{ background: "#fafafa", borderLeft: "4px solid #1890ff" }}>
                <Row gutter={[8, 4]}>
                  <Col span={12}><Text type="secondary">Total Unitário:</Text></Col>
                  <Col span={12} style={{ textAlign: 'right' }}><Text strong style={{ color: "#3f8600" }}>{formatCurrency(totals.totalUnitario)}</Text></Col>
                  <Col span={12}><Text type="secondary">Total Juros:</Text></Col>
                  <Col span={12} style={{ textAlign: 'right' }}><Text strong type="danger">{formatCurrency(totals.totalJuros)}</Text></Col>
                  <Col span={12}><Text strong>Total Pendente:</Text></Col>
                  <Col span={12} style={{ textAlign: 'right' }}><Text strong type="warning">{formatCurrency(totals.totalPendente)}</Text></Col>
                </Row>
              </Card>

              {/* Grid de Cards Mobile */}
              {data.length === 0 ? (
                <Card bodyStyle={{ textAlign: 'center', padding: 24 }}><Text type="secondary">Nenhuma movimentação encontrada.</Text></Card>
              ) : (
                data.map((record: any) => {
                  const isAberto = (record.status?.descstatus || "ABERTO") === "ABERTO";
                  return (
                    <Card 
                      key={record.codmovimentacao} 
                      size="small"
                      hoverable
                      title={
                        <Flex justify="space-between" align="center">
                          <Text strong style={{ fontSize: "14px", maxWidth: "70%" }} ellipsis>{record.descmovimento}</Text>
                          <Badge status={isAberto ? "processing" : "success"} text={record.status?.descstatus || "ABERTO"} />
                        </Flex>
                      }
                      actions={[
                        <Button type="text" size="small" icon={<EyeOutlined style={{ color: "#52c41a" }} />} onClick={() => { setDetailMovement(record); setDetailVisible(true); }} />,
                        <Button type="text" size="small" icon={<EditOutlined style={{ color: "#1890ff" }} />} onClick={() => { setEditingMovement(record); setEditingMode("editar"); setModalVisible(true); }} />,
                        <Popconfirm title="Deletar?" onConfirm={() => handleDelete(Number(record.codmovimentacao))} okText="Sim" cancelText="Não">
                          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ]}
                    >
                      <Row gutter={[8, 6]} style={{ padding: "4px 0" }}>
                        <Col span={12}><Text type="secondary">Cód / Data:</Text></Col>
                        <Col span={12} style={{ textAlign: "right" }}><Text strong>#{record.codmovimentacao}</Text> - {record.datamov ? dayjs(record.datamov).format("DD/MM/YYYY") : "-"}</Col>
                        
                        <Col span={12}><Text type="secondary">Valor Unitário:</Text></Col>
                        <Col span={12} style={{ textAlign: "right" }}><Text strong style={{ color: "#262626" }}>{formatCurrency(record.valorunit)}</Text></Col>
                        
                        <Col span={12}><Text type="secondary">Parc. Pendentes:</Text></Col>
                        <Col span={12} style={{ textAlign: "right" }}><Text type="danger">{record.qtdparcpendente || 0} <Text type="secondary" style={{ fontSize: 11 }}>de {record.qtdparcfinal || 0}</Text></Text></Col>

                        <Col span={12}><Text type="secondary">Total Pendente:</Text></Col>
                        <Col span={12} style={{ textAlign: "right" }}><Text type="warning" strong>{formatCurrency(record.valortotalpendente)}</Text></Col>
                        
                        <Col span={24}><Divider style={{ margin: "6px 0" }} /></Col>
                        
                        <Col span={12}><Text type="secondary">Conta / Banco:</Text></Col>
                        <Col span={12} style={{ textAlign: "right" }} ><Text type="secondary">{record.conta?.descconta || "-"}</Text></Col>
                      </Row>
                    </Card>
                  );
                })
              )}
              
              {/* Paginação Mobile Slim */}
              <Flex justify="center" style={{ marginTop: 8, marginBottom: 16 }}>
                <Table 
                  dataSource={[]} 
                  pagination={{
                    current: pagination.page + 1,
                    pageSize: pagination.size,
                    total: movementData.data?.totalElements ?? 0,
                    size: "small",
                    showSizeChanger: false,
                    onChange: (page) => setPagination((prev) => ({ ...prev, page: page - 1 })),
                  }}
                />
              </Flex>
            </Flex>
          ) : (
            // Desktop
            <Card bodyStyle={{ padding: 0 }}>
              <StandardTable
                rowKey="codmovimentacao"
                columns={columns}
                dataSource={data}
                scroll={{ x: 1800, y: "calc(100vh - 380px)" }} // Scroll fixo Y ajuda muito dentro de Outlets
                summary={renderSummary}
                loading={movementData.isLoading || movementData.isFetching}
                onChange={(_, __, sorter: any) => {
                  setSorter({ field: sorter.field, order: sorter.order });
                }}
                pagination={{
                  current: pagination.page + 1,
                  pageSize: pagination.size,
                  total: movementData.data?.totalElements ?? 0,
                  showSizeChanger: true,
                  onChange: (page, size) => setPagination({ page: page - 1, size }),
                }}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* Modais mantidos idênticos de acordo com a sua estrutura anterior */}
      <Modal
        title={editingMode === "criar" ? "Nova Movimentação" : "Editar Movimentação"}
        open={modalVisible}
        footer={null}
        destroyOnClose
        width={isMobile ? "100%" : 650}
        style={{ top: isMobile ? 0 : 60 }}
        bodyStyle={{ padding: isMobile ? "8px 16px" : "24px" }}
        onCancel={() => { setModalVisible(false); setEditingMovement(null); setEditingMode("criar"); }}
      >
        <MovementForm
          formEditing={editingMode}
          onClose={() => setModalVisible(false)}
          data={(editingMovement ?? {
            indativo: true, descmovimento: "", valorunit: "0", porcjuros: "0", valorjuros: "0",
            tipoparcelamento: 1, qtdparcatual: 1, qtdparcfinal: 1, qtdparcpendente: 0, valortotalpendente: "0",
          }) as MovementType}
        />
      </Modal>

      <MovementDetail visible={detailVisible} onClose={() => { setDetailVisible(false); setDetailMovement(null); }} movement={detailMovement} />
    </div>
  );
});