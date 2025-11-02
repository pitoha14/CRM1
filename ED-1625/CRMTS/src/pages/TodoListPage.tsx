import { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm/TodoForm";
import TodoItem from "../components/TodoItem/TodoItem";
import TodoFilter from "../components/TodoFilter/TodoFilter";
import { fetchTodos, Todo, TodosResponse } from "../api/todoApi";
import styles from "../App.module.css";

type Filter = "all" | "inWork" | "completed";

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [todosCount, setTodosCount] = useState({
    all: 0,
    inWork: 0,
    completed: 0,
  });

  const updateTasks = async () => {
    try {
      const response: TodosResponse = await fetchTodos(filter);
      setTodos(response.data);
      setTodosCount(response.info);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
      setTodos([]);
      setTodosCount({ all: 0, inWork: 0, completed: 0 });
    }
  };

  useEffect(() => {
    updateTasks();
  }, []);

  useEffect(() => {
    updateTasks();
  }, [filter]);

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appTitle}>Todo List</h1>
      <TodoForm updateTasks={updateTasks} />
      <TodoFilter filter={filter} setFilter={setFilter} todosCount={todosCount} />
      <ul className={styles.todoList}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} updateTasks={updateTasks} />
        ))}
      </ul>
    </div>
  );
}