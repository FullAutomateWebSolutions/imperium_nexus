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
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";

import { StandardTable } from "@/components/table/StandardTableSimples";
import { useMovement } from "../hook/useMovement";
import { FormEditing } from "@/components/form/formConfig";


// Fallbacks de segurança caso esses arquivos ainda dependam de ajustes estruturais no seu app

import { MovementType } from "../model/moviment.model";
import { MovementForm } from "./moviment.form";
import { navigationHistory } from "@/customer/model/customerNavigationHistory";

const { Title } = Typography;

export const Movement = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovement, setEditingMovement] = useState<MovementType | null>(null);
  const [editingMode, setEditingMode] = useState<FormEditing>("criar");
  const [form] = Form.useForm();
  
  // Estado para os parâmetros de filtros de busca
  const [query, setQuery] = useState(() => {
    const search = new URLSearchParams(window.location.search);
    // return typeof MovementQuery?.fromSearchParams === "function"
    //   ? MovementQuery.fromSearchParams(search)
    //   : { descmovimento: "", categoria: "", conta: "" };
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

  const handleSearch = (values: any) => {
    const currentFilters = {
      descmovimento: values.descmovimento,
      // Passando as strings/IDs conforme o backend aceitar nos filtros
      codcategoria: values.categoria, 
      codconta: values.conta,
    };

    // setQuery(
    //   typeof MovementQuery === "function" 
    //     ? new MovementQuery({ ...query, page: 0, ...currentFilters }) 
    //     : { ...query, ...currentFilters }
    // );
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Hook unificado consumindo paginação, ordenação e os filtros ativos do estado 'query'
  const movementData = listMovement({
    page: pagination.page,
    size: pagination.size,
    // descmovimento: query?.descmovimento,
    // codcategoria: query?.codcategoria,
    // codconta: query?.codconta,
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
      width: "8%",
      align: "center" as const,
      dataIndex: "codmovimentacao",
    },
    {
      title: "Descrição",
      key: "descmovimento",
      width: "20%",
      dataIndex: "descmovimento",
      sorter: (a: MovementType, b: MovementType) =>
        (a.descmovimento || "").localeCompare(b.descmovimento || ""),
    },
    {
      title: "Valor Unit.",
      key: "valorunit",
      width: "12%",
      dataIndex: "valorunit",
      render: (valor: string) => `R$ ${parseFloat(valor || "0").toFixed(2)}`,
    },
    {
      title: "Categoria",
      key: "categoria",
      width: "12%",
      dataIndex: ["categoria", "desccategoria"],
      render: (text: string) => text ? <Tag color="blue">{text}</Tag> : "-",
    },
    {
      title: "Conta",
      key: "conta",
      width: "12%",
      dataIndex: ["conta", "descconta"],
      render: (text: string) => text || "-",
    },
    {
      title: "Forma Pag.",
      key: "formapagamento",
      width: "12%",
      dataIndex: ["formapagamento", "descformpag"],
      render: (text: string) => text || "-",
    },
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
      width: "12%",
      align: "center" as const,
      dataIndex: "datamov",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Ações",
      key: "actions",
      width: "10%",
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

  // function createdScreenOne() {
  //   navigationHistory?.navigate?.("Movement", { id: 1 });
  // }
  // function createdScreenTwo() {
  //   navigationHistory?.navigate?.("Movement dois", { id: 2 });
  // }

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
        {/* {navigationHistory?.getBreadcrumb && ( */}
          <>
            {/* <Flex 
              justify="space-between"
              align="center"
              style={{ marginBottom: 16, border: "1px solid #f0f0f0", padding: 8, borderRadius: 6 }}
            > */}
              {/* <p>{JSON.stringify(navigationHistory.getBreadcrumb())}</p> */}
              {/* <Space> */}
                {/* <Button onClick={() => navigationHistory.telaAnterior?.()}>Anterior</Button>
                <Button onClick={() => createdScreenOne()}> Criar 1</Button>
                <Button onClick={() => createdScreenTwo()}> Criar 2</Button> */}
                {/* <Button onClick={() => navigationHistory.proximaTela?.()}> Próximo</Button> */}
              {/* </Space> */}
            {/* </Flex> */}
          
            {/* <Breadcrumb
              style={{ textAlign: "center", marginBottom: 32, color: "#666666" }}
              items={navigationHistory.getBreadcrumb()}
            /> */}
          </>
        {/* )} */}
        
        <Title level={3} style={{ textAlign: "center", marginBottom: 32, color: "#666666" }}>
          Movimentações Financeiras
        </Title>

        <Row gutter={[24, 24]} justify="center">
          {/* FILTROS */}
          {/* <Col xs={24} md={8} lg={6} xl={5}>
            <Card title="Filtros">
              <Form layout="vertical" form={form} onFinish={handleSearch}>
                <Form.Item label="Descrição" name="descmovimento">
                  <Input placeholder="Ex: Compra Mercado" />
                </Form.Item>

                <Form.Item label="Categoria" name="categoria">
                  <Input placeholder="Ex: ALIMENTACAO" />
                </Form.Item>

                <Form.Item label="Conta" name="conta">
                  <Input placeholder="Ex: Conta Principal" />
                </Form.Item>

                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" htmlType="submit" block>
                    Pesquisar
                  </Button>
                  <Button type="link" onClick={() => { form.resetFields(); handleSearch({}); }} block>
                    Limpar
                  </Button>
                </Space>
              </Form>
            </Card>
          </Col> */}

          {/* TABELA */}
          {/* <Col xs={24} md={16} lg={18} xl={19}> */}
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
                // loading={movementdata.isPending}
                onChange={(_, __, sorter: any) => {
                  setSorter(sorter);
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
          {/* </Col> */}
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