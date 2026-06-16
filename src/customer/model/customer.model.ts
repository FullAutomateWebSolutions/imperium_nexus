import { cpf, cnpj } from "cpf-cnpj-validator";

export class Customer {
  id?: number;
  name: string = "";
  email: string = "";
  phone: string = "";
  active: boolean = true;
  createdAt?: string;
  updatedAt?: string;
  private _cpfCnpj: string = "";
  get cpfCnpj(): string {
    return this._cpfCnpj;
  }
  set cpfCnpj(value: string) {
    this._cpfCnpj = value;
    this.handleFormCpfCnpj();
  }

  private handleFormCpfCnpj() {
    if (!this._cpfCnpj) return;
    const numbers = this._cpfCnpj.replace(/\D/g, "");
    if (numbers.length === 14) {
      this._cpfCnpj = cnpj.format(numbers);
    }
    if (numbers.length === 11) {
      this._cpfCnpj = cpf.format(numbers);
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cpfCnpj: this.cpfCnpj,
      email: this.email,
      phone: this.phone,
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
export type CustomerType = InstanceType<typeof Customer>;

export interface CustomerListResponse {
  content: Customer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
}
export interface CustomerFilter {
  id?: number;
  nome?: string;
  page: number;
  size: number;
  sort?: string;
}
export interface CustomerDelete {
  id: number | undefined;
}
export interface CustomerById {
  id: number | undefined;
}

export interface CustomerResponse {
  timestamp: string;
  status: number;
  message: string;
  path: string;
}
