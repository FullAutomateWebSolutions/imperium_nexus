import { makeAutoObservable} from 'mobx';
import { makePersistable } from 'mobx-persist-store';
interface telaState {
    tela: string;
    filtro: Record<string, unknown>;
}
interface NavigationState {
    anterior: telaState[];
    proximo: telaState[];
    atual?: telaState;
}

interface NavoiationBreadcrumb{
        path: string,
        breadcrumbName: string,
        children?:NavoiationBreadcrumb[];
}

 class NavigationHistory {
    private anterior: telaState[] = [];
    private proximo: telaState[] = [];
    private atual?: telaState;
    constructor(state?: NavigationState) {
     makeAutoObservable(this);
         if (state) {
            this.anterior = state.anterior;
            this.proximo = state.proximo;
            this.atual = state.atual;
        }
        //@ts-ignore
     makePersistable(this, { name: 'navigationHistory', properties: ['anterior', 'proximo', 'atual'], storage: window.sessionStorage });
    }

    navigate(tela: string, filtro: Record<string, unknown> = {}): void {
        const existente = this.encontrarTela(tela);

        this.anterior = this.anterior.filter(x => x.tela !== tela);
        this.proximo = this.proximo.filter(x => x.tela !== tela);

        if (this.atual && this.atual !== existente) {
            this.anterior.push(this.atual);
        }

        this.atual = existente ?? {
            tela,
            filtro: { ...filtro }
        };

        this.proximo = [];
    }
    private encontrarTela(tela: string): telaState | undefined {
    return (
        this.atual?.tela === tela ? this.atual : this.anterior.find(x => x.tela === tela) ?? this.proximo.find(x => x.tela === tela)
    );
    }
    telaAnterior(): telaState | undefined {
        if (this.anterior.length === 0) {
            return this.atual;
        }
        if (this.atual) {
            this.proximo.push(this.atual);
        }
        this.atual = this.anterior.pop();
        return this.atual;
    }
    proximaTela(): telaState | undefined {
        if (this.proximo.length === 0) {
            return this.atual;
        }
        if (this.atual) {
            this.anterior.push(this.atual);
        }
        this.atual = this.proximo.pop();
        return this.atual;
    }
    getAtual(): telaState | undefined {
        return this.atual;
    }
    getProxima(): telaState | undefined {
        return this.anterior[this.anterior.length - 1];
    }
    // getBreadcrumb(): NavoiationBreadcrumb[] {
    // const breadcrumbs: NavoiationBreadcrumb[] = [
    //         ...this.anterior.map(item => ({
    //             path: item.tela,
    //             breadcrumbName: item.tela,
    //         })),
    //     ];

    //     if (this.atual) {
    //         breadcrumbs.push({
    //             path: this.atual.tela,
    //             breadcrumbName: this.atual.tela,
    //         });
    //     }

    //     return breadcrumbs;
    // }
    getBreadcrumb() {
        return [...this.anterior,...(this.atual ? [this.atual] : []),].map(item => ({path: item.tela,title: item.tela }));
    }
}

export const navigationHistory = new NavigationHistory();

