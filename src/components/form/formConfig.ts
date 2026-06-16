export type FormEditing = "editar" | "criar" | "consultar";

interface FormConfigParams<T = any> {
  formEditing: FormEditing;
  data?: T;
}

export class FormConfig<T = any> {
  formEditing: FormEditing;
  data?: T;

  constructor(params: FormConfigParams<T>) {
    this.formEditing = params.formEditing;
    this.data = params.data;
  }

  isEdit() {
    return this.formEditing === "editar";
  }

  isCreate() {
    return this.formEditing === "criar";
  }

  isView() {
    return this.formEditing === "consultar";
  }
}