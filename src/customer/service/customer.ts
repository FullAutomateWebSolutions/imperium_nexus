import { handleApiError, RestHttpService } from "@/api/axios";
import { CustomerType, CustomerFilter, CustomerListResponse, CustomerDelete, CustomerById, CustomerResponse } from "../model/customer.model";

const restHttpService = new RestHttpService();

async function save(params: CustomerType) {
  try {
    const response = await restHttpService.getHttpInstance().post("/customer", params);
    return response.data;
  } catch (err) {
    handleApiError(err);

  }
}

async function update(params: CustomerType): Promise<CustomerResponse> {
  try {
    const response = await restHttpService.getHttpInstance().put<CustomerResponse>("/customer", params);
    return response.data;
  } catch (err) {
    handleApiError(err);

  }
}


async function list(params: CustomerFilter): Promise<CustomerListResponse> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .get<CustomerListResponse>("/customer/list", {
        params,
      });
    return response.data;
  } catch (err) {
    handleApiError(err);

  }
}

async function fetchByid(data: CustomerById): Promise<CustomerType> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .post<CustomerType>("/customer/findById", data);
    return response.data;
  } catch (err) {
    handleApiError(err);

  }
}

async function destroy(params: CustomerDelete): Promise<CustomerResponse> {
  try {
    const response = await restHttpService
      .getHttpInstance()
      .delete<CustomerResponse>(`/customer`, {
        data: params,
        //  params: params
      });
    return response.data;
  } catch (err) {
    handleApiError(err);

  }
}

export {
  save,
  list,
  destroy,
  update,
  fetchByid
}