import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import type { UserRegistration } from "../types/types";

export default function RegisterPage() {
  const navigate = useNavigate();

 const onFinish = async (values: any) => {
    try {

      const dataToSend: UserRegistration = {
        login: values.login,
        username: values.username,
        password: values.password,
        email: values.email,
        phoneNumber: values.phoneNumber ? values.phoneNumber : undefined, 
      };

      await registerUser(dataToSend);
      message.success("Регистрация успешна! Теперь войдите.");
      navigate("/login");
    } catch (error: any) {
        console.error("Ошибка от сервера:", error.response?.data); 
        
        if (error.response?.status === 409) {
            message.error("Такой пользователь уже существует");
        } else if (error.response?.status === 400) {
            message.error("Неверные данные. Проверьте формат почты или пароля.");
        } else {
            message.error("Ошибка регистрации");
        }
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Регистрация</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Имя пользователя" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="login" label="Логин" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Телефон">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item 
            name="confirm" 
            label="Повторите пароль" 
            rules={[
                { required: true },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Пароли не совпадают'));
                    },
                }),
            ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Зарегистрироваться</Button>
      </Form>
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <Link to="/login">Уже есть аккаунт? Войти</Link>
      </div>
    </div>
  );
}