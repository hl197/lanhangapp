import axios from "axios";
import { getToken } from "../utils/storage";

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
  (error) => {
    const message = error.response?.data?.message || "网络错误";
    return Promise.reject(new Error(message));
  },
);

export default client;
