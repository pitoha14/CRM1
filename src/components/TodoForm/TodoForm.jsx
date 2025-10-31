import React, { useState } from "react";
import styles from "./TodoForm.module.css";
import { addTodo } from "../../api/todoApi";

export default function TodoForm({ updateTasks }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (trimmed.length < 2) {
      alert("Задача должна быть минимум 2 символа");
      return;
    }
    if (trimmed.length > 64) {
      alert("Задача не может быть длиннее 64 символов");
      return;
    }

    try {
      await addTodo(trimmed);
      setInputValue("");
      await updateTasks();
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении задачи");
    }
  };

  return (
    <form className={styles.todoForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.todoInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Введите задачу"
      />
      <button type="submit" className={styles.todoAddBtn}>
        Добавить
      </button>
    </form>
  );
}
