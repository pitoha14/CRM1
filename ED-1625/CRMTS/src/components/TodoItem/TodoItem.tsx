import { useState } from "react";
import { updateTodo, deleteTodo } from "../../api/todoApi";
import styles from './TodoItem.module.css';
import { validateTodoTitle } from "../../utils/validate";

type Todo = {
  id: number;
  title: string;
  created?: string;
  isDone?: boolean;
};

type TodoItemProps = {
  todo: Todo;
  updateTasks: () => Promise<void>;
};

export default function TodoItem({ todo, updateTasks }: TodoItemProps) {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const handleToggleDone = async () => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await updateTasks();
    } catch (error) {
      console.error(error);
      alert("Ошибка при изменении статуса задачи");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      await updateTasks();
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении задачи");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validateTodoTitle(editingTitle);
  if (!result.valid) {
    alert(result.error);
    return;
  }

  try {
    await updateTodo(todo.id, { title: editingTitle.trim() });
    setIsInEditMode(false);
    await updateTasks();
  } catch (error) {
    console.error(error);
    alert("Ошибка при обновлении задачи");
  }
};

  return (
    <li className={styles.todoItem}>
      <input
        type="checkbox"
        checked={!!todo.isDone}
        onChange={handleToggleDone}
      />

      {isInEditMode ? (
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <input
            type="text"
            className={styles.todoItemInput}
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
          />
          <button type="submit" className={styles.saveBtn}>Сохранить</button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setIsInEditMode(false)}
          >
            Отменить
          </button>
        </form>
      ) : (
        <>
          <span className={todo.isDone ? styles.done : ""}>{todo.title}</span>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => setIsInEditMode(true)}
          >
            Редактировать
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            Удалить
          </button>
        </>
      )}
    </li>
  );
}