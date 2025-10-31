import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm/TodoForm";
import TodoItem from "../components/TodoItem/TodoItem";
import TodoFilter from "../components/TodoFilter/TodoFilter";
import { fetchTodos } from "../api/todoApi";
import styles from "../App.module.css";

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [todosCount, setTodosCount] = useState({
    all: 0,
    inWork: 0,
    completed: 0,
  });

  const updateTasks = async (currentFilter = filter) => {
    try {
      const response = await fetchTodos(currentFilter);

      const todosArray = response.data || [];
      const info = response.info || { all: 0, inWork: 0, completed: 0 };

      setTodos(todosArray);
      setTodosCount({
        all: info.all,
        inWork: info.inWork,
        completed: info.completed,
      });
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
      setTodos([]);
      setTodosCount({ all: 0, inWork: 0, completed: 0 });
    }
  };

  useEffect(() => {
    updateTasks("all");
  }, []);

  useEffect(() => {
    updateTasks(filter);
  }, [filter]);

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appTitle}>Todo List</h1>
      <TodoForm updateTasks={() => updateTasks(filter)} />
      <TodoFilter
        filter={filter}
        setFilter={setFilter}
        todosCount={todosCount}
      />
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateTasks={() => updateTasks(filter)}
          />
        ))}
      </ul>
    </div>
  );
}
