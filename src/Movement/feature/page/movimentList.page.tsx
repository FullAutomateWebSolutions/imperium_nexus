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
  Breadcrumb,
  DatePicker,
  Popconfirm,
  Select, 
  Table, 
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ClearOutlined, 
  EyeOutlined // Importado o ícone de Olho
} from "@ant-design/icons";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import { useMovement } from "../../hook/useMovement";
import { FormEditing } from "@/components/form/formConfig";

import { MovementType } from "../../model/moviment.model";
import { MovementForm } from "../form/moviment.form";
import { MovementDetail } from "./MovementDetail"; // Importado o componente de detalhes
import { useAccount } from "@/Movement/hook/useAccount";
import { useCard } from "@/Movement/hook/useCard";
import { useCategory } from "@/Movement/hook/useCategory";
import { StandardTable } from "@/components/table/StandardTableSimples";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const Movement = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovement, setEditingMovement] = useState<MovementType | null>(null);
  const [editingMode, setEditingMode] = useState<FormEditing>("criar");
  const [form] = Form.useForm();
  
  // Novos estados para controlar a tela de detalhes
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailMovement, setDetailMovement] = useState<MovementType | null>(null);

  const [query, setQuery] = useState({
    descmovimento: "",
    codcategoria: "",
    codconta: "",
    datainicio: "",
    datafim: "",
  });

  const [sorter, setSorter] = useState<{
    field: string;
    order: "ascend" | "descend" | null;
  } | null>(null);

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const { deleteMovement, listMovement } = useMovement();
  const { listAccount } = useAccount();
  const { listCard } = useCard();
  const { listCategory } = useCategory();
  const accountQuery = listAccount ? listAccount({}) : { data: null, isLoading: false };
  const categoryQuery = listCategory ? listCategory({}) : { data: null, isLoading: false };

  const accountsData = accountQuery.data?.content ?? accountQuery.data ?? [];
  const categoriesData = categoryQuery.data?.content ?? categoryQuery.data ?? [];

  const handleDelete = (id: number) => {
    deleteMovement.mutate({ id }, {
      onSuccess: () => {
        notification.success({ message: "Status removido com sucesso!" });
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
      datainicio,
      datafim,
    });
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleClear = () => {
    form.resetFields();
    setQuery({
      descmovimento: "",
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
    descmovimento: query.descmovimento,
    codcategoria: query.codcategoria,
    codconta: query.codconta,
    datainicio: query.datainicio,
    datafim: query.datafim,
    ...(sorter?.field && sorter?.order
      ? {
          sort: `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"}`,
        }
      : {}),
  });
  const data = movementData.data?.content ?? [];

  // MAPEAMENTO EM LINHA COM OS WIDTHS CONFIGURADOS
  const columns = [
    {
      title: "Cód.",
      key: "codmovimentacao",
      width: 70,
      align: "center" as const,
      dataIndex: "codmovimentacao",
    },
    {
      title: "Data Mov.",
      key: "datamov",
      width: 110,
      align: "center" as const,
      dataIndex: "datamov",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Descrição",
      key: "descmovimento",
      width: 180,
      dataIndex: "descmovimento",
      sorter: true,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: "Valor Unit.",
      key: "valorunit",
      width: 120,
      align: "right" as const,
      dataIndex: "valorunit",
      render: (valor: string) => `R$ ${parseFloat(valor || "0").toFixed(2)}`,
    },
    {
      title: "Juros (%)",
      key: "porcjuros",
      width: 90,
      align: "center" as const,
      dataIndex: "porcjuros",
      render: (valor: string) => `${parseFloat(valor || "0")}%`,
    },
    {
      title: "Valor Juros",
      key: "valorjuros",
      width: 120,
      align: "right" as const,
      dataIndex: "valorjuros",
      render: (valor: string) => `R$ ${parseFloat(valor || "0").toFixed(2)}`,
    },
    {
      title: "P. Atual",
      key: "qtdparcatual",
      width: 80,
      align: "center" as const,
      dataIndex: "qtdparcatual",
    },
    {
      title: "P. Final",
      key: "qtdparcfinal",
      width: 80,
      align: "center" as const,
      dataIndex: "qtdparcfinal",
    },
    {
      title: "P. Pend.",
      key: "qtdparcpendente",
      width: 80,
      align: "center" as const,
      dataIndex: "qtdparcpendente",
    },
    {
      title: "Total Pendente",
      key: "valortotalpendente",
      width: 130,
      align: "right" as const,
      dataIndex: "valortotalpendente",
      render: (valor: string) => `R$ ${parseFloat(valor || "0").toFixed(2)}`,
    },
    {
      title: "Data Fim",
      key: "datafimmov",
      width: 110,
      align: "center" as const,
      dataIndex: "datafimmov",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Categoria",
      key: "categoria",
      width: 130,
      dataIndex: ["categoria", "desccategoria"],
      render: (text: string) => text || "-",
    },
    {
      title: "Conta",
      key: "conta",
      width: 140,
      dataIndex: ["conta", "descconta"],
      render: (text: string) => text || "-",
    },
    {
      title: "Cartão",
      key: "cartao",
      width: 140,
      dataIndex: ["cartao", "desccartao"],
      render: (text: string) => text || "-",
    },
    {
      title: "Forma Pag.",
      key: "formapagamento",
      width: 130,
      dataIndex: ["formapagamento", "descformpag"],
      render: (text: string) => text || "-",
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      align: "center" as const,
      dataIndex: ["status", "descstatus"],
      render: (text: string) => text || "ABERTO",
    },
    {
      title: "Criação",
      key: "datacriacao",
      width: 140,
      align: "center" as const,
      dataIndex: "datacriacao",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YY HH:mm") : "-",
    },
    {
      title: "Ações",
      key: "actions",
      width: 130, // Largura levemente aumentada para caber os 3 botões perfeitamente
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: MovementType) => (
        <Space size="small">
          {/* BOTÃO DE VISUALIZAR DETALHES ADICIONADO */}
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#52c41a" }} />}
            onClick={() => {
              setDetailMovement(record);
              setDetailVisible(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => {
              setEditingMovement(record);
              setEditingMode("editar");
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDelete(Number(record.codmovimentacao))}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // RESUMO DE VALORES CORRIGIDO COM O TABLE NATIVO
  const renderSummary = (pageData: any[]) => {
    let totalUnitario = 0;
    let totalJuros = 0;
    let totalPendente = 0;

    pageData.forEach((record) => {
      totalUnitario += parseFloat(record.valorunit || "0");
      totalJuros += parseFloat(record.valorjuros || "0");
      totalPendente += parseFloat(record.valortotalpendente || "0");
    });

    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
          <Table.Summary.Cell index={0} align="center">Total</Table.Summary.Cell>
          <Table.Summary.Cell index={1} />
          <Table.Summary.Cell index={2} />
          {/* Total Valor Unit. */}
          <Table.Summary.Cell index={3} align="right">
            <Text strong style={{ color: "#3f8600" }}>R$ {totalUnitario.toFixed(2)}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} />
          {/* Total Juros */}
          <Table.Summary.Cell index={5} align="right">
            <Text strong type="danger">R$ {totalJuros.toFixed(2)}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6} />
          <Table.Summary.Cell index={7} />
          <Table.Summary.Cell index={8} />
          {/* Total Pendente */}
          <Table.Summary.Cell index={9} align="right">
            <Text strong type="warning">R$ {totalPendente.toFixed(2)}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={10} />
          <Table.Summary.Cell index={11} />
          <Table.Summary.Cell index={12} />
          <Table.Summary.Cell index={13} />
          <Table.Summary.Cell index={14} />
          <Table.Summary.Cell index={15} />
          <Table.Summary.Cell index={16} />
          <Table.Summary.Cell index={17} />
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 0 }}>
            <Form layout="vertical" form={form} onFinish={handleSearch}>
              <Row gutter={16} align="bottom">
                <Col xs={24} sm={12} md={5}>
                  <Form.Item label="Descrição" name="descmovimento">
                    <Input placeholder="Ex: Compra Mercado" allowClear />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={4}>
                  <Form.Item label="Categoria" name="categoria">
                    <Select
                      placeholder="Selecione..."
                      allowClear
                      showSearch
                      loading={categoryQuery.isLoading}
                      optionFilterProp="children"
                      options={categoriesData?.map((cat: any) => ({
                        value: cat.codcategoria,
                        label: cat.desccategoria,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={4}>
                  <Form.Item label="Conta" name="conta">
                    <Select
                      placeholder="Selecione..."
                      allowClear
                      showSearch
                      loading={accountQuery.isLoading}
                      optionFilterProp="children"
                      options={accountsData?.map((acc: any) => ({
                        value: acc.codconta,
                        label: acc.descconta,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Período (Data Mov.)" name="periodo">
                    <RangePicker 
                      format="DD/MM/YYYY" 
                      style={{ width: '100%' }}
                      placeholder={['Início', 'Fim']}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={5}>
                  <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                      <Button type="default" icon={<ClearOutlined />} onClick={handleClear}>
                        Limpar
                      </Button>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        Filtrar
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card 
            title="Movimentações Planilhadas"
            extra={
              <Button
                type="primary"
                onClick={() => {
                  setEditingMovement(null);
                  setEditingMode("criar");
                  setModalVisible(true);
                }}
              >
                Nova Movimentação
              </Button>
            }
          >
            <StandardTable
              rowKey="codmovimentacao"
              columns={columns}
              dataSource={data}
              scroll={{ x: 2100 }} 
              summary={renderSummary}
              loading={movementData.isLoading || movementData.isFetching}
              onChange={(_, __, sorter: any) => {
                setSorter({
                  field: sorter.field,
                  order: sorter.order,
                });
              }}
              pagination={{
                current: pagination.page + 1,
                pageSize: pagination.size,
                total: movementData.data?.totalElements ?? 0,
                showSizeChanger: true,
                onChange: (page, size) => {
                  setPagination({
                    page: page - 1,
                    size,
                  });
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingMode === "criar" ? "Nova Movimentação" : "Editar Movimentação"}
        open={modalVisible}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setModalVisible(false);
          setEditingMovement(null);
          setEditingMode("criar");
        }}
      >
        <MovementForm
          formEditing={editingMode}
          onClose={() => setModalVisible(false)}
          data={
            (editingMovement ?? {
              indativo: true,
              descmovimento: "",
              valorunit: "0",
              porcjuros: "0",
              valorjuros: "0",
              tipoparcelamento: 1,
              qtdparcatual: 1,
              qtdparcfinal: 1,
              qtdparcpendente: 0,
              valortotalpendente: "0",
            }) as MovementType
          }
        />
      </Modal>

      {/* COMPONENTE DA NOVA TELA GAVETA DE DETALHES ADICIONADO AQUI */}
      <MovementDetail
        visible={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setDetailMovement(null);
        }}
        movement={detailMovement}
      />
    </>
  );
});