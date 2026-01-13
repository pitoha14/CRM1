import React, { useEffect, useState, useCallback } from "react";
import { Card, Form, Input, Button, message, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { getProfile, updateProfile } from "../api/authApi";
import type { Profile, UserRequest } from "../types/types";
import { setUser } from "../store/authSlice";
import type { AxiosError } from "axios";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadProfile = useCallback(async () => {
    try {
      const profile: Profile = await getProfile();
      dispatch(setUser(profile));
      form.setFieldsValue(profile);
    } catch {
      message.error("Ошибка загрузки профиля");
    } finally {
      setLoading(false);
    }
  }, [dispatch, form]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
      setLoading(false);
    } else {
      loadProfile();
    }
  }, [user, loadProfile, form]);

  const onFinish = async (values: UserRequest) => {
    setSubmitting(true);
    try {
      const updatedProfile = await updateProfile(values);
      dispatch(setUser(updatedProfile));
      message.success("Профиль успешно обновлён");
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      message.error(
        err.response?.data?.message || "Ошибка при обновлении профиля"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card
        title="Мой профиль"
        style={{ maxWidth: 600, margin: "50px auto" }}
      >
        <Spin tip="Загрузка профиля..." />
      </Card>
    );
  }

  return (
    <Card
      title="Мой профиль"
      style={{ maxWidth: 600, margin: "50px auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Имя пользователя" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Телефон" name="phoneNumber">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={submitting}>
          Сохранить
        </Button>
      </Form>
    </Card>
  );
}