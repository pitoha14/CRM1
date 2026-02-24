import api from "./index";
import { getAccessToken } from "./tokenService";
import type { Todo, Filter, ApiResponse } from "../types/types";

export async function fetchTodos(
  filter: Filter = "all"
): Promise<ApiResponse<Todo[]>> {
  const token = getAccessToken();

  if (!token) {
    return { data: [] };
  }

  const response = await api.get<ApiResponse<Todo[]>>("/todos", {
    params: { filter },
  });

  return response.data;
}

export async function addTodo(title: string): Promise<Todo> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authorized");

  const response = await api.post<ApiResponse<Todo>>("/todos", {
    title,
    isDone: false,
  });

  return response.data.data;
}

export async function updateTodo(
  id: number,
  data: Partial<Pick<Todo, "title" | "isDone">>
): Promise<Todo> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authorized");

  const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);
  return response.data.data;
}

export async function deleteTodo(id: number): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authorized");

  await api.delete(`/todos/${id}`);
}