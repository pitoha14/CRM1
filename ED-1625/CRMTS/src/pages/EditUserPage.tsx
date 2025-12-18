import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Spin, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUserData } from "../api/adminApi";
import { UserTableItem, UserRequest } from "../types/types";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const userId = Number(id);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      try {
        const userData: UserTableItem = await fetchUserById(userId);
        form.setFieldsValue({
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
      } catch (e) {
        message.error("Ошибка загрузки данных пользователя");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [userId, form, navigate]);

  const onFinish = async (values: UserRequest) => {
    setSubmitting(true);
    try {
      const originalValues = form.getFieldsValue();

      const changes: UserRequest = {};
      if (values.username !== originalValues.username)
        changes.username = values.username;
      
      if (values.phoneNumber !== originalValues.phoneNumber)
        changes.phoneNumber = values.phoneNumber;

      if (Object.keys(changes).length === 0) {
        message.info("Нет изменений для сохранения.");
        return;
      }

      await updateUserData(userId, changes);
      message.success("Данные пользователя успешно обновлены!");

      const updatedData: UserTableItem = await fetchUserById(userId);
      form.setFieldsValue(updatedData);
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || "Ошибка при обновлении данных";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/users");
  };

  if (loading) {
  return (
    <Card title="Профиль пользователя" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Spin tip="Загрузка данных пользователя...">
        <div style={{ minHeight: 150 }} />
      </Spin>
    </Card>
  );
}

  return (
    <Card
      title={`Редактирование профиля пользователя: ID ${userId}`}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ username: "", email: "", phoneNumber: "" }}
      >
        <Form.Item
          name="username"
          label="Имя пользователя"
          rules={[{ required: true, message: "Введите имя пользователя" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
        >
          <Input disabled /> 
        </Form.Item>
        <Form.Item name="phoneNumber" label="Номер телефона">
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Сохранить
            </Button>
            <Button onClick={handleGoBack}>
              Вернуться к таблице
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}