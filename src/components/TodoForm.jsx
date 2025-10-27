import React, { useState } from "react";
import { addTodo } from "../api/todoApi";

export default function TodoForm({ updateTasks }) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTask = async () => {
    if (!inputValue.trim()) return;
    try {
      await addTodo(inputValue);
      setInputValue("");
      await updateTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="todo-form">
      <input
        type="text"
        className="todo-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Введите задачу"
      />
      <button className="todo-add-btn" onClick={handleAddTask}>
        Добавить
      </button>
    </div>
  );
}