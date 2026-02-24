import api from "./index";
import type {
  UserFilters,
  UsersListResponse,
  UserTableItem,
  UserRequest,
  Roles,
} from "../types/types";

export async function fetchUsers(
  filters: UserFilters
): Promise<UsersListResponse> {
  const response = await api.get("/admin/users", { params: filters });
  return response.data;
}

export async function fetchUserById(id: number): Promise<UserTableItem> {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
}

export async function updateUserData(
  id: number,
  data: UserRequest
): Promise<UserTableItem> {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
}

export async function updateUserRoles(
  id: number,
  roles: Roles[]
): Promise<UserTableItem> {
  const response = await api.post<UserTableItem>(
    `/admin/users/${id}/rights`,
    { roles } 
  );
  return response.data;
}

export async function blockUser(id: number): Promise<UserTableItem> {
  const response = await api.post(`/admin/users/${id}/block`);
  return response.data;
}

export async function unblockUser(id: number): Promise<UserTableItem> {
  const response = await api.post(`/admin/users/${id}/unblock`);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

export async function updateUser(
  id: number,
  data: UserRequest
): Promise<UserTableItem> {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
}