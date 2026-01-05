import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  message,
  Card,
  Spin,
  Space,
  Checkbox,
  Row,
  Col,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUserRoles } from "../api/adminApi";
import type { UserTableItem, Roles } from "../types/types";

const ALL_ROLES: Roles[] = ["USER", "MODERATOR", "ADMIN"];

export default function EditUserRolesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [originalRoles, setOriginalRoles] = useState<Roles[]>([]);
  const userId = Number(id);

  useEffect(() => {
    const load = async () => {
      try {
        const user: UserTableItem = await fetchUserById(userId);
        setUsername(user.username);
        setOriginalRoles(user.roles);
        form.setFieldsValue({ roles: user.roles });
      } catch {
        message.error("Ошибка загрузки пользователя");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, form, navigate]);

  const onFinish = async (values: { roles: Roles[] }) => {
    const newRoles = values.roles ?? [];

    const isSame =
      newRoles.length === originalRoles.length &&
      newRoles.every((r) => originalRoles.includes(r));

    if (isSame) {
      message.info("Роли не изменились");
      return;
    }

    setSubmitting(true);
    try {
      await updateUserRoles(userId, values.roles);
      message.success(`Роли пользователя ${username} обновлены`);
      setOriginalRoles(newRoles);
    } catch (e: any) {
      message.error(
        e.response?.data?.message || "Ошибка при обновлении ролей"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card title="Управление ролями" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Spin />
      </Card>
    );
  }

  return (
    <Card
      title={`Роли пользователя: ${username} (ID ${userId})`}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="roles"
          label="Роли"
          rules={[
            {
              validator: (_, value: Roles[]) =>
                value?.length
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Нужно выбрать хотя бы одну роль")
                    ),
            },
          ]}
        >
          <Checkbox.Group style={{ width: "100%" }}>
            <Row>
              {ALL_ROLES.map((role) => (
                <Col span={8} key={role}>
                  <Checkbox value={role}>{role}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
            >
              Сохранить
            </Button>
            <Button onClick={() => navigate("/admin/users")}>
              Назад
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}