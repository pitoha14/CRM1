import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, getProfile } from "../api/authApi";
import { setCredentials } from "../store/authSlice";
import type { AuthData } from "../types/types";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: AuthData) => {
    try {
      const tokenData = await loginUser(values);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
      
      // 💡 Убран первый вызов dispatch(setCredentials) с user: null

      const userProfile = await getProfile();

      // 💡 Единый вызов dispatch с полными данными
      dispatch(setCredentials({ accessToken: tokenData.accessToken, user: userProfile }));

      message.success("Вы вошли!");
      navigate("/"); 
    } catch (error) {
      message.error("Неверный логин или пароль");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Вход в систему</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="login" label="Логин" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Войти</Button>
      </Form>
      <div style={{ marginTop: 10, textAlign: "center" }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}