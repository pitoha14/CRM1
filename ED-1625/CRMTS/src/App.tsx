import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Spin } from "antd";

import { getProfile } from "./api/authApi";
import { setUser, logout } from "./store/authSlice";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsersListPage from "./pages/UsersListPage";
import EditUserPage from "./pages/EditUserPage";
import EditUserRolesPage from "./pages/EditUserRolesPage";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        dispatch(setUser(profile));
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [dispatch]);

  if (loading) {
    return <Spin fullscreen tip="Загрузка..." />;
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

          <Route path="/admin/users" element={<UsersListPage />} />
          <Route path="/admin/users/:id" element={<EditUserPage />} />
          <Route
            path="/admin/users/:id/roles"
            element={<EditUserRolesPage />}
          />
        </Route>
      </Routes>
    </AuthLoader>
  );
}