import React, { useEffect, useState, useCallback } from "react";
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
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
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
  sortBy: undefined,
  sortOrder: undefined,
  search: undefined,
  isBlocked: undefined,
};

export default function UsersListPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles?.includes("ADMIN" as Roles);

  const [users, setUsers] = useState<UserTableItem[]>([]);
  const [filters, setFilters] = useState<UserFilters>(INITIAL_FILTERS);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers(filters);
      setUsers(res.data);
      setTotal(res.meta.totalAmount);
    } catch {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: any,
    sorter: SorterResult<UserTableItem> | SorterResult<UserTableItem>[]
  ) => {
    const s = sorter as SorterResult<UserTableItem>;

    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      sortBy: s.order ? (s.field as string) : undefined,
      sortOrder:
        s.order === "ascend"
          ? "asc"
          : s.order === "descend"
          ? "desc"
          : undefined,
    }));
  };

  const handleAction = async (action: () => Promise<any>) => {
    try {
      await action();
      message.success("Операция выполнена");
      await loadUsers(); 
    } catch {
      message.error("Ошибка операции");
    }
  };

  const columns: ColumnsType<UserTableItem> = [
    {
      title: "Имя пользователя",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
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
      title: "Роли",
      dataIndex: "roles",
      render: (roles: Roles[]) =>
        roles.map((r) => (
          <Tag
            key={r}
            color={
              r === "ADMIN" ? "red" : r === "MODERATOR" ? "orange" : "blue"
            }
          >
            {r}
          </Tag>
        )),
    },
    {
      title: "Телефон",
      dataIndex: "phoneNumber",
    },
    {
      title: "Действия",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/admin/users/${record.id}`)}>
            Профиль
          </Button>

          <Button
            type="link"
            onClick={() => navigate(`/admin/users/${record.id}/roles`)}
          >
            Роли
          </Button>

          <Popconfirm
            title="Подтвердите действие"
            onConfirm={() =>
              handleAction(() =>
                record.isBlocked
                  ? unblockUser(record.id)
                  : blockUser(record.id)
              )
            }
          >
            <Button type="link" danger={!record.isBlocked}>
              {record.isBlocked ? "Разблокировать" : "Заблокировать"}
            </Button>
          </Popconfirm>

          {isAdmin && (
            <Popconfirm
              title="Удалить пользователя?"
              onConfirm={() =>
                handleAction(() => deleteUser(record.id))
              }
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
        <Input
          placeholder="Поиск по имени или email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={() =>
            setFilters((p) => ({
              ...p,
              search: searchValue || undefined,
              page: 1,
            }))
          }
          allowClear
        />

        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={(v) =>
            setFilters((p) => ({
              ...p,
              isBlocked:
                v === "all" ? undefined : v === "blocked" ? true : false,
              page: 1,
            }))
          }
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
        onChange={handleTableChange}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total,
        }}
      />
    </>
  );
}
