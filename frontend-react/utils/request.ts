import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import { isTokenExpired } from "@/utils/jwt";

// 防止重复处理 Token 过期
let isHandlingTokenExpired = false;

function handleTokenExpired(): void {
  if (typeof window === "undefined") return;
  if (isHandlingTokenExpired) return;
  isHandlingTokenExpired = true;

  console.log("Token expired, handling logout");

  useAuthStore.getState().clearAuth();

  if (window.location.pathname !== "/login") {
    const currentUrl = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    // 跳转到登录页，并携带当前页面地址和 Token 过期原因
    window.location.replace(`/login?redirect=${currentUrl}&reason=expired`);
  } else {
    toast.error("登录已过期，请重新登录");
  }
}

export function resetTokenExpiredFlag(): void {
  isHandlingTokenExpired = false;
}

function showError(message: string): void {
  toast.error(message);
}

interface SilentError extends Error {
  silent?: boolean;
}

const instance: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      if (isTokenExpired(token)) {
        console.log("Token expired, logging out before request:", config.url);
        handleTokenExpired();
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
          handleTokenExpired();
          break;
        case 403:
          showError("权限不足，您没有访问该资源的权限");
          break;
        case 404:
          showError("请求的资源不存在");
          break;
        case 500:
          showError("服务器错误，请稍后重试");
          break;
        default:
          const responseData = error.response.data as { message?: string };
          showError(responseData?.message || "请求失败，请稍后重试");
      }
    } else if ("code" in error && error.code === "ECONNABORTED") {
      showError("请求超时，请检查网络连接");
    } else {
      showError("网络错误，请检查网络连接");
    }
    return Promise.reject(error);
  },
);

function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default request;
