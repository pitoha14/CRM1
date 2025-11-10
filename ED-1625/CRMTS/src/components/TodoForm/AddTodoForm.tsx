import React, { useState } from "react";
import styles from "./AddTodoForm.module.css";
import { addTodo } from "../../api/todoApi";
import { validateTodoTitle } from "../../utils/validate";

type AddTodoFormProps = {
  updateTasks: () => Promise<void>;
};

export default function AddTodo({ updateTasks }: AddTodoFormProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim()
    const error = validateTodoTitle(trimmedValue);
    if (error) {
      alert(error);
      return;
    }

    try {
      await addTodo(trimmedValue);
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
        onChange={e => setInputValue(e.target.value)}
        placeholder="Введите задачу"
      />
      <button type="submit" className={styles.todoAddBtn}>Добавить</button>
    </form>
  );
}