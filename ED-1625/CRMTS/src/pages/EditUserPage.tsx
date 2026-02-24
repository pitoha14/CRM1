import { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import type { UserRequest, Profile } from "../types/types";
import { fetchUserById, updateUserData } from "../api/adminApi";
import { getChangedFields } from "../utils/getChangedFields";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [originalUser, setOriginalUser] = useState<Profile | null>(null);

  const userId = Number(id);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchUserById(userId);
        setOriginalUser(user);
        form.setFieldsValue(user);
      } catch {
        message.error("Ошибка загрузки пользователя");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId, form, navigate]);

  const onFinish = async (values: UserRequest) => {
    if (!originalUser) return;

    const changes = getChangedFields(originalUser, values);

    if (Object.keys(changes).length === 0) {
      message.info("Нет изменений");
      return;
    }

    setSubmitting(true);
    try {
      await updateUserData(userId, changes);
      message.success("Пользователь обновлён");
      navigate("/admin/users");
    } catch {
      message.error("Ошибка обновления пользователя");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card title="Редактирование пользователя">
        <Spin />
      </Card>
    );
  }

  return (
    <Card title="Редактирование пользователя">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Имя пользователя" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={submitting}>
          Сохранить
        </Button>
      </Form>
    </Card>
  );
}