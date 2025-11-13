import axios from "axios";
import type { Todo, TodosCount } from "../utils/types";

const BASE_URL = "https://easydev.club/api/v1/todos";

export type TodosResponse = {
  data: Todo[];
  info: TodosCount;
  meta?: any;
};

export type UpdateTodoData = {
  title?: string;
  isDone?: boolean;
};

export async function fetchTodos(filter: string = "all"): Promise<TodosResponse> {
  try {
    const { data } = await axios.get(BASE_URL, { params: { filter } });
    if (!Array.isArray(data.data) || !data.info) {
      throw new Error("Некорректный ответ от сервера");
    }
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error);
    throw error;
  }
}

export async function addTodo(title: string): Promise<Todo> {
  const { data } = await axios.post(BASE_URL, { title, isDone: false });
  return data;
}

export async function updateTodo(id: number, data: UpdateTodoData): Promise<Todo> {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`);
}