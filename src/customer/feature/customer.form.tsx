import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch } from "antd";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { FormEditing, FormConfig } from "../../components/form/formConfig";
import { Customer, CustomerType } from "../model/customer.model";
import { useCustomer } from "../hook/useCustomer";
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
interface CustomerFormValues {
    formEditing: FormEditing;
    data: CustomerType;
    onClose: () => void;
}

export const CustomerForm = ({ formEditing, data, onClose }: CustomerFormValues) => {
    const { saveCustomer, fetchByIdCustomer, updateCustumer } = useCustomer();
    const [form] = Form.useForm<CustomerType>();
    const formConfig = useMemo(() => { return new FormConfig({ formEditing, }); }, [formEditing, data]);
    const formCustomer = useMemo(() => { return new Customer(); }, [formEditing, data]);
    const { data: customerData } = fetchByIdCustomer({ id: data?.id },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
            /**Limpar os campos */
        if (!customerData) return;
            // form.setFields(
            //     form.getFieldsError().map(({ name }) => ({
            //         name: name as any,
            //         errors: [],
            //     }))
            // );
            /**Setar campos do formulario */
        Object.assign(formCustomer, customerData);
        form.setFieldsValue({
            id: customerData.id,
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            cpfCnpj: customerData.cpfCnpj,
            active: customerData.active
        });
    
    }, [customerData, form]);

    const handleSubmit = async (values: CustomerType) => {
        
        const customerData = new Customer();
        Object.assign(customerData, values);
        customerData.id = formCustomer.id;

        if (formConfig.isEdit()) {
            
  
            updateCustumer.mutate(customerData,
                {
                    onSuccess: (e) => {
                        notification.success({ message: e.message });
                        form.resetFields(),
                            onClose()
                    },
                    onError: (err: any) => {
                        const response: ApiValidationError = err;
                        if (!response?.errors) return;
                        
                        form.setFields(
                            response.errors.map((error: any) => ({
                                name: error.field,
                                errors: [error.message],
                            }))
                        );
                    }
                }
            )
        } else {
            saveCustomer.mutate(customerData, {
                onSuccess: () => {
                    notification.success({ message: "Cadastrado com sucesso!" });
                    form.resetFields(),
                        onClose()
                },
                onError: (err: any) => {
                    const response: ApiValidationError = err;
                    // notification.error({
                    //     message: `${response.message}`,
                    //     description: "Verifique os erros no formulário.",
                    // });
                    if (!response?.errors) return;

                    form.setFields(
                        response.errors.map((error: any) => ({
                            name: error.field,
                            errors: [error.message],
                        }))
                    );
                }
            });

        }
    };

    return (
        <div>
            <Flex style={{ justifyContent: "center", marginBottom: 20, marginTop: 20 }}>
                <Form
                    disabled={formConfig.isView()}
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ margin: "0 auto", width: 400 }}
                >
                    <Form.Item label="Nome" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Situação Cadastral" name="active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="CPF/CNPJ" name="cpfCnpj">
                        <Input
                            max={14}
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
                    <Form.Item>
                        <Space wrap>
                            <Button htmlType="submit" type="primary">
                                Salvar
                            </Button>
                            <Button htmlType="reset" type="dashed" onClick={() => form.resetFields}>
                                Limpar
                            </Button>
                        </Space>
                    </Form.Item>
                    {formConfig.isEdit() &&
                        <p>
                            Data de modificação : {!formCustomer.updatedAt && dayjs(formCustomer.updatedAt).format("DD/MM/YYYY HH:MM")}
                        </p>
                    }
                </Form>
            </Flex>


        </div>
    );
};