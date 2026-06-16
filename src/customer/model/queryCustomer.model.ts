export class CustomerQuery {
  page: number = 0;
  size: number = 10;
  nome?: string;
  email?: string;
  phone?: string;
  cpfCnpj?: string;
  sort?: string;

  constructor(data?: Partial<CustomerQuery>) {
    Object.assign(this, data);
  }

  static fromSearchParams(search: URLSearchParams) {
    return new CustomerQuery({
      page: Number(search.get("page") ?? 0),
      size: Number(search.get("size") ?? 10),
      nome: search.get("nome") ?? undefined,
      email: search.get("email") ?? undefined,
      phone: search.get("phone") ?? undefined,
      cpfCnpj: search.get("cpfCnpj") ?? undefined,
      sort: search.get("sort") ?? undefined,
    });
  }

  toApi() {
    return {
      page: this.page,
      size: this.size,
      ...(this.nome && { nome: this.nome }),
      ...(this.email && { email: this.email }),
      ...(this.phone && { phone: this.phone }),
      ...(this.cpfCnpj && { cpfCnpj: this.cpfCnpj }),
      ...(this.sort && { sort: this.sort }),
    };
  }

  toSearchParams() {
    const params = new URLSearchParams();
    params.set("page", String(this.page));
    params.set("size", String(this.size));
    if (this.nome) params.set("nome", this.nome);
    if (this.email) params.set("email", this.email);
    if (this.phone) params.set("phone", this.phone);
    if (this.cpfCnpj) params.set("cpfCnpj", this.cpfCnpj);
    if (this.sort) params.set("sort", this.sort);

    return params;
  }
}