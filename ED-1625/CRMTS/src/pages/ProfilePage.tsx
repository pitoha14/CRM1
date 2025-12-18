import React, { useState, useEffect, useCallback } from "react";
import { Card, Form, Input, Button, message, Spin, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { updateProfile, getProfile } from "../api/authApi";
import { Profile, UserRequest } from "../types/types";
import { setCredentials } from "../store/authSlice";

export default function ProfilePage() {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profileData: Profile = await getProfile();
      form.setFieldsValue(profileData);
      dispatch(setCredentials({ accessToken, user: profileData }));
    } catch (e) {
      message.error("Ошибка загрузки данных профиля.");
    } finally {
      setLoading(false);
    }
  }, [form, dispatch, accessToken]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
      setLoading(false);
    } else if (accessToken) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user, form, accessToken, loadProfile]);

  const onFinish = async (values: UserRequest) => {
    setSubmitting(true);
    try {
      const updatedProfile = await updateProfile(values);

      dispatch(setCredentials({ accessToken, user: updatedProfile }));

      message.success("Профиль успешно обновлен!");
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || "Ошибка при обновлении профиля";
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <Card
        title="Мой профиль"
        style={{ maxWidth: 600, margin: "0 auto", marginTop: 50 }}
      >
        <Spin tip="Загрузка данных профиля...">
          <div style={{ minHeight: 150 }} />
        </Spin>
      </Card>
    );
  }

  return (
    <Card
      title="Мой Профиль"
      style={{ maxWidth: 600, margin: "0 auto", marginTop: 50 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Имя пользователя" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Номер телефона" name="phoneNumber">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
