import { handleApiError, RestHttpService } from "@/api/axios";
import { Category} from "../model/moviment.model";

const restHttpService = new RestHttpService();

async function save(params: Category): Promise<any> {
  try {
    const response = await restHttpService.getHttpInstance().post("/categoria/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
}

async function update(params: Category): Promise<Category> {
  try {
    const response = await restHttpService.getHttpInstance().put<Category>("/categoria/", params);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function list(params: Category): Promise<Category> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<Category>("/categoria/", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function fetchById(data: Category): Promise<Category> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<Category>("/categoria/findById", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
}

async function destroy(params: Category): Promise<Category> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<Category>("/categoria", {
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