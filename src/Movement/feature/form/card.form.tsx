import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { useCard } from "../../hook/useCard"; 
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Card } from "../../model/moviment.model";

interface CardFormValues {
    formEditing: FormEditing;
    data: Card;
    onClose: () => void;
}

export const CardForm = ({ formEditing, data, onClose }: CardFormValues) => {
    const { saveCard, fetchByIdCard, updateCard } = useCard();
    const [form] = Form.useForm<Card>();
    
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
                            <Form.Item label="Tipo de Cartão" name="tipocartao">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Descrição do Cartão" name="desccartao">
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

                    {formConfig.isEdit() && formCard.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '12px' }}>
                            Data de modificação: {dayjs(formCard.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};