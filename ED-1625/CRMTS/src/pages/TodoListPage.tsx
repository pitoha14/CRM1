import React, { useState, useEffect, useCallback } from "react";
import AddTodoForm from "../components/TodoForm/AddTodoForm";
import TodoItem from "../components/TodoItem/TodoItem";
import TodoFilter from "../components/TodoFilter/TodoFilter";
import { fetchTodos } from "../api/todoApi";
import type { Todo, Filter, TodosCount } from "../types/types";
import { message, List } from "antd";

const DEFAULT_COUNTS: TodosCount = { all: 0, inWork: 0, completed: 0 };

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [todosCount, setTodosCount] = useState<TodosCount>(DEFAULT_COUNTS);

  const updateTasks = useCallback(async () => {
    try {
      const response = await fetchTodos(filter);
      setTodos(response.data);
      setTodosCount(response.info ?? DEFAULT_COUNTS);
    } catch {
      setTodos([]);
      setTodosCount(DEFAULT_COUNTS);
      message.error("Ошибка при загрузке задач");
    }
  }, [filter]);

  useEffect(() => {
    updateTasks();
    const interval = setInterval(updateTasks, 5000);
    return () => clearInterval(interval);
  }, [updateTasks]);

  return (
    <div>
      <AddTodoForm updateTasks={updateTasks} />
      <TodoFilter filter={filter} setFilter={setFilter} todosCount={todosCount} />
      <List
        style={{ marginTop: 16 }}
        dataSource={todos}
        renderItem={(todo) => <TodoItem key={todo.id} todo={todo} updateTasks={updateTasks} />}
      />
    </div>
  );
}
