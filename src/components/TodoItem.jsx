import React, { useState } from "react";
import { updateTodo, deleteTodo } from "../api/todoApi";

export default function TodoItem({ todo, updateTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleToggleDone = async () => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await updateTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      await updateTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await updateTodo(todo.id, { title: editValue });
      setIsEditing(false);
      await updateTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li className="todo-item">
      <input type="checkbox" checked={todo.isDone} onChange={handleToggleDone} />
      {isEditing ? (
        <>
          <input
            type="text"
            className="todo-item-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <button className="save-btn" onClick={handleSave}>Сохранить</button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>Отменить</button>
        </>
      ) : (
        <>
          <span className={todo.isDone ? "done" : ""}>{todo.title}</span>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Редактировать</button>
          <button className="delete-btn" onClick={handleDelete}>Удалить</button>
        </>
      )}
    </li>
  );
}