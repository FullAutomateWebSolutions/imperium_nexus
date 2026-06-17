import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, InputNumber, notification, Space, Switch, DatePicker, Row, Col } from "antd";
import { FormEditing, FormConfig } from "../../components/form/formConfig";

import { useMovement } from "../hook/useMovement";
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { MovementType,Movement } from "../model/moviment.model";

interface MovementFormValues {
    formEditing: FormEditing;
    data: MovementType;
    onClose: () => void;
}

export const MovementForm = ({ formEditing, data, onClose }: MovementFormValues) => {
    const { saveMovement, fetchByIdMovement, updateMovement } = useMovement();
    const [form] = Form.useForm<MovementType>();
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formMovement = useMemo(() => { return new Movement(); }, [formEditing, data]);
    
    // Mapeado para buscar pelo ID correto "codmovimentacao"
    const { data: movementData } = fetchByIdMovement(
        { id: data?.codmovimentacao },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!movementData) return;

        /** Setar campos do formulario */
        Object.assign(formMovement, movementData);
        
        form.setFieldsValue({
            codmovimentacao: movementData.codmovimentacao,
            descmovimento: movementData.descmovimento,
            valorunit: movementData.valorunit,
            porcjuros: movementData.porcjuros,
            valorjuros: movementData.valorjuros,
            tipoparcelamento: movementData.tipoparcelamento,
            qtdparcatual: movementData.qtdparcatual,
            qtdparcfinal: movementData.qtdparcfinal,
            qtdparcpendente: movementData.qtdparcpendente,
            valortotalpendente: movementData.valortotalpendente,
            codformpag: movementData.codformpag,
            codconta: movementData.codconta,
            codstatus: movementData.codstatus,
            codcategoria: movementData.codcategoria,
            codcartao: movementData.codcartao,
            indativo: movementData.indativo,
            // Tratamento básico para campos de data com dayjs se necessário na UI
            datamov: movementData.datamov,
            datafimmov: movementData.datafimmov
        });

    }, [movementData, form]);

    const handleSubmit = async (values: MovementType) => {
        const movementDataInstance = new Movement();
        Object.assign(movementDataInstance, values);
        movementDataInstance.codmovimentacao = formMovement.codmovimentacao;

        if (formConfig.isEdit()) {
            updateMovement.mutate(movementDataInstance, {
                onSuccess: (e) => {
                    notification.success({ message: e.message || "Atualizado com sucesso!" });
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
        } {
            saveMovement.mutate(movementDataInstance, {
                onSuccess: () => {
                    notification.success({ message: "Cadastrado com sucesso!" });
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
                    style={{ margin: "0 auto", width: 600 }} // Um pouco mais largo devido ao número de campos
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Descrição do Movimento" name="descmovimento">
                                <Input />
                            </Form.Item>
                        </Col>
                        
                        <Col span={12}>
                            <Form.Item label="Valor Unitário" name="valorunit">
                                <Input placeholder="0.00" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Data Movimento" name="datamov">
                                <Input placeholder="AAAA-MM-DD" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Porcentagem Juros" name="porcjuros">
                                <Input placeholder="0" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Valor Juros" name="valorjuros">
                                <Input placeholder="0.00" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Parc. Atual" name="qtdparcatual">
                                <InputNumber style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Parc. Final" name="qtdparcfinal">
                                <InputNumber style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Tipo Parcelamento" name="tipoparcelamento">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        {/* Campos de Chave Estrangeira / IDs de Relacionamento */}
                        <Col span={12}>
                            <Form.Item label="Cód. Categoria" name="codcategoria">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Cód. Conta" name="codconta">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Cód. Forma Pagamento" name="codformpag">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Cód. Cartão" name="codcartao">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Cód. Status" name="codstatus">
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
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

                    {formConfig.isEdit() && formMovement.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '12px' }}>
                            Data de modificação: {dayjs(formMovement.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};