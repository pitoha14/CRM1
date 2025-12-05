import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials, logout } from "./store/authSlice";
import { getProfile } from "./api/authApi";
import { BASE_URL } from "./api";
import { setAccessToken, clearAccessToken } from "./api/tokenService";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("refreshToken", newRefreshToken);
          setAccessToken(accessToken);

          const userProfile = await getProfile();
          dispatch(setCredentials({ accessToken, user: userProfile }));
        } catch (error) {
          dispatch(logout());
          clearAccessToken();
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
        }}
      >
        Загрузка...
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthLoader>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<TodoListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AuthLoader>
  );
}
