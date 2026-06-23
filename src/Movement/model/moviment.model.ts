export interface User {
  codusuario: number | undefined;
  nome: string;
  email: string;
  role: "ADMIN" | "USER";
  indativo: boolean;
}

export interface Category {
  codcategoria: number | undefined;
  desccategoria: string;
  indativo: boolean;
  datacriacao?: string | undefined;
  dataatualizacao?: string| undefined;
}

export interface Account {
  codconta: number | undefined;
  tipoconta: string;
  descconta: string;
  indativo: boolean;
  datacriacao?: string | undefined;
  dataatualizacao?: string| undefined;
}

export interface Card {
  codcartao: number | undefined;
  tipocartao: string;
  desccartao: string;
  indativo: boolean;
  datacriacao?: string | undefined;
  dataatualizacao?: string| undefined;
}

export interface Status {
  codstatus: number | undefined;
  descstatus: string;
  desccompleta: string;
  indativo: boolean;
   datacriacao?: string | undefined;
  dataatualizacao?: string| undefined;
}

export interface PaymentMethod {
  codformpag: number | undefined;
  tipoformpag: string;
  descformpag: string;
  indativo: boolean;
  datacriacao?: string | undefined;
  dataatualizacao?: string| undefined;
}


// ==========================================
// CLASSES MODELO
// ==========================================

export class User implements User {
  codusuario: number | undefined;
  nome: string = "";
  email: string ="";
  role: "ADMIN" | "USER" = "USER";
  indativo: boolean = false;

  constructor(init?: Partial<User>) {
    if (init) Object.assign(this, init);
  }
}

export class Category implements Category {
  codcategoria: number | undefined;
  desccategoria: string = "";
  indativo: boolean = true;
  datacriacao?: string | undefined;
  dataatualizacao?: string | undefined;

  constructor(init?: Partial<Category>) {
    if (init) Object.assign(this, init);
  }
}

export class Account implements Account {
  codconta: number | undefined;
  tipoconta: string = "";
  descconta: string = "";
  indativo: boolean = true;
  datacriacao?: string | undefined;
  dataatualizacao?: string | undefined;

  constructor(init?: Partial<Account>) {
    if (init) Object.assign(this, init);
  }
}

export class Card implements Card {
  codcartao: number | undefined;
  tipocartao: string = "";
  desccartao: string = "";
  indativo: boolean = true;
  datacriacao?: string | undefined;
  dataatualizacao?: string | undefined;

  constructor(init?: Partial<Card>) {
    if (init) Object.assign(this, init);
  }
}

export class Status implements Status {
  codstatus: number | undefined;
  descstatus: string = "";
  desccompleta: string = "";
  indativo: boolean = true;
  datacriacao?: string | undefined;
  dataatualizacao?: string | undefined;

  constructor(init?: Partial<Status>) {
    if (init) Object.assign(this, init);
  }
}

export class PaymentMethod implements PaymentMethod {
  codformpag: number | undefined;
  tipoformpag: string = "";
  descformpag: string = "";
  indativo: boolean = true;
  datacriacao?: string | undefined;
  dataatualizacao?: string | undefined;

  constructor(init?: Partial<PaymentMethod>) {
    if (init) Object.assign(this, init);
  }
}


export class Movement {
  codmovimentacao?: string;
  datamov: string = "";
  descmovimento: string = "";
  valorunit: string = "0";
  porcjuros: string = "0";
  valorjuros: string = "0";
  tipoparcelamento: number = 1;
  qtdparcatual: number = 1;
  qtdparcfinal: number = 1;
  qtdparcpendente: number = 0;
  valortotalpendente: string = "0";
  datafimmov: string = "";
  codformpag?: number;
  codconta?: number;
  codstatus?: number;
  codcategoria?: number;
  codcartao?: number;
  indativo: boolean = true;
  datacriacao?: string;
  dataatualizacao?: string;
  dataintegracao?: string | null = null;
  datafechamento?: string | null = null;

  // Objetos de relacionamento trazidos pelo seu Get/List
  categoria?: Category;
  conta?: Account;
  cartao?: Card;
  status?: Status;
  formapagamento?: PaymentMethod;

  toJSON() {
    return {
      codmovimentacao: this.codmovimentacao,
      datamov: this.datamov,
      descmovimento: this.descmovimento,
      valorunit: this.valorunit,
      porcjuros: this.porcjuros,
      valorjuros: this.valorjuros,
      tipoparcelamento: this.tipoparcelamento,
      qtdparcatual: this.qtdparcatual,
      qtdparcfinal: this.qtdparcfinal,
      qtdparcpendente: this.qtdparcpendente,
      valortotalpendente: this.valortotalpendente,
      datafimmov: this.datafimmov,
      codformpag: this.codformpag,
      codconta: this.codconta,
      codstatus: this.codstatus,
      codcategoria: this.codcategoria,
      codcartao: this.codcartao,
      indativo: this.indativo,
      datacriacao: this.datacriacao,
      dataatualizacao: this.dataatualizacao,
      dataintegracao: this.dataintegracao,
      datafechamento: this.datafechamento,
      categoria: this.categoria,
      conta: this.conta,
      cartao: this.cartao,
      status: this.status,
      formapagamento: this.formapagamento,
    };
  }
}

export type MovementType = InstanceType<typeof Movement>;

export interface MovementListResponse {
  content: Movement[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  firstPage: boolean;
  lastPage: boolean;
}

export interface MovementFilter {
  codmovimentacao?: string;
  descmovimento?: string;
  codcategoria?: number;
  codconta?: number | undefined;
  page: number;
  size: number;
  sort?: string;
}

export interface MovementDelete {
  id: string | undefined; 
}

export interface MovementById {
  id: string | undefined;
}

export interface MovementResponse {
  timestamp: string;
  status: number;
  message: string;
  path: string;
}