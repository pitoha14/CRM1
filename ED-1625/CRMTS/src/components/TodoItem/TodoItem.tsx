import { useState } from "react";
import { updateTodo, deleteTodo } from "../../api/todoApi";
import styles from './TodoItem.module.css';
import { validateTodoTitle } from "../../utils/validate";
import type { Todo } from "../../utils/types.ts";

type TodoItemProps = {
  todo: Todo;
  updateTasks: () => Promise<void>;
};

export default function TodoItem({ todo, updateTasks }: TodoItemProps) {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>(todo.title);

  const handleToggleTodoDone = async () => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await updateTasks();
    } catch (error) {
      console.error(error);
      alert("Ошибка при изменении статуса задачи");
    }
  };

  const handleDeleteTodo = async () => {
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

    if (!editingTitle || !editingTitle.trim()) {
      alert("Задача не может быть пустой");
      return;
    }

    const error = validateTodoTitle(editingTitle);
    if (error) {
      alert(error);
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
        onChange={handleToggleTodoDone}
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
            onClick={() => { setIsInEditMode(false); setEditingTitle(todo.title); }}
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
            onClick={handleDeleteTodo}
          >
            Удалить
          </button>
        </>
      )}
    </li>
  );
}
