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
    const response = await restHttpService.getHttpInstance().put<Card>("/cartao/", params);
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

async function fetchById(data: Card): Promise<Card> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<Card>("/cartao/findById", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(params: Card): Promise<Card> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<Card>("/cartao", {
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