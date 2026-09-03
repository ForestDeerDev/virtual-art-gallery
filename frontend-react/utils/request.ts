import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { isTokenExpired } from "@/utils/jwt";
import {
  getAuthToken,
  notifyTokenExpired,
  notifyError,
} from "@/utils/httpConfig";

interface SilentError extends Error {
  silent?: boolean;
}

const instance: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      if (isTokenExpired(token)) {
        console.log("Token expired, logging out before request:", config.url);
        notifyTokenExpired();
        const error: SilentError = new Error("Token expired");
        error.silent = true;
        // 把失败结果传递给后续 Promise 链处理
        return Promise.reject(error);
      }

      config.headers.set("Authorization", `Bearer ${token}`);
      console.log(
        "Request with token:",
        config.url,
        token.substring(0, 20) + "...",
      );
    } else {
      console.log("Request without token:", config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError | SilentError) => {
    // 静默错误不在此处自动提示，交由调用方处理
    if ("silent" in error && error.silent) {
      return Promise.reject(error);
    }

    if ("response" in error && error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Received 401 response, logging out");
          notifyTokenExpired();
          break;
        case 403:
          notifyError(403, "权限不足，您没有访问该资源的权限");
          break;
        case 404:
          notifyError(404, "请求的资源不存在");
          break;
        case 500:
          notifyError(500, "服务器错误，请稍后重试");
          break;
        default:
          const responseData = error.response.data as { message?: string };
          notifyError(
            error.response.status,
            responseData?.message || "请求失败，请稍后重试",
          );
      }
    } else if ("code" in error && error.code === "ECONNABORTED") {
      notifyError(null, "请求超时，请检查网络连接");
    } else {
      notifyError(null, "网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  },
);

function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default request;
