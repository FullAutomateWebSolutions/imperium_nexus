import { handleApiError, RestHttpService } from "@/api/axios";
import { Card } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: Card): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/cartao/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: Card): Promise<Card> {
  try {
    const response = await restHttpService.getHttpInstance().put<Card>(`/cartao/${params.codcartao}`, {

      "tipocartao": params.tipocartao,
      "desccartao": params.desccartao,
      "indativo": params.indativo
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: Card): Promise<Card> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Card>("/cartao/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(id: number): Promise<Card> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Card>(`/cartao/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(id: number): Promise<Card> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<Card>(`/cartao/${id}`);
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