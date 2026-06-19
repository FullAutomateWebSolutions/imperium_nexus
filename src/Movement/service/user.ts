import { handleApiError, RestHttpService } from "@/api/axios";
import { User } from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: User): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/usuario/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: User): Promise<User> {
  try {
    const response = await restHttpService.getHttpInstance().put<User>(`/usuario/${params.codusuario}`, {
      nome: params.nome,
      email: params.email,
      role: params.role,
      indativo: params.indativo


    });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: User): Promise<User> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<User>("/usuario/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(id: number): Promise<User> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<User>(`/usuario/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(id: number): Promise<User> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<User>(`/usuario/${id}`);
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