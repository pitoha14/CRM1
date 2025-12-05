import axios from "axios";
import { store } from "../store/store";
import { setCredentials, logout } from "../store/authSlice";
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

function addToQueue(callback: (token: string) => void) {
  refreshQueue.push(callback);
}

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
    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config;
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAccessToken();
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        addToQueue((token: string) => {
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = res.data.accessToken;
      const newRefreshToken = res.data.refreshToken;

      setAccessToken(newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      const currentUser = store.getState().auth.user;
      store.dispatch(
        setCredentials({ accessToken: newAccessToken, user: currentUser })
      );

      processQueue(newAccessToken);

      if (!originalRequest.headers) originalRequest.headers = {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (err) {
      clearAccessToken();
      localStorage.removeItem("refreshToken");
      store.dispatch(logout());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
