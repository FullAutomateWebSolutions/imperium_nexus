import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col } from "antd";
import { FormEditing, FormConfig } from "../../components/form/formConfig";
import { usePaymentMethod } from "../hook/usePaymentMethod"; 
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { PaymentMethod } from "../model/moviment.model";

interface PaymentMethodFormValues {
    formEditing: FormEditing;
    data: PaymentMethod;
    onClose: () => void;
}

export const PaymentMethodForm = ({ formEditing, data, onClose }: PaymentMethodFormValues) => {
    const { savePaymentMethod, fetchByIdPaymentMethod, updatePaymentMethod } = usePaymentMethod();
    const [form] = Form.useForm<PaymentMethod>();
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formPaymentMethod = useMemo(() => { return new PaymentMethod(); }, [formEditing, data]);
    
    const { data: paymentData } = fetchByIdPaymentMethod(
        { id: data?.codformpag },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!paymentData) return;

        Object.assign(formPaymentMethod, paymentData);
        
        form.setFieldsValue({
            codformpag: paymentData.codformpag,
            tipoformpag: paymentData.tipoformpag,
            descformpag: paymentData.descformpag,
            indativo: paymentData.indativo,
            datacriacao: paymentData.datacriacao,
            dataatualizacao: paymentData.dataatualizacao
        });

    }, [paymentData, form]);

    const handleSubmit = async (values: PaymentMethod) => {
        const paymentDataInstance = new PaymentMethod();
        Object.assign(paymentDataInstance, values);
        paymentDataInstance.codformpag = formPaymentMethod.codformpag;

        const mutation = formConfig.isEdit() ? updatePaymentMethod : savePaymentMethod;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(paymentDataInstance, {
            onSuccess: (e: any) => {
                notification.success({ message: e?.message || successMessage });
                form.resetFields();
                onClose();
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
        });
    };

    return (
        <div>
            <Flex style={{ justifyContent: "center", marginBottom: 20, marginTop: 20 }}>
                <Form
                    disabled={formConfig.isView()}
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ margin: "0 auto", width: 600 }}
                >
                    <Row gutter={16}>
                        <Col span={10}>
                            <Form.Item label="Tipo Forma Pagamento" name="tipoformpag">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Descrição Forma Pagamento" name="descformpag">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Ativo" name="indativo" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 10 }}>
                        <Space wrap>
                            <Button htmlType="submit" type="primary">
                                Salvar
                            </Button>
                            <Button htmlType="reset" type="dashed" onClick={() => form.resetFields()}>
                                Limpar
                            </Button>
                        </Space>
                    </Form.Item>

                    {formConfig.isEdit() && formPaymentMethod.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '12px' }}>
                            Data de modificação: {dayjs(formPaymentMethod.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};