// Sub-interfaces para os objetos aninhados do seu JSON
export interface Category {
  codcategoria: number;
  desccategoria: string;
  indativo: boolean;
  datacriacao: string;
  dataatualizacao: string;
}

export interface Account {
  codconta: number;
  tipoconta: string;
  descconta: string;
  indativo: boolean;
  datacriacao: string;
  dataatualizacao: string;
}

export interface Card {
  codcartao: number;
  tipocartao: string;
  desccartao: string;
  indativo: boolean;
  datacriacao: string;
  dataatualizacao: string;
}

export interface Status {
  codstatus: number;
  descstatus: string;
  desccompleta: string;
  indativo: boolean;
  datacriacao: string;
  dataatualizacao: string;
}

export interface PaymentMethod {
  codformpag: number;
  tipoformpag: string;
  descformpag: string;
  indativo: boolean;
  datacriacao: string;
  dataatualizacao: string;
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
  codconta?: number;
  page: number;
  size: number;
  sort?: string;
}

export interface MovementDelete {
  id: string | undefined; // Mapeado como string para coincidir com o "codmovimentacao" do JSON
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