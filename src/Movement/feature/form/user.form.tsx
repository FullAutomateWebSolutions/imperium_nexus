import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col, Select } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { ApiValidationError } from "@/api/axios";
import { User } from "../../model/moviment.model";
import { useUser } from "@/Movement/hook/useUsers";

interface UserFormValues {
    formEditing: FormEditing;
    data: User;
    onClose: () => void;
}

export const UserForm = ({ formEditing, data, onClose }: UserFormValues) => {
    const { saveUser, fetchByIdUser, updateUser } = useUser();
    const [form] = Form.useForm<User>();
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formUser = useMemo(() => { return new User(); }, [formEditing, data]);
    
    const { data: UserData } = fetchByIdUser(
        { id: data?.codusuario },
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!UserData) return;

        Object.assign(formUser, UserData);
        
        form.setFieldsValue({
            codusuario: UserData.codusuario,
            email: UserData.email,
            nome: UserData.nome,
            role: UserData.role,
            indativo: UserData.indativo, 
        });

    }, [UserData, form]);

    const handleSubmit = async (values: User) => {
        const UserDataInstance = new User(); 
        Object.assign(UserDataInstance, values);
        UserDataInstance.codusuario = formUser.codusuario;

        const mutation = formConfig.isEdit() ? updateUser : saveUser;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(UserDataInstance, {
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
                        <Col span={24}>
                            <Form.Item name="nome" label="Nome do Usuário" rules={[{ required: true, message: "Insira o nome" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        
                        <Col span={24}>
                            <Form.Item name="email" label="E-mail" rules={[{ required: true, type: "email", message: "Insira um e-mail válido" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        
                        <Col span={16}>
                            <Form.Item name="role" label="Nível de Acesso (Role)" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="USER">USER (Acesso Comum)</Select.Option>
                                    <Select.Option value="ADMIN">ADMIN (Controle Total)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item 
                                name="indativo" 
                                label="Usuário Ativo?" 
                                valuePropName="checked" 
                                initialValue={true} 
                            >
                                <Switch checkedChildren="Sim" unCheckedChildren="Não" />
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
                </Form>
            </Flex>
        </div>
    );
};