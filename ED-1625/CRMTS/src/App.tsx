import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import TodoListPage from "./pages/TodoListPage";
import ProfilePage from "./pages/ProfilePage";

const { Sider, Content } = Layout;

export default function App() {
  const loc = useLocation();
  const selectedKey = loc.pathname === "/" ? "/" : loc.pathname;

  const menuItems = [
    { key: "/", icon: <UnorderedListOutlined />, label: <Link to="/">Список задач</Link> },
    { key: "/profile", icon: <UserOutlined />, label: <Link to="/profile">Профиль</Link> },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          style={{
            height: 64,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          TodoApp
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
      </Sider>

      <Layout>
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<TodoListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}