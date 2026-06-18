import { handleApiError, RestHttpService } from "@/api/axios";
import {Account} from "../model/moviment.model";

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
    const response = await restHttpService.getHttpInstance().put<Account>("/conta/", params);
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
        // params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(data: Account): Promise<Account> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<Account>("/conta/findById", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(params: Account): Promise<Account> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<Account>("/conta", {
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