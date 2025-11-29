import axios from "axios";
import { store } from "../store/store"; 
import { logout, setCredentials } from "../store/authSlice";

export const BASE_URL = "https://easydev.club/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            throw new Error("Нет рефреш токена");
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem("refreshToken", newRefreshToken); // Сохраняем только Refresh Token
        
        // 💡 Здесь state.auth.user может быть null, но это нормально, 
        // так как он будет загружен после успешной аутентификации.
        store.dispatch(setCredentials({ 
            accessToken: newAccessToken, 
            user: store.getState().auth.user 
        }));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Ошибка обновления токена, пользователь должен быть разлогинен
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;