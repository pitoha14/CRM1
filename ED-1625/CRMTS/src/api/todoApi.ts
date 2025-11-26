import api from "./index"; 
import type { Todo, Filter, ApiResponse } from "../types/types";


export async function fetchTodos(filter: Filter = "all") {
  const response = await api.get<ApiResponse<Todo[]>>("/todos", {
    params: { filter },
  });
  return response.data;
}

export async function addTodo(title: string) {
  const response = await api.post<ApiResponse<Todo>>("/todos", {
    title,
    isDone: false,
  });
  return response.data.data;
}

export async function updateTodo(id: number, data: Partial<Pick<Todo, "title" | "isDone">>) {
  const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);
  return response.data.data;
}

export async function deleteTodo(id: number) {
  await api.delete(`/todos/${id}`);
}