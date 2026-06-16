import { StandardTable } from "@/components/table/StandardTableSimples";
import { useCustomer } from "../hook/useCustomer";
import { useEffect, useMemo, useState } from "react";
import { cpf, cnpj } from "cpf-cnpj-validator";

import dayjs from 'dayjs';
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
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { CustomerForm } from "./customer.form";
import { CustomerType } from "../model/customer.model";
import { FormEditing } from "../../components/form/formConfig";
import { CustomerQuery } from "../model/queryCustomer.model";
import { navigationHistory } from "../model/customerNavigationHistory";
import { observer } from "mobx-react-lite";
const { Title } = Typography;

export const Customer = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(null);
  const [editingMode, setEditingMode] = useState<FormEditing>("criar");
  const [form] = Form.useForm();
  const [query, setQuery] = useState(() => {
    const search = new URLSearchParams(window.location.search);
    const hasParams = Array.from(search.keys()).length > 0;
    return CustomerQuery.fromSearchParams(search);
  });
   

  const [sorter, setSorter] = useState<{
    field: string;
    order: "ascend" | "descend" | null;
  } | null>(null);

  
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const { deleteCustomer, listCustomer } = useCustomer();
  
  const handleSearch = (values: any) => {
  const newQuery = new CustomerQuery({
      ...query,
      page: 0,
      nome: values.nome,
      email: values.email,
      phone: values.phone,
      cpfCnpj: values.cpfCnpj,
    });
    setQuery(newQuery);
  };

  const customerDate = listCustomer(
    {
      page: pagination.page,
      size: pagination.size,
      ...(sorter?.field && sorter?.order
        ? {
          sort: `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"
            }`,
        }
        : {}),
    })
  const data = customerDate.data?.content ?? [];

  const columns = [
    // {
    //   title: "ID",
    //   key: "id",
    //   width: "5%",
    //   align: "center" as const,
    //   dataIndex: "id",
    //   sorter: (a: CustomerType, b: CustomerType) => a.id - b.id,
    // },

    {
      title: "CPF/CNPJ",
      key: "cpf_cnpj",
      width: "15%",
      // align: "center" as const,
      dataIndex: "cpfCnpj",
    },
      {
      title: "Descrição",
      key: "name",
      width: "25%",
      // align: "center" as const,
      dataIndex: "name",
      sorter: (a: CustomerType, b: CustomerType) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Criação",
      key: "createdAt",
      width: "15%",
      align: "center" as const,
      dataIndex: "createdAt",
      render: (_: any, dat: CustomerType) => dayjs(dat.createdAt).format("DD/MM/YYYY HH:MM"),
    },
    {
      title: "Atualização",
      key: "updatedAt",
      width: "15%",
      align: "center" as const,
      dataIndex: "updatedAt",
      render: (_: any, dat: CustomerType) => !dat.updatedAt ? "" : dayjs(dat.updatedAt).format("DD/MM/YYYY HH:MM"),
    },
    {
      title: "Ações",
      key: "actions",
      width: "10%",
      align: "center" as const,
      render: (_: any, record: CustomerType) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCustomer(record);
              setEditingMode("editar");
              setModalVisible(true);
            }}
          />

          <Button
            danger
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => {
              setEditingCustomer(record);
              deleteCustomer.mutate({ id: record.id }, {
                onSuccess: (e) => {
                  notification.success({ message: e.message })
                }
              })
            }}
          />

        </Space>
      ),
    },
  ];
 
 function createdScreenOne(){
  navigationHistory.navigate("Customer",{id: 1})
 }
  function createdScreenTwo(){
  navigationHistory.navigate("Customer dois",{id: 2})
 }

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
        <Flex 
             justify="space-between"
              align="center"
              style={{ marginBottom: 16 , border: "1px solid red"}}
        >
         <p>
          {JSON.stringify(navigationHistory.getBreadcrumb())}
         </p>
             <Button onClick={()=>(navigationHistory.telaAnterior())}>Anterior</Button>
             <Button onClick={()=>(createdScreenTwo())}> Criar 2</Button>
             <Button onClick={()=>(createdScreenOne())}> Criar 1</Button>
             <Button onClick={()=>(navigationHistory.proximaTela())}> Próximo</Button>

        </Flex>
     
          <Breadcrumb
          style={{ textAlign: "center", marginBottom: 32, color: "#666666" }}
          items={navigationHistory.getBreadcrumb()}
        />
        <Title level={3} style={{ textAlign: "center", marginBottom: 32, color: "#666666" }}>
          Cadastro de Clientes
        </Title>

        <Row gutter={[24, 24]} justify="center">
          {/* FILTROS */}
          <Col xs={24} md={8} lg={6} xl={5}>
            <Card title="Filtros">
              <Form layout="vertical" form={form} onFinish={handleSearch}>
                <Form.Item label="Nome" name="nome">
                  <Input placeholder="Digite o nome" />
                </Form.Item>

                <Form.Item label="Email" name='email'>
                  <Input placeholder="Digite o email" />
                </Form.Item>

                <Form.Item label="Telefone" name="phone">
                  <Input placeholder="Digite o telefone" />
                </Form.Item>

                  <Form.Item label="CPF/CNPJ" name="cpfCnpj" >
                    <Input
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        let formatted = value;
                        if (value.length <= 11) {
                          formatted = cpf.format(value);
                        } else {
                          formatted = cnpj.format(value);
                        }
                        form.setFieldValue("cpfCnpj", formatted);
                      }}
                    />
                  </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Pesquisar
                </Button>
                <Button type="link" onClick={() => form.resetFields()} block>
                  Limpar
                </Button>
              </Form>
            </Card>
          </Col>

          {/* TABELA */}
          <Col xs={24} md={16} lg={18} xl={19}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}
            >
              {/* <Title level={5} style={{ margin: 0 }}>
                Clientes
              </Title> */}


            </Flex>

            <Card title="  Clientes"
              extra={<>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditingCustomer(null);
                    setEditingMode("criar");
                    setModalVisible(true);
                  }}
                >
                  Novo Cliente
                </Button>
              </>}
            >

              <StandardTable
                columns={columns}
                dataSource={data}
                loading={customerDate.isPending}
                // onChange={(_, __, sorter: any) => {
                //     setQuery(
                //       new CustomerQuery({
                //         ...query,
                //         sort:
                //           sorter.field && sorter.order
                //             ? `${sorter.field},${
                //                 sorter.order === "ascend" ? "asc" : "desc"
                //               }`
                //             : undefined,
                //       })
                //     );
                //   }}
                onChange={(_, __, sorter: any) => {
                  setSorter(sorter);
                }}
                //       pagination={{
                //   current: query.page + 1,
                //   pageSize: query.size,
                //   total: fetchList.data?.totalElements ?? 0,

                //   onChange: (page, size) => {
                //     setQuery(
                //       new CustomerQuery({
                //         ...query,
                //         page: page - 1,
                //         size,
                //       })
                //     );
                //   },
                // }}
                pagination={{
                  current: pagination.page + 1,
                  pageSize: pagination.size,
                  total: customerDate.data?.totalElements ?? 0,
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
        title={
          editingMode === "criar"
            ? "Novo Cliente"
            : "Editar Cliente"
        }
        open={modalVisible}
        footer={null}
        destroyOnClose
        destroyOnHidden
        onCancel={() => {
          setModalVisible(false);
          setEditingCustomer(null);
          setEditingMode("criar");
        }}
      >
        <CustomerForm
          formEditing={editingMode}
          onClose={() => setModalVisible(!modalVisible)}
          data={
            (editingCustomer ?? {
              active: true,
              cpfCnpj: "",
              email: "",
              name: "",
              phone: "",
            }) as CustomerType
          }
        />
      </Modal>
    </>
  );
});