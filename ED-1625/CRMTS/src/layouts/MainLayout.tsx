import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  UnorderedListOutlined,
  UserOutlined,
  TeamOutlined, 
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Roles } from "../types/types"; 

const { Sider, Content } = Layout;

export default function MainLayout() {
  const { isAuth, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  const userRoles = user?.roles || [];
  const isAdminOrModerator = userRoles.includes("ADMIN" as Roles) || userRoles.includes("MODERATOR" as Roles);

  const items = [
    {
      key: "/",
      icon: <UnorderedListOutlined />,
      label: <Link to="/">Список задач</Link>,
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">Профиль</Link>,
    },
  ];

  if (isAdminOrModerator) {
      items.push({
          key: "/admin/users",
          icon: <TeamOutlined />,
          label: <Link to="/admin/users">Пользователи</Link>,
      });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div
          style={{
            height: 64,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          Todo App
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background: "white" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}