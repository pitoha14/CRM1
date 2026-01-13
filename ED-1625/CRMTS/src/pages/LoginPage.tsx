import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, getProfile } from "../api/authApi";
import { setUser } from "../store/authSlice";
import { setAccessToken } from "../api/tokenService";
import type { AuthData } from "../types/types";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: AuthData) => {
    try {
      const { accessToken, refreshToken } = await loginUser(values);

      setAccessToken(accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const profile = await getProfile();
      dispatch(setUser(profile));

      message.success("Вы вошли!");
      navigate("/");
    } catch {
      message.error("Неверный логин или пароль");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Вход</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="login" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Войти
        </Button>
      </Form>
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <Link to="/register">Регистрация</Link>
      </div>
    </div>
  );
}