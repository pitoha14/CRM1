import { Routes, Route } from "react-router-dom";

import AuthLoader from "./components/AuthLoader/AuthLoader";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsersListPage from "./pages/UsersListPage";
import EditUserPage from "./pages/EditUserPage";
import EditUserRolesPage from "./pages/EditUserRolesPage";

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