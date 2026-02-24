import React, { useState, useEffect, useCallback } from "react";
import AddTodoForm from "../components/TodoForm/AddTodoForm";
import TodoItem from "../components/TodoItem/TodoItem";
import TodoFilter from "../components/TodoFilter/TodoFilter";
import { fetchTodos } from "../api/todoApi";
import type { Todo, Filter, TodosCount } from "../types/types";
import { message, List, Empty, Spin, Space } from "antd";

const DEFAULT_COUNTS: TodosCount = { all: 0, inWork: 0, completed: 0 };

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [todosCount, setTodosCount] = useState<TodosCount>(DEFAULT_COUNTS);
  const [isLoading, setIsLoading] = useState(false);

  const updateTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchTodos(filter);
      setTodos(response.data);
      setTodosCount(response.info ?? DEFAULT_COUNTS);
    } catch {
      setTodos([]);
      setTodosCount(DEFAULT_COUNTS);
      message.error("Ошибка при загрузке задач");
    } finally {
      setIsLoading(false);
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
      <TodoFilter
        filter={filter}
        setFilter={setFilter}
        todosCount={todosCount}
      />
      {isLoading ? (
        <Spin tip="Загрузка задач...">
          <div style={{ minHeight: 120 }} />
        </Spin>
      ) : todos.length === 0 && filter === "all" ? (
        <Empty
          description="У вас пока нет задач. Добавьте первую задачу выше!"
          style={{ marginTop: 50 }}
        />
      ) : todos.length === 0 ? (
        <Empty
          description="Нет задач, соответствующих выбранному фильтру."
          style={{ marginTop: 50 }}
        />
      ) : (
        <List
          style={{ marginTop: 16 }}
          dataSource={todos}
          renderItem={(todo) => (
            <TodoItem key={todo.id} todo={todo} updateTasks={updateTasks} />
          )}
        />
      )}
    </div>
  );
}
