import React, { useState } from "react";
import { updateTodo, deleteTodo } from "../../api/todoApi";
import { Checkbox, Button, Input, message } from "antd";
import type { Todo } from "../../utils/types";

type TodoItemProps = {
  todo: Todo;
  updateTasks: () => Promise<void>;
};

export default function TodoItem({ todo, updateTasks }: TodoItemProps) {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>(todo.title);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleToggleDone = async () => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await updateTasks();
    } catch {
      message.error("Ошибка при изменении статуса задачи");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      await updateTasks();
      message.success("Задача удалена");
    } catch {
      message.error("Ошибка при удалении задачи");
    }
  };

  const handleSave = async () => {
    const trimmed = editingTitle.trim();
    if (trimmed.length < 2) {
      message.error("Задача должна быть минимум 2 символа");
      return;
    }
    if (trimmed.length > 64) {
      message.error("Задача не может быть длиннее 64 символов");
      return;
    }

    try {
      setIsUpdating(true);
      await updateTodo(todo.id, { title: trimmed });
      setIsInEditMode(false);
      await updateTasks();
      message.success("Задача обновлена");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <Checkbox checked={!!todo.isDone} onChange={handleToggleDone}>
        {!isInEditMode ? (
          <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>{todo.title}</span>
        ) : null}
      </Checkbox>

      {isInEditMode ? (
        <div style={{ display: "flex", gap: 8, flexGrow: 1, marginLeft: 8 }}>
          <Input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} disabled={isUpdating} />
          <Button type="primary" onClick={handleSave} loading={isUpdating}>Сохранить</Button>
          <Button onClick={() => { setIsInEditMode(false); setEditingTitle(todo.title); }}>Отменить</Button>
        </div>
      ) : (
        <div>
          <Button type="link" onClick={() => setIsInEditMode(true)}>Редактировать</Button>
          <Button type="link" danger onClick={handleDelete}>Удалить</Button>
        </div>
      )}
    </li>
  );
}