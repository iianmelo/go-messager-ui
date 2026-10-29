import axios, { AxiosAdapter, AxiosError, AxiosHeaders } from "axios";
import { handleDemoRequest } from "./demo-backend";

export const isDemoMode = !process.env.NEXT_PUBLIC_API_URL;

const demoAdapter: AxiosAdapter = async (config) => {
  const result = handleDemoRequest(
    config.method || "get",
    config.url,
    config.baseURL,
    config.data,
  );
  const headers = new AxiosHeaders();
  const response = {
    data: result.data,
    status: result.status,
    statusText: result.status >= 400 ? "Error" : "OK",
    headers,
    config,
  };
  if (result.status >= 400) {
    throw new AxiosError(
      "Demo request failed",
      String(result.status),
      config,
      null,
      response,
    );
  }
  return response;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  adapter: isDemoMode ? demoAdapter : undefined,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = window.localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
