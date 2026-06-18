import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col } from "antd";
import { FormEditing, FormConfig } from "../../components/form/formConfig";

import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Account } from "../model/moviment.model";
import { useAccount } from "../hook/useAccount";

interface AccountFormValues {
    formEditing: FormEditing;
    data: Account;
    onClose: () => void;
}

export const AccountForm = ({ formEditing, data, onClose }: AccountFormValues) => {
    const { saveAccount, fetchByIdAccount, updateAccount } = useAccount();
    const [form] = Form.useForm<Account>();
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formAccount = useMemo(() => { return new Account(); }, [formEditing, data]);
    
    const { data: accountData } = fetchByIdAccount(
        { id: data?.codconta },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!accountData) return;

        Object.assign(formAccount, accountData);
        
        form.setFieldsValue({
            codconta: accountData.codconta,
            tipoconta: accountData.tipoconta,
            descconta: accountData.descconta,
            indativo: accountData.indativo,
            datacriacao: accountData.datacriacao,
            dataatualizacao: accountData.dataatualizacao
        });

    }, [accountData, form]);

    const handleSubmit = async (values: Account) => {
        const accountDataInstance = new Account();
        Object.assign(accountDataInstance, values);
        accountDataInstance.codconta = formAccount.codconta;

        const mutation = formConfig.isEdit() ? updateAccount : saveAccount;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(accountDataInstance, {
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
                            <Form.Item label="Tipo de Conta" name="tipoconta">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Descrição da Conta" name="descconta">
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

                    {formConfig.isEdit() && formAccount.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '12px' }}>
                            Data de modificação: {dayjs(formAccount.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};