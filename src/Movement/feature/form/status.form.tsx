import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Switch, Row, Col, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { useStatus } from "../../hook/useStatus"; 
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Status } from "../../model/moviment.model";

const { useBreakpoint } = Grid;

interface StatusFormValues {
    formEditing: FormEditing;
    data: Status;
    onClose: () => void;
}

export const StatusForm = ({ formEditing, data, onClose }: StatusFormValues) => {
    const { saveStatus, fetchByIdStatus, updateStatus } = useStatus();
    const [form] = Form.useForm<Status>();
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formStatus = useMemo(() => { return new Status(); }, [formEditing, data]);
    
    const { data: statusData } = fetchByIdStatus(
        { id: data?.codstatus },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!statusData) return;

        Object.assign(formStatus, statusData);
        
        form.setFieldsValue({
            codstatus: statusData.codstatus,
            descstatus: statusData.descstatus,
            desccompleta: statusData.desccompleta,
            indativo: statusData.indativo,
            datacriacao: statusData.datacriacao,
            dataatualizacao: statusData.dataatualizacao
        });

    }, [statusData, form]);

    const handleSubmit = async (values: Status) => {
        const statusDataInstance = new Status();
        Object.assign(statusDataInstance, values);
        statusDataInstance.codstatus = formStatus.codstatus;

        const mutation = formConfig.isEdit() ? updateStatus : saveStatus;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(statusDataInstance, {
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
                        {/* xs={24} para empilhar em telas menores e md={10}/md={4} para o alinhamento desktop */}
                        <Col xs={24} md={10}>
                            <Form.Item 
                                label="Descrição Status" 
                                name="descstatus"
                                rules={[{ required: true, message: "Informe a descrição do status" }]}
                            >
                                <Input maxLength={50} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={10}>
                            <Form.Item label="Descrição Completa" name="desccompleta">
                                <Input maxLength={150} />
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

                    {/* Botões adaptados com flex expansível para o mobile */}
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

                    {formConfig.isEdit() && formStatus.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '11px', textAlign: isMobile ? 'center' : 'left', margin: 0 }}>
                            Última modificação: {dayjs(formStatus.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};