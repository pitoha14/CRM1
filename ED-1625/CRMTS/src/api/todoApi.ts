const BASE_URL = "https://easydev.club/api/v1/todos";

export type Todo = {
  id: number;
  title: string;
  created?: string;
  isDone?: boolean;
};

export async function fetchTodos(filter: string = "all"): Promise<Todo[]> {
  const res = await fetch(`${BASE_URL}?filter=${filter}`);
  if (!res.ok) {
    throw new Error("Ошибка при получении задач");
  }

  const result = await res.json();

  if (!Array.isArray(result.data)) {
    throw new Error("Ожидался массив задач в поле data");
  }

  return result.data;
}

export async function addTodo(title: string): Promise<Todo> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, isDone: false }),
  });
  if (!res.ok) {
    throw new Error("Ошибка при добавлении задачи");
  }
  const data: Todo = await res.json();
  return data;
}

export async function updateTodo(id: number, data: Partial<Todo>): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Ошибка при обновлении задачи");
  }
  const updated: Todo = await res.json();
  return updated;
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Ошибка при удалении задачи");
  }
}