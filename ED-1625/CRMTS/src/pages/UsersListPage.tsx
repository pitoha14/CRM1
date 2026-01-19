import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Button, message, Tag, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../api/adminApi";
import type { UserTableItem } from "../types/types";

export default function UsersListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({ page: 1, limit: 20 });
      setUsers(res.data);
    } catch {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const columns = useMemo<ColumnsType<UserTableItem>>(
    () => [
      {
        title: "Имя",
        dataIndex: "username",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Статус",
        dataIndex: "isBlocked",
        render: (v: boolean) => (
          <Tag color={v ? "red" : "green"}>
            {v ? "Заблокирован" : "Активен"}
          </Tag>
        ),
      },
      {
        title: "Действия",
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              onClick={() => navigate(`/admin/users/${record.id}`)}
            >
              Профиль
            </Button>
            <Button
              type="link"
              onClick={() => navigate(`/admin/users/${record.id}/roles`)}
            >
              Роли
            </Button>
          </Space>
        ),
      },
    ],
    [navigate]
  );

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={users}
    />
  );
}