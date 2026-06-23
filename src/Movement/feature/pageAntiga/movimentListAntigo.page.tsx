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
import { DeleteOutlined, EditOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
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

const { Title } = Typography;
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
  const accountsData = accountQuery.data?.content ?? accountQuery.data ?? [];//@ts-ignore
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
      width: 150,
      render: (_: any, record: MovementType) => (
        <Space size="middle">
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