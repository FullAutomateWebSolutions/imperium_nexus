import { handleApiError, RestHttpService } from "@/api/axios";
import { MovementById, MovementDelete, MovementFilter, MovementListResponse, MovementResponse, MovementType } from "../model/moviment.model";
// import { 
//   MovementType, 
//   MovementFilter, 
//   MovementListResponse, 
//   MovementDelete, 
//   MovementById, 
//   MovementResponse 
// } from "../model/movement.model";

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
    const response = await restHttpService.getHttpInstance().put<MovementResponse>("/movimentacao/", params);
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

async function fetchById(data: MovementById): Promise<MovementType> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<MovementType>("/movimentacao/findById", data);
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
      .delete<MovementResponse>("/movimentacao", {
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