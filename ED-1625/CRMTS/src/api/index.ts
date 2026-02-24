import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenService";

export const BASE_URL = "https://easydev.club/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

const refreshApi = axios.create({
  baseURL: BASE_URL,
});

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

/* ---------- REQUEST ---------- */
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------- RESPONSE ---------- */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryConfig;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearAccessToken();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!originalRequest.headers) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await refreshApi.post("/auth/refresh", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      setAccessToken(accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      processQueue(accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch {
      clearAccessToken();
      localStorage.removeItem("refreshToken");
      refreshQueue = [];
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;