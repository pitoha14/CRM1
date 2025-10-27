import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import TodoFilter from "../components/TodoFilter";
import { fetchTodos } from "../api/todoApi";

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const updateTasks = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateTasks();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "inWork") return !todo.isDone;
    if (filter === "completed") return todo.isDone;
  });

  return (
    <div className="app-container">
      <h1 className="app-title">Todo List</h1>
      <TodoForm updateTasks={updateTasks} />
      <TodoFilter filter={filter} setFilter={setFilter} todos={todos} />
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} updateTasks={updateTasks} />
        ))}
      </ul>
    </div>
  );
}