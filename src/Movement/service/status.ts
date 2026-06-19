import { handleApiError, RestHttpService } from "@/api/axios";
import { Status } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: Status): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/status/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: Status): Promise<Status> {
  try {
    const response = await restHttpService.getHttpInstance().put<Status>(`/status/${params.codstatus}`, {
      descstatus: params.descstatus,
      desccompleta: params.desccompleta,
      indativo: params.indativo
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: Status): Promise<Status> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Status>("/status/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(id: number): Promise<Status> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Status>(`/status/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(id: number): Promise<Status> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<Status>(`/status/${id}`);
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