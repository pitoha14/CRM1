import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenService";

export const BASE_URL = "https://easydev.club/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as any;
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      clearAccessToken();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      setAccessToken(accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      processQueue(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch {
      clearAccessToken();
      localStorage.removeItem("refreshToken");
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;