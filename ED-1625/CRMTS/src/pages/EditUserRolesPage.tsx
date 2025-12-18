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
import { UserTableItem, Roles, UserRolesRequest } from "../types/types";

const ALL_ROLES: Roles[] = ["USER", "MODERATOR", "ADMIN"];

export default function EditUserRolesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const userId = Number(id);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      try {
        const userData: UserTableItem = await fetchUserById(userId);
        setUsername(userData.username);
        form.setFieldsValue({
          roles: userData.roles,
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

  const onFinish = async (values: { roles: Roles[] }) => {
    setSubmitting(true);
    try {
      const data: UserRolesRequest = { roles: values.roles };

      await updateUserRoles(userId, data);
      message.success(`Роли пользователя ${username} успешно обновлены!`);
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || "Ошибка при обновлении ролей";
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
    <Card title="Управление ролями" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Spin tip="Загрузка ролей пользователя...">
        <div style={{ minHeight: 150 }} />
      </Spin>
    </Card>
  );
}

  return (
    <Card
      title={`Управление ролями пользователя: ${username} (ID: ${userId})`}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
           {" "}
      <Form form={form} layout="vertical" onFinish={onFinish}>
               {" "}
        <Form.Item
          name="roles"
          label="Назначенные роли"
          rules={[
            {
              validator: (_, value: Roles[]) =>
                value && value.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Выберите хотя бы одну роль")),
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

            <Button type="primary" htmlType="submit" loading={submitting}>
                            Сохранить роли  
            </Button>

            <Button onClick={handleGoBack}>
                            Вернуться к таблице            {" "}
            </Button>
                     {" "}
          </Space>
                 {" "}
        </Form.Item>
             {" "}
      </Form>
         {" "}
    </Card>
  );
}
