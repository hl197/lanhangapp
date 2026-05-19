import axios from "axios";
import { getToken, removeToken } from "../utils/storage";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL = "http://192.168.43.241:8080/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const message =
        data?.message ||
        (status === 401
          ? "请先登录"
          : status === 403
            ? "无权限访问"
            : "请求失败");

      if (status === 401) {
        await removeToken();
        useAuthStore.getState().logout();
      }

      return Promise.reject(new Error(message));
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("请求超时，请检查网络"));
    }

    return Promise.reject(new Error("网络连接失败，请检查网络"));
  },
);

export default client;
