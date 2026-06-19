import { notification } from "antd";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const http = axios;

export interface IApiError {
  message: string;
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

export class RestHttpService {

  getHttpInstance() {
    const api = http.create({
      baseURL: import.meta.env.VITE_URL_API
    });

 
    api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("faws:token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("faws:token");
          localStorage.removeItem("faws:user");
          
          notification.warning({
            message: "Sessão Expirada",
            description: "Sua sessão expirou. Por favor, faça login novamente.",
          });
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );

    return api;
  }

  translateError(err: unknown) {
    handleApiError(err);
  }
}

export function handleApiError(err: unknown): never {
  const error = err as AxiosError;
  const apiError = error.response?.data as ApiValidationError;

  if (apiError) {
    const erroGlobal = apiError.errors
      ?.map((errItem: any) => ({
        name: errItem.field,
        errors: [errItem.message],
        global: errItem.global
      }))
      .filter((errItem: any) => errItem.global === true) ?? [];

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