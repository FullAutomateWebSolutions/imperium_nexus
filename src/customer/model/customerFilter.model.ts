export class CustomerFilter {
    id?: number;
    name = "";
    email = "";
    phone = "";
    active = true;
    createdAt?: string;
    updatedAt?: string;
}
export class CustomerFilterManager {
    private listaCompleta: CustomerFilter[] = [];
    add(customer: CustomerFilter) {
        this.listaCompleta.push(customer);
    }
    remove(id: number) {
        this.listaCompleta = this.listaCompleta.filter(
            c => c.id !== id
        );
    }
    getAll() {
        return this.listaCompleta;
    }
}