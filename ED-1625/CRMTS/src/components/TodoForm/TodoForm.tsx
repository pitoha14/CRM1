import React, { useState } from "react";
import styles from "./TodoForm.module.css";
import { addTodo } from "../../api/todoApi";
import { validateTodoTitle } from "../../utils/validate";

type TodoFormProps = {
  updateTasks: () => Promise<void>;
};

export default function TodoForm({ updateTasks }: TodoFormProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validateTodoTitle(inputValue);
  if (!result.valid) {
    alert(result.error);
    return;
  }

  try {
    await addTodo(inputValue.trim());
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
      <button type="submit" className={styles.todoAddBtn}>
        Добавить
      </button>
    </form>
  );
}