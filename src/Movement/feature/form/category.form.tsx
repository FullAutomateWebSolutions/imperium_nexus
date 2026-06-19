import { useEffect, useMemo } from "react";
import { Button, Flex, Form, Input, notification, Space, Switch, Row, Col } from "antd";
import { FormEditing, FormConfig } from "../../../components/form/formConfig";
import { useCategory } from "../../hook/useCategory"; // Ajuste o path conforme seu projeto
import { ApiValidationError } from "@/api/axios";
import dayjs from "dayjs";
import { Category } from "../../model/moviment.model"; // Ajuste o nome da classe modelo se necessário

interface CategoryFormValues {
    formEditing: FormEditing;
    data: Category;
    onClose: () => void;
}

export const CategoryForm = ({ formEditing, data, onClose }: CategoryFormValues) => {
    const { saveCategory, fetchByIdCategory, updateCategory } = useCategory();
    const [form] = Form.useForm<Category>();
    const formConfig = useMemo(() => { return new FormConfig({ formEditing }); }, [formEditing, data]);
    const formCategory = useMemo(() => { return new Category(); }, [formEditing, data]);
    const { data: categoryData } = fetchByIdCategory({ id: data?.codcategoria }, formConfig.isEdit() || formConfig.isView());

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
        }else{
            categoryDataInstance.codcategoria = undefined
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
                        <Col span={18}>
                            <Form.Item label="Descrição da Categoria" name="desccategoria">
                                <Input />
                            </Form.Item>
                        </Col>
                        
                        <Col span={6}>
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

                    {formConfig.isEdit() && formCategory.dataatualizacao && (
                        <p style={{ color: 'gray', fontSize: '12px' }}>
                            Data de modificação: {dayjs(formCategory.dataatualizacao).format("DD/MM/YYYY HH:mm")}
                        </p>
                    )}
                </Form>
            </Flex>
        </div>
    );
};