import axios from "axios";
import type { Todo, Filter, ApiResponse } from "../types/types"

const BASE_URL = "https://easydev.club/api/v1/todos";

export async function fetchTodos(filter: Filter = "all") {
  const response = await axios.get<ApiResponse<Todo[]>>(BASE_URL, {
    params: { filter },
  });
  return response.data; 
}

export async function addTodo(title: string) {
  const response = await axios.post<ApiResponse<Todo>>(BASE_URL, {
    title,
    isDone: false,
  });
  return response.data.data;
}

export async function updateTodo(id: number, data: Partial<Pick<Todo, "title" | "isDone">>) {
  const response = await axios.put<ApiResponse<Todo>>(`${BASE_URL}/${id}`, data);
  return response.data.data;
}

export async function deleteTodo(id: number) {
  await axios.delete(`${BASE_URL}/${id}`);
}