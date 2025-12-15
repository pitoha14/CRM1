import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Input, Select, message, Popconfirm, Tag, Space, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  deleteUser,
  blockUser,
  unblockUser,
  updateUserRoles,
} from "../api/adminApi";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import type { UserTableItem, UserFilters, Roles } from "../types/types";

const { Search } = Input;
const { Option } = Select;

const INITIAL_FILTERS: UserFilters = {
  page: 1,
  limit: 20, 
  sortBy: "date",
  sortOrder: "desc",
  isBlocked: undefined,
};

const RoleDisplay: React.FC<{ roles: Roles[] }> = ({ roles }) => (
    <Space size={[0, 8]} wrap>
        {roles.map(role => (
            <Tag key={role} color={role === "ADMIN" ? "red" : role === "MODERATOR" ? "orange" : "blue"}>
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
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.roles?.includes("ADMIN" as Roles);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUsers(filters);
      setUsers(response.data);
      setTotal(response.meta.totalAmount);
    } catch (e) {
      message.error("Ошибка загрузки списка пользователей");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }));
  };

  const handleBlockStatusFilter = (value: string) => {
    let isBlockedValue: boolean | undefined;
    if (value === "blocked") isBlockedValue = true;
    else if (value === "active") isBlockedValue = false;
    else isBlockedValue = undefined;

    setFilters(prev => ({ ...prev, isBlocked: isBlockedValue, page: 1 }));
  };

  const handleTableChange = (pagination: any, tableFilters: any, sorter: any) => {
    if (sorter.field) {
      setFilters(prev => ({
        ...prev,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
        page: 1,
      }));
    }
  };

  const handleBlockUnblock = async (userId: number, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockUser(userId);
        message.success("Пользователь разблокирован");
      } else {
        await blockUser(userId);
        message.success("Пользователь заблокирован");
      }
      loadUsers(); 
    } catch (e) {
      message.error(`Ошибка ${isBlocked ? "разблокировки" : "блокировки"}`);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success("Пользователь успешно удален");
      loadUsers(); 
    } catch (e) {
      message.error("Ошибка удаления пользователя");
    }
  };


  const columns = [
    {
      title: "Имя пользователя",
      dataIndex: "username",
      sorter: true,
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      key: "email",
    },
    {
      title: "Телефон",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone: string | undefined) => phone || "N/A",
    },
    {
      title: "Дата регистрации",
      dataIndex: "date",
      key: "date",
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Статус блокировки",
      dataIndex: "isBlocked",
      key: "isBlocked",
      render: (isBlocked: boolean) => (
        <Tag color={isBlocked ? "red" : "green"}>
          {isBlocked ? "Заблокирован" : "Активен"}
        </Tag>
      ),
    },
    {
      title: "Роли",
      dataIndex: "roles",
      key: "roles",
      render: (roles: Roles[]) => <RoleDisplay roles={roles} />,
    },
    {
      title: "Действия",
      key: "actions",
      render: (text: any, record: UserTableItem) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/admin/users/${record.id}`)}>
            Профиль
          </Button>
          <Popconfirm
            title={`Вы уверены, что хотите ${record.isBlocked ? "разблокировать" : "заблокировать"} пользователя ${record.username}?`}
            onConfirm={() => handleBlockUnblock(record.id, record.isBlocked)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger={!record.isBlocked}>
              {record.isBlocked ? "Разблокировать" : "Блокировать"}
            </Button>
          </Popconfirm>
          {isAdmin && (
            <Popconfirm
              title={`Вы уверены, что хотите удалить пользователя ${record.username}?`}
              onConfirm={() => handleDelete(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button type="link" danger>
                Удалить
              </Button>
            </Popconfirm>
          )}
          {isAdmin && (
            <Button type="link" onClick={() => navigate(`/admin/users/${record.id}/roles`)}>
              Изменить роли
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Управление пользователями</h2>
      <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Search
          placeholder="Поиск по имени или email"
          onSearch={handleSearch}
          onChange={(e) => {
            if (e.target.value === "") handleSearch("");
          }}
          style={{ width: 300 }}
        />

        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleBlockStatusFilter}
        >
          <Option value="all">Все пользователи</Option>
          <Option value="active">Только активные</Option>
          <Option value="blocked">Только заблокированные</Option>
        </Select>
      </Space>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: total,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} пользователей`,
            onChange: (page) => setFilters(prev => ({ ...prev, page })),
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}