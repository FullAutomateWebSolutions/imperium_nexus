import { handleApiError, RestHttpService } from "@/api/axios";
import { MovementById, MovementDelete, MovementFilter, MovementListResponse, MovementResponse, MovementType } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: MovementType): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/movimentacao/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: MovementType): Promise<MovementResponse> {
  try {
    const response = await restHttpService.getHttpInstance().put<MovementResponse>(`/movimentacao/${params.codmovimentacao}`, params);
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
      .get<MovementListResponse>("/movimentacao/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(id: number): Promise<MovementType> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<MovementType>(`/movimentacao/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(id: number): Promise<MovementResponse> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<MovementResponse>(`/movimentacao/${id}`);
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