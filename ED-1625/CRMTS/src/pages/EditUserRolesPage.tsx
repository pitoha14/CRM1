import React, { useEffect, useState } from "react";
import { Form, Button, message, Card, Spin, Space, Checkbox, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUserRoles } from "../api/adminApi";
import type { UserTableItem, Roles } from "../types/types";
import type { AxiosError } from "axios";

const ALL_ROLES: Roles[] = ["USER", "MODERATOR", "ADMIN"];

export default function EditUserRolesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [originalRoles, setOriginalRoles] = useState<Roles[]>([]);
  const userId = Number(id);

  useEffect(() => {
    async function load() {
      try {
        const user: UserTableItem = await fetchUserById(userId);
        setOriginalRoles(user.roles);
        form.setFieldsValue({ roles: user.roles });
      } catch {
        message.error("Ошибка загрузки пользователя");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, form, navigate]);

  const onFinish = async (values: { roles: Roles[] }) => {
    setSubmitting(true);
    try {
      await updateUserRoles(userId, values.roles);
      setOriginalRoles(values.roles);
      message.success("Роли обновлены");
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      message.error(err.response?.data?.message ?? "Ошибка обновления ролей");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card title="Роли пользователя">
        <Spin />
      </Card>
    );
  }

  return (
    <Card title={`Роли пользователя (ID ${userId})`}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="roles">
          <Checkbox.Group>
            <Row>
              {ALL_ROLES.map((role) => (
                <Col span={8} key={role}>
                  <Checkbox value={role}>{role}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Сохранить
          </Button>
          <Button onClick={() => navigate("/admin/users")}>Назад</Button>
        </Space>
      </Form>
    </Card>
  );
}