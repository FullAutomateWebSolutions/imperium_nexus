import { notification } from "antd";
import axios, { AxiosError } from "axios";

const http = axios;
export interface IApiError {
  message: string;
}
export class RestHttpService {

  getHttpInstance() {
    const api = http.create({
      baseURL: import.meta.env.VITE_URL_API
    });

    return api;
  }

  translatorError(err: unknown) {
    const error = err as AxiosError<IApiError>;
    handleApiError(err);
  }

}

export interface ApiValidationError {
  timestamp: string;
  status: number;
  message: string;
  path: string;
  errors: {
    field: string | null;
    message: string;
    global: boolean;
  }[];
}

export function handleApiError(err: unknown): never {
  const error = err as AxiosError;
  const apiError = error.response?.data as ApiValidationError;

  if (apiError) {
    let erroGlobal = apiError.errors.map((error: any) => ({
      name: error.field,
      errors: [error.message],
      global: error.global
    })).filter((error: any) => error.global === true);
    if (erroGlobal.length > 0) {
      notification.error({
        message: `${apiError.message}`,
        description: "Verifique os erros no formulário.",
      });
    }
  }

  throw {
    status: apiError?.status ?? error.response?.status ?? 500,
    message:
      apiError?.errors?.[0]?.message ??
      apiError?.message ??
      error.message ??
      "Erro inesperado",
    errors: apiError?.errors ?? [],
    path: apiError?.path,
    timestamp: apiError?.timestamp,
    code: error.code,
  };
}