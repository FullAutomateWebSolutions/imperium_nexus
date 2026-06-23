import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Switch, Row, Col, Grid } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { useCategory } from "../../hook/useCategory"; 
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Category } from "../../model/moviment.model"; 

const { useBreakpoint } = Grid;

interface CategoryFormValues {
    formEditing: FormEditing;
    data: Category;
    onClose: () => void;
}

export const CategoryForm = ({ formEditing, data, onClose }: CategoryFormValues) => {
    const { saveCategory, fetchByIdCategory, updateCategory } = useCategory();
    const [form] = Form.useForm<Category>();
    
    const screens = useBreakpoint();
    const isMobile = screens.md === false;
    
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formCategory = useMemo(() => { return new Category(); }, [formEditing, data]);
    
    const { data: categoryData } = fetchByIdCategory(
        { id: data?.codcategoria }, 
        formConfig.isEdit() || formConfig.isView()
    );

    useEffect(() => {
        if (!categoryData) return;
        Object.assign(formCategory, data);
        
        form.setFieldsValue({
            codcategoria: categoryData.codcategoria,
            desccategoria: categoryData.desccategoria,
            indativo: categoryData.indativo,
            datacriacao: categoryData.datacriacao,
            dataatualizacao: categoryData.dataatualizacao
        });

    }, [categoryData, form]);

    const handleSubmit = async (values: Category) => {
        const categoryDataInstance = new Category();
        Object.assign(categoryDataInstance, values);
        
        if (formCategory.codcategoria !== 0) {
           categoryDataInstance.codcategoria = formCategory.codcategoria;  
        } else {
            categoryDataInstance.codcategoria = undefined;
        }

        const mutation = formConfig.isEdit() ? updateCategory : saveCategory;
        const successMessage = formConfig.isEdit() ? "Atualizado com sucesso!" : "Cadastrado com sucesso!";

        mutation.mutate(categoryDataInstance, {
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
                        {/* No mobile ocupa a largura total (xs={24}), no desktop segue a proporção 18/6 */}
                        <Col xs={24} md={18}>
                            <Form.Item 
                                label="Descrição da Categoria" 
                                name="desccategoria"
                                rules={[{ required: true, message: "Informe a descrição da categoria" }]}
                            >
                                <Input maxLength={100} />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={6}>
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

                    {/* Botões expandidos lado a lado no mobile */}
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

                    {formConfig.isEdit() && formCategory.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '11px', textAlign: isMobile ? 'center' : 'left', margin: 0 }}>
                            Última modificação: {dayjs(formCategory.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};