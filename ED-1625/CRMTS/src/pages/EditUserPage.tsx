import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Spin, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUserData } from "../api/adminApi";
import type { UserTableItem, UserRequest } from "../types/types";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [original, setOriginal] = useState<UserRequest>({});
  const userId = Number(id);

  useEffect(() => {
    const load = async () => {
      try {
        const user: UserTableItem = await fetchUserById(userId);
        form.setFieldsValue(user);
        setOriginal({
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        });
      } catch {
        message.error("Ошибка загрузки пользователя");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, form, navigate]);

  const onFinish = async (values: UserRequest) => {
    const changes: UserRequest = {};

    if (values.username !== original.username)
      changes.username = values.username;

    if (values.email !== original.email)
      changes.email = values.email;

    if (values.phoneNumber !== original.phoneNumber)
      changes.phoneNumber = values.phoneNumber;

    if (!Object.keys(changes).length) {
      message.info("Нет изменений для сохранения");
      return;
    }

    setSubmitting(true);
    try {
      await updateUserData(userId, changes);
      message.success("Пользователь обновлён");
      setOriginal(values);
    } catch {
      message.error("Ошибка обновления данных");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card title="Профиль пользователя">
        <Spin />
      </Card>
    );
  }

  return (
    <Card title={`Профиль пользователя (ID ${userId})`}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Имя пользователя"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Номер телефона">
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Сохранить
            </Button>
            <Button onClick={() => navigate("/admin/users")}>
              Вернуться
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}