import { handleApiError, RestHttpService } from "@/api/axios";
import { PaymentMethod } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: PaymentMethod): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/formaPagamento/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: PaymentMethod): Promise<PaymentMethod> {
  try {
    const response = await restHttpService.getHttpInstance().put<PaymentMethod>("/formaPagamento/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: PaymentMethod): Promise<PaymentMethod> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<PaymentMethod>("/formaPagamento/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(data: PaymentMethod): Promise<PaymentMethod> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<PaymentMethod>("/formaPagamento/findById", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(params: PaymentMethod): Promise<PaymentMethod> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<PaymentMethod>("/formaPagamento", {
        data: params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

export {
  save,
  list,
  destroy,
  update,
  fetchById
};