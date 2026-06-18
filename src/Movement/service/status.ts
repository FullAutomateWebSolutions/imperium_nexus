import { handleApiError, RestHttpService } from "@/api/axios";
import { MovementById, MovementDelete, MovementFilter, MovementListResponse, MovementResponse, MovementType } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: MovementType): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/status/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: MovementType): Promise<MovementResponse> {
  try {
    const response = await restHttpService.getHttpInstance().put<MovementResponse>("/status/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: MovementFilter): Promise<MovementListResponse> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<MovementListResponse>("/status/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(data: MovementById): Promise<MovementType> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<MovementType>("/status/findById", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(params: MovementDelete): Promise<MovementResponse> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<MovementResponse>("/status", {
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