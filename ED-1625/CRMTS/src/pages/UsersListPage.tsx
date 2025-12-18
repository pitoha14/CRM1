import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  deleteUser,
  blockUser,
  unblockUser,
} from "../api/adminApi";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import type { UserTableItem, UserFilters, Roles } from "../types/types";

const INITIAL_FILTERS: UserFilters = {
  page: 1,
  limit: 20,
  sortBy: "date",
  sortOrder: "desc",
  isBlocked: undefined,
};

const RoleDisplay: React.FC<{ roles: Roles[] }> = ({ roles }) => (
  <Space size={[0, 8]} wrap>
    {roles.map((role) => (
      <Tag
        key={role}
        color={
          role === "ADMIN"
            ? "red"
            : role === "MODERATOR"
            ? "orange"
            : "blue"
        }
      >
        {role}
      </Tag>
    ))}
  </Space>
);

export default function UsersListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(INITIAL_FILTERS);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles?.includes("ADMIN" as Roles);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUsers(filters);
      setUsers(response.data);
      setTotal(response.meta.totalAmount);
    } catch {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue || undefined,
      page: 1,
    }));
  };

  const handleBlockStatusFilter = (value: string) => {
    const map: Record<string, boolean | undefined> = {
      all: undefined,
      active: false,
      blocked: true,
    };

    setFilters((prev) => ({
      ...prev,
      isBlocked: map[value],
      page: 1,
    }));
  };

  const columns = [
    { title: "Имя", dataIndex: "username", sorter: true },
    { title: "Email", dataIndex: "email", sorter: true },
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
      title: "Роли",
      dataIndex: "roles",
      render: (roles: Roles[]) => <RoleDisplay roles={roles} />,
    },
    {
      title: "Действия",
      render: (_: any, record: UserTableItem) => (
        <Space>
          <Button onClick={() => navigate(`/admin/users/${record.id}`)} type="link">
            Профиль
          </Button>

          <Popconfirm
            title="Подтвердите действие"
            onConfirm={() =>
              record.isBlocked
                ? unblockUser(record.id)
                : blockUser(record.id)
            }
          >
            <Button type="link" danger={!record.isBlocked}>
              {record.isBlocked ? "Разблокировать" : "Заблокировать"}
            </Button>
          </Popconfirm>

          {isAdmin && (
            <Popconfirm
              title="Удалить пользователя?"
              onConfirm={() => deleteUser(record.id)}
            >
              <Button type="link" danger>
                Удалить
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Пользователи</h2>

      <Space style={{ marginBottom: 16 }}>
        <Space.Compact>
          <Input
            placeholder="Поиск по имени или email"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
          />
          <Button type="primary" onClick={handleSearch}>
            Найти
          </Button>
        </Space.Compact>

        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleBlockStatusFilter}
          options={[
            { value: "all", label: "Все пользователи" },
            { value: "active", label: "Активные" },
            { value: "blocked", label: "Заблокированные" },
          ]}
        />
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={users}
        columns={columns}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total,
          onChange: (page) =>
            setFilters((prev) => ({ ...prev, page })),
        }}
      />
    </>
  );
}