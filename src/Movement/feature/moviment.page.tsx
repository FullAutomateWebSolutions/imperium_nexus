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
  Tag,
  DatePicker,
} from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import { StandardTable } from "@/components/table/StandardTableSimples";
import { useMovement } from "../hook/useMovement";
import { FormEditing } from "@/components/form/formConfig";

import { MovementType } from "../model/moviment.model";
import { MovementForm } from "./moviment.form";
import { navigationHistory } from "@/customer/model/customerNavigationHistory";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export const Movement = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovement, setEditingMovement] = useState<MovementType | null>(null);
  const [editingMode, setEditingMode] = useState<FormEditing>("criar");
  const [form] = Form.useForm();
  
  // Estado para os parâmetros de filtros de busca estruturado com as novas datas
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

  // Aciona a busca passando os estados de filtro corretos e formatando as datas para string ISO (YYYY-MM-DD)
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

  // Hook unificado consumindo todos os parâmetros ativos e repassando para a API
  const movementData = listMovement({
    page: pagination.page,
    size: pagination.size,
    descmovimento: query.descmovimento,
    // codcategoria: query.codcategoria,
    // codconta: query.codconta,
    // datainicio: query.datainicio,
    // datafim: query.datafim,
    ...(sorter?.field && sorter?.order
      ? {
          sort: `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"}`,
        }
      : {}),
  });
  const data = movementData.data?.content ?? [];

  // Configuração das colunas utilizando Column Grouping (children) do Ant Design
  const columns = [
    {
      title: "Cód.",
      key: "codmovimentacao",
      width: "6%",
      align: "center" as const,
      dataIndex: "codmovimentacao",
    },
    {
      title: "Descrição",
      key: "descmovimento",
      width: "18%",
      dataIndex: "descmovimento",
      sorter: true,
    },
    {
      title: "Valores e Vínculos",
      children: [
        {
          title: "Valor Unit.",
          key: "valorunit",
          width: "11%",
          dataIndex: "valorunit",
          render: (valor: string) => `R$ ${parseFloat(valor || "0").toFixed(2)}`,
        },
        {
          title: "Categoria",
          key: "categoria",
          width: "11%",
          dataIndex: ["categoria", "desccategoria"],
          render: (text: string) => text ? <Tag color="blue">{text}</Tag> : "-",
        },
        {
          title: "Conta",
          key: "conta",
          width: "11%",
          dataIndex: ["conta", "descconta"],
          render: (text: string) => text || "-",
        },
        {
          title: "Forma Pag.",
          key: "formapagamento",
          width: "11%",
          dataIndex: ["formapagamento", "descformpag"],
          render: (text: string) => text || "-",
        },
      ],
    },
    {
      title: "Fluxo",
      children: [
        {
          title: "Status",
          key: "status",
          width: "10%",
          align: "center" as const,
          dataIndex: ["status", "descstatus"],
          render: (status: string) => (
            status ? (
              <Tag color={status === "ABERTO" ? "orange" : "green"}>{status}</Tag>
            ) : "-"
          ),
        },
        {
          title: "Data Mov.",
          key: "datamov",
          width: "11%",
          align: "center" as const,
          dataIndex: "datamov",
          render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
        },
      ],
    },
    {
      title: "Ações",
      key: "actions",
      width: "8%",
      align: "center" as const,
      render: (_: any, record: MovementType) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingMovement(record);
              setEditingMode("editar");
              setModalVisible(true);
            }}
          />
          <Button
            danger
            type="link"
            icon={<DeleteOutlined />}
            loading={deleteMovement.isPending}
            onClick={() => {
              deleteMovement.mutate({ id: record.codmovimentacao }, {
                onSuccess: (e) => {
                  notification.success({ message: e?.message || "Excluído com sucesso!" });
                }
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          padding: 24,
          maxWidth: 1600,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 32, color: "#666666" }}>
          Movimentações Financeiras
        </Title>

        <Row gutter={[16, 16]}>
          {/* SEÇÃO DE FILTROS AMPLIADA COM PERÍODO DE DATAS */}
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
                    <Form.Item label="Cód. Categoria" name="categoria">
                      <Input placeholder="Ex: 2" allowClear />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={4}>
                    <Form.Item label="Cód. Conta" name="conta">
                      <Input placeholder="Ex: 1" allowClear />
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

          {/* TABELA PRINCIPAL */}
          <Col span={24}>
            <Card 
              title="Movimentações"
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
                columns={columns}
                dataSource={data}
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
      </div>

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
    </>
  );
});