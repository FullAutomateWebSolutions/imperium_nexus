import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Switch, Row, Col, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";

import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Card } from "../../model/moviment.model";
import { useCard } from "../../hook/useCard";

const { useBreakpoint } = Grid;

interface CardFormValues {
    formEditing: FormEditing;
    data: Card;
    onClose: () => void;
}

export const CardForm = ({ formEditing, data, onClose }: CardFormValues) => {
    const { saveCard, fetchByIdCard, updateCard } = useCard();
    const [form] = Form.useForm<Card>();
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formCard = useMemo(() => { return new Card(); }, [formEditing, data]);
    
    const { data: cardData } = fetchByIdCard(
        { id: data?.codcartao },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!cardData) return;

        Object.assign(formCard, cardData);
        
        form.setFieldsValue({
            codcartao: cardData.codcartao,
            tipocartao: cardData.tipocartao,
            desccartao: cardData.desccartao,
            indativo: cardData.indativo,
            datacriacao: cardData.datacriacao,
            dataatualizacao: cardData.dataatualizacao
        });

    }, [cardData, form]);

    const handleSubmit = async (values: Card) => {
        const cardDataInstance = new Card();
        Object.assign(cardDataInstance, values);
        cardDataInstance.codcartao = formCard.codcartao;

        const mutation = formConfig.isEdit() ? updateCard : saveCard;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(cardDataInstance, {
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
                        {/* xs={24} empilha os inputs no mobile verticalmente */}
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Tipo de Cartão" 
                                name="tipocartao"
                                rules={[{ required: true, message: "Informe o tipo de cartão" }]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Descrição do Cartão" 
                                name="desccartao"
                                rules={[{ required: true, message: "Informe a descrição" }]}
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        
                        {/* Switch ajustado para ficar estético tanto em desktop quanto mobile */}
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

                    {/* Container de ações adaptável ao toque */}
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

                    {formConfig.isEdit() && formCard.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '11px', textAlign: isMobile ? 'center' : 'left', margin: 0 }}>
                            Última modificação: {dayjs(formCard.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};