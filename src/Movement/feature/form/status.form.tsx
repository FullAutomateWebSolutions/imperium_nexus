import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { useStatus } from "../../hook/useStatus"; 
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Status } from "../../model/moviment.model";

interface StatusFormValues {
    formEditing: FormEditing;
    data: Status;
    onClose: () => void;
}

export const StatusForm = ({ formEditing, data, onClose }: StatusFormValues) => {
    const { saveStatus, fetchByIdStatus, updateStatus } = useStatus();
    const [form] = Form.useForm<Status>();
    
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
                            <Form.Item label="Descrição Status" name="descstatus">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Descrição Completa" name="desccompleta">
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

                    {formConfig.isEdit() && formStatus.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '12px' }}>
                            Data de modificação: {dayjs(formStatus.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};