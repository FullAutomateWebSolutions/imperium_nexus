import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Switch, Row, Col, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { usePaymentMethod } from "../../hook/usePaymentMethod"; 
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { PaymentMethod } from "../../model/moviment.model";

const { useBreakpoint } = Grid;

interface PaymentMethodFormValues {
    formEditing: FormEditing;
    data: PaymentMethod;
    onClose: () => void;
}

export const PaymentMethodForm = ({ formEditing, data, onClose }: PaymentMethodFormValues) => {
    const { savePaymentMethod, fetchByIdPaymentMethod, updatePaymentMethod } = usePaymentMethod();
    const [form] = Form.useForm<PaymentMethod>();
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
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
        <div style={{ padding: isMobile ? "0 4px" : "0" }}>
            <Flex style={{ justifyContent: "center", marginBottom: 10, marginTop: 10 }}>
                <Form
                    disabled={formConfig.isView()}
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ 
                        width: "100%", 
                        maxWidth: 600 
                    }}
                >
                    <Row gutter={[16, 0]}>
                        {/* xs={24} faz com que os inputs ocupem a linha toda no mobile */}
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Tipo Forma Pagamento" 
                                name="tipoformpag"
                                rules={[{ required: true, message: "Informe o tipo de forma de pagamento" }]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Descrição Forma Pagamento" 
                                name="descformpag"
                                rules={[{ required: true, message: "Informe a descrição" }]}
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={4}>
                            <Form.Item 
                                label="Ativo" 
                                name="indativo" 
                                valuePropName="checked"
                                style={{ 
                                    marginBottom: isMobile ? 24 : 0,
                                    display: isMobile ? "flex" : "block",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Botões adaptados para toque e comportamento mobile (lado a lado, expandidos) */}
                    <Form.Item style={{ marginTop: isMobile ? 16 : 24, marginBottom: 12 }}>
                        <div style={{ 
                            display: "flex", 
                            gap: "12px", 
                            justifyContent: isMobile ? "stretch" : "flex-start" 
                        }}>
                            {!formConfig.isView() && (
                                <Button 
                                    htmlType="submit" 
                                    type="primary" 
                                    style={{ flex: isMobile ? 1 : "none" }}
                                >
                                    Salvar
                                </Button>
                            )}
                            {!formConfig.isView() && (
                                <Button 
                                    htmlType="button" 
                                    type="dashed" 
                                    onClick={() => form.resetFields()}
                                    style={{ flex: isMobile ? 1 : "none" }}
                                >
                                    Limpar
                                </Button>
                            )}
                        </div>
                    </Form.Item>

                    {formConfig.isEdit() && formPaymentMethod.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '11px', textAlign: isMobile ? 'center' : 'left', margin: 0 }}>
                            Última modificação: {dayjs(formPaymentMethod.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};