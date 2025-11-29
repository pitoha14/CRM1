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
      
      // 💡 ИЗМЕНЕНИЕ: Убран Link из message.success, чтобы избежать ошибки Context
      message.success("Регистрация успешна! Перенаправление на страницу входа...");
      
      // 💡 Добавлено автоматическое перенаправление после успешной регистрации
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Перенаправление через 1.5 секунды

    } catch (error: any) {
        console.error("Ошибка от сервера:", error.response?.data); 
        
        if (error.response?.status === 409) {
            message.error("Такой пользователь уже существует");
        } else if (error.response?.status === 400) {
            // Эта ошибка (400) может содержать "alpha"
            const serverMessage = error.response?.data?.message || "Неверные данные. Проверьте формат почты, пароля или логина (могут быть ограничены только буквами).";
            message.error(serverMessage);
        } else {
            message.error("Неизвестная ошибка регистрации");
        }
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Регистрация</h2>
      <Form layout="vertical" onFinish={onFinish}>
        {/* ... Валидация login и username оставлена, как была ... */}
        <Form.Item 
          name="username" 
          label="Имя пользователя" 
          rules={[
            { required: true, message: "Введите имя пользователя" },
            { min: 3, message: "Минимум 3 символа" },
            { max: 20, message: "Максимум 20 символов" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="login" 
          label="Логин" 
          rules={[
            { required: true, message: "Введите логин" },
            { min: 3, message: "Минимум 3 символа" },
            { max: 20, message: "Максимум 20 символов" },
            // Валидация фронтенда, которая противоречит бэкенду. 
            // Оставьте для корректного отображения ошибок пользователю.
            { pattern: /^[a-zA-Z0-9]+$/, message: "Логин должен содержать только латинские буквы и цифры" } 
          ]}
        >
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