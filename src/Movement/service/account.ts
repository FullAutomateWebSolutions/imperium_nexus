import { handleApiError, RestHttpService } from "@/api/axios";
import { Account } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: Account): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/conta/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: Account): Promise<Account> {
  try {
    const response = await restHttpService.getHttpInstance().put<Account>(`/conta/${params.codconta}`, {
      tipoconta: params.tipoconta,
      descconta: params.descconta,
      indativo: params.indativo


    });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: Account): Promise<Account> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Account>("/conta/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(id: number): Promise<Account> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Account>(`/conta/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(id: number): Promise<Account> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<Account>(`/conta/${id}`);
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