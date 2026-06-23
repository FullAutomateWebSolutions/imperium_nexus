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
  Popconfirm,
  Select, 
} from "antd";
import { 
  DeleteOutlined, 
  EditOutlined, 
  SearchOutlined, 
  ClearOutlined, 
  CreditCardOutlined,
  CalendarOutlined,
  DollarOutlined,
  PieChartOutlined,
  WalletOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import { StandardTable } from "@/components/table/StandardTableSimples";
import { useMovement } from "../../hook/useMovement";
import { FormEditing } from "@/components/form/formConfig";

import { MovementType } from "../../model/moviment.model";
import { MovementForm } from "../form/moviment.form";
import { navigationHistory } from "@/customer/model/customerNavigationHistory";
import { useAccount } from "@/Movement/hook/useAccount";
import { useCard } from "@/Movement/hook/useCard";
import { useCategory } from "@/Movement/hook/useCategory";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const Movement = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovement, setEditingMovement] = useState<MovementType | null>(null);
  const [editingMode, setEditingMode] = useState<FormEditing>("criar");
  const [form] = Form.useForm();
  
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
//@ts-ignore
  const accountsData = accountQuery.data?.content ?? accountQuery.data ?? [];
  //@ts-ignore
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
    //@ts-ignore
    codcategoria: query.codcategoria,
    //@ts-ignore
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

  // DEFINIÇÃO DAS COLUNAS EXIBINDO 100% DOS DADOS DO PAYLOAD JSON
  const columns = [
    {
      title: "Identificação",
      key: "identificacao",
      width: "22%",
      render: (_: any, record: any) => (
        <Space direction="vertical" size={2}>
          <Space>
            <Tag color="blue">#{record.codmovimentacao}</Tag>
            <Text strong>{record.descmovimento}</Text>
          </Space>
          
          <Space size={4} wrap style={{ marginTop: 4 }}>
            {record.categoria?.desccategoria && (
              <Tag icon={<PieChartOutlined />} color="cyan">
                {record.categoria.desccategoria}
              </Tag>
            )}
            {record.conta?.descconta && (
              <Tag icon={<WalletOutlined />} color="purple">
                {record.conta.descconta} ({record.conta.tipoconta})
              </Tag>
            )}
            {record.cartao?.desccartao && (
              <Tag icon={<CreditCardOutlined />} color="orange">
                {record.cartao.desccartao}
              </Tag>
            )}
          </Space>
        </Space>
      ),
      sorter: true,
    },
    {
      title: "Valores e Custos",
      key: "valores_detalhados",
      width: "23%",
      render: (_: any, record: any) => {
        const vUnit = parseFloat(record.valorunit || "0");
        const vJuros = parseFloat(record.valorjuros || "0");
        const pJuros = parseFloat(record.porcjuros || "0");
        
        return (
          <Space direction="vertical" size={1}>
            <div>
              <Text type="secondary" >Unitário: </Text>
              <Text strong>R$ {vUnit.toFixed(2)}</Text>
            </div>
            {vJuros > 0 && (
              <div>
                <Text type="danger" >Juros ({pJuros}%): </Text>
                <Text type="danger" strong>+ R$ {vJuros.toFixed(2)}</Text>
              </div>
            )}
            <div style={{ borderTop: "1px dashed #f0f0f0", marginTop: 2, paddingTop: 2 }}>
              <Text type="secondary" >Total Parcela: </Text>
              <Text strong style={{ color: "#237804" }}>
                R$ {(vUnit + vJuros).toFixed(2)}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Cronograma e Parcelas",
      key: "Fluxo_parcelas",
      width: "25%",
      render: (_: any, record: any) => {
        const totalPend = parseFloat(record.valortotalpendente || "0");
        const tipoParc = record.tipoparcelamento === 1 ? "Parcelado" : record.tipoparcelamento === 2 ? "À Vista" : "PIX";
        const formaPag = record.formapagamento?.descformpag || record.formapagamento?.tipoformpag || "-";

        return (
          <Space direction="vertical" size={1}>
            <Space size={4} wrap>
              <Tag color="geekblue">{tipoParc}</Tag>
              <Tag color="magenta">{formaPag}</Tag>
            </Space>
            
            {record.qtdparcfinal > 1 ? (
              <div style={{ marginTop: 4 }}>
                <Text  type="secondary">Evolução: </Text>
                <Text strong>{record.qtdparcatual} de {record.qtdparcfinal}</Text>
                <br />
                <Text  type="secondary">Pendente: </Text>
                <Text type="warning" strong>{record.qtdparcpendente} parc. (R$ {totalPend.toFixed(2)})</Text>
              </div>
            ) : (
              <Text type="secondary" style={{ fontSize: "12px" }}>Sem parcelas pendentes</Text>
            )}
          </Space>
        );
      },
    },
    {
      title: "Linha do Tempo / Status",
      key: "linha_tempo",
      width: "18%",
      render: (_: any, record: any) => {
        const status = record.status?.descstatus || "ABERTO";
        const statusCor = status === "ABERTO" ? "warning" : "success";
        
        return (
          <Space direction="vertical" size={0}>
            <Tag color={statusCor} style={{ marginBottom: 4 }}>{status}</Tag>
            
            <div style={{ fontSize: "11px", lineHeight: "14px" }}>
              <Text type="secondary"><CalendarOutlined /> Mov: </Text>
              <Text>{record.datamov ? dayjs(record.datamov).format("DD/MM/YYYY") : "-"}</Text>
              
              {record.datafimmov && record.qtdparcfinal > 1 && (
                <>
                  <br />
                  <Text type="secondary"><CalendarOutlined /> Fim: </Text>
                  <Text>{dayjs(record.datafimmov).format("DD/MM/YYYY")}</Text>
                </>
              )}
              
              <br />
              <Text type="secondary">Criado: </Text>
              <Text type="secondary">{record.datacriacao ? dayjs(record.datacriacao).format("DD/MM/YY HH:mm") : "-"}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: "12%",
      align: "center" as const,
      render: (_: any, record: MovementType) => (
        <Space >
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

                {/* CATEGORIA SELECT */}
                <Col xs={24} sm={12} md={4}>
                  <Form.Item label="Categoria" name="categoria">
                    <Select
                      placeholder="Selecione..."
                      allowClear
                      showSearch
                      loading={categoryQuery.isLoading}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={categoriesData?.map((cat: any) => ({
                        value: cat.codcategoria,
                        label: cat.desccategoria,
                      }))}
                    />
                  </Form.Item>
                </Col>

                {/* CONTA SELECT */}
                <Col xs={24} sm={12} md={4}>
                  <Form.Item label="Conta" name="conta">
                    <Select
                      placeholder="Selecione..."
                      allowClear
                      showSearch
                      loading={accountQuery.isLoading}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
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

        {/* TABELA COM 100% DAS INFORMAÇÕES EXPOSTAS E SCROLL HORIZONTAL ADAPTÁVEL */}
        <Col span={24}>
          <Card 
            title="Movimentações Detalhadas"
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
              scroll={{ x: 980 }} // Aumentado o limite de scroll para acomodar confortavelmente todos os novos dados sem espremer
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
    </>
  );
});