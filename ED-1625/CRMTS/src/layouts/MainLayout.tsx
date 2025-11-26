import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const { Sider, Content } = Layout;

export default function MainLayout() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  const items = [
    { key: "/", icon: <UnorderedListOutlined />, label: <Link to="/">Список задач</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Профиль</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div style={{ height: 64, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
          Todo App
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background: "white" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}