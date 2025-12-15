import api from "./index";
import type {
  UserFilters,
  UsersListResponse,
  UserTableItem,
  UserRolesRequest,
  UserRequest,
} from "../types/types";

export async function fetchUsers(filters: UserFilters): Promise<UsersListResponse> {
  const response = await api.get<UsersListResponse>("/admin/users", {
    params: filters,
  });
  return response.data;
}

export async function fetchUserById(id: number): Promise<UserTableItem> {
  const response = await api.get<UserTableItem>(`/admin/users/${id}`);
  return response.data;
}

export async function updateUserData(
  id: number,
  data: UserRequest
): Promise<UserTableItem> {
  const response = await api.put<UserTableItem>(`/admin/users/${id}`, data);
  return response.data;
}

export async function updateUserRoles(
  id: number,
  data: UserRolesRequest
): Promise<UserTableItem> {
  const response = await api.put<UserTableItem>(
    `/admin/users/${id}/rights`,
    data
  );
  return response.data;
}


export async function blockUser(id: number): Promise<UserTableItem> {
  const response = await api.post<UserTableItem>(`/admin/users/${id}/block`);
  return response.data;
}

export async function unblockUser(id: number): Promise<UserTableItem> {
  const response = await api.post<UserTableItem>(`/admin/users/${id}/unblock`);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}