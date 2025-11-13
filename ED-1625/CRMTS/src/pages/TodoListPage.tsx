import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm/AddTodoForm";
import TodoItem from "../components/TodoItem/TodoItem";
import TodoFilter from "../components/TodoFilter/TodoFilter";
import { fetchTodos, TodosResponse } from "../api/todoApi";
import type { Todo, Filter, TodosCount } from "../utils/types";
import { message, List } from "antd";

export default function TodoListPage() {
  const DEFAULT_COUNTS = { all: 0, inWork: 0, completed: 0 };

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [todosCount, setTodosCount] = useState<TodosCount>(DEFAULT_COUNTS);

  const updateTasks = async () => {
    try {
      const response: TodosResponse = await fetchTodos(filter);
      setTodos(response.data);
      setTodosCount(response.info);
    } catch (error) {
      console.error(error);
      setTodos([]);
      setTodosCount(DEFAULT_COUNTS);
      message.error("Ошибка при загрузке задач");
    }
  };

  useEffect(() => {
    updateTasks();
    const interval = setInterval(updateTasks, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div>
      <TodoForm updateTasks={updateTasks} />
      <TodoFilter filter={filter} setFilter={setFilter} todosCount={todosCount} />
      <List
        style={{ marginTop: 16 }}
        dataSource={todos}
        renderItem={(todo) => <TodoItem key={todo.id} todo={todo} updateTasks={updateTasks} />}
      />
    </div>
  );
}