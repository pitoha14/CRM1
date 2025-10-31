const BASE_URL = "https://easydev.club/api/v1/todos";

export async function fetchTodos(filter = "all") {
  const res = await fetch(`${BASE_URL}?filter=${filter}`);
  if (!res.ok) {
    throw new Error("Ошибка при получении задач");
  }
  return res.json();
}

export async function addTodo(title) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, isDone: false }),
  });
  if (!res.ok) {
    throw new Error("Ошибка при добавлении задачи");
  }
  return res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Ошибка при обновлении задачи");
  }
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Ошибка при удалении задачи");
  }
  return res.json();
}
