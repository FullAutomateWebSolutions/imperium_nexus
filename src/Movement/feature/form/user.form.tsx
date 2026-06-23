import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Switch, Row, Col, Select, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { ApiValidationError } from "@/api/axios";
import { User } from "../../model/moviment.model";
import { useUser } from "@/Movement/hook/useUsers";

const { useBreakpoint } = Grid;

interface UserFormValues {
    formEditing: FormEditing;
    data: User;
    onClose: () => void;
}

export const UserForm = ({ formEditing, data, onClose }: UserFormValues) => {
    const { saveUser, fetchByIdUser, updateUser } = useUser();
    const [form] = Form.useForm<User>();
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
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
                        <Col xs={24}>
                            <Form.Item 
                                name="nome" 
                                label="Nome do Usuário" 
                                rules={[{ required: true, message: "Insira o nome" }]}
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24}>
                            <Form.Item 
                                name="email" 
                                label="E-mail" 
                                rules={[
                                    { required: true, message: "Insira o e-mail" },
                                    { type: "email", message: "Insira um e-mail válido" }
                                ]}
                            >
                                <Input type="email" maxLength={100} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={16}>
                            <Form.Item 
                                name="role" 
                                label="Nível de Acesso (Role)" 
                                rules={[{ required: true, message: "Selecione o nível de acesso" }]}
                            >
                                <Select placeholder="Selecione o nível">
                                    <Select.Option value="USER">USER (Acesso Comum)</Select.Option>
                                    <Select.Option value="ADMIN">ADMIN (Controle Total)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item 
                                name="indativo" 
                                label="Usuário Ativo?" 
                                valuePropName="checked" 
                                initialValue={true}
                                style={{ 
                                    marginBottom: isMobile ? 24 : 0,
                                    display: isMobile ? "flex" : "block",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Switch checkedChildren="Sim" unCheckedChildren="Não" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Botões de controle flexíveis para toque em telas pequenas */}
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
                </Form>
            </Flex>
        </div>
    );
};