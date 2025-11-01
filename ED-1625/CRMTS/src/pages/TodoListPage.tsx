import { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm/TodoForm";
import TodoItem from "../components/TodoItem/TodoItem";
import TodoFilter from "../components/TodoFilter/TodoFilter";
import { fetchTodos, Todo } from "../api/todoApi";
import styles from "../App.module.css";

type Filter = "all" | "inWork" | "completed";

type TodosCount = {
  all: number;
  inWork: number;
  completed: number;
};

export default function TodoListPage() {
  const [allTodos, setAllTodos] = useState<Todo[]>([]); 
  const [todos, setTodos] = useState<Todo[]>([]); 
  const [filter, setFilter] = useState<Filter>("all");
  const [todosCount, setTodosCount] = useState<TodosCount>({
    all: 0,
    inWork: 0,
    completed: 0,
  });

  const updateTasks = async () => {
    try {
      const fetchedTodos = await fetchTodos("all"); 
      setAllTodos(fetchedTodos);

      const info: TodosCount = {
        all: fetchedTodos.length,
        inWork: fetchedTodos.filter(todo => !todo.isDone).length,
        completed: fetchedTodos.filter(todo => todo.isDone).length,
      };
      setTodosCount(info);

      applyFilter(fetchedTodos, filter);
    } catch (error) {
      console.error("Ошибка при загрузке задач:", error);
      setAllTodos([]);
      setTodos([]);
      setTodosCount({ all: 0, inWork: 0, completed: 0 });
    }
  };

  const applyFilter = (todosArray: Todo[], currentFilter: Filter) => {
    let filteredTodos: Todo[];
    switch (currentFilter) {
      case "inWork":
        filteredTodos = todosArray.filter(todo => !todo.isDone);
        break;
      case "completed":
        filteredTodos = todosArray.filter(todo => todo.isDone);
        break;
      default:
        filteredTodos = todosArray;
    }
    setTodos(filteredTodos);
  };

  useEffect(() => {
    updateTasks();
  }, []);

  useEffect(() => {
    applyFilter(allTodos, filter);
  }, [filter, allTodos]);

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appTitle}>Todo List</h1>
      <TodoForm updateTasks={updateTasks} />
      <TodoFilter
        filter={filter}
        setFilter={setFilter}
        todosCount={todosCount}
      />
      <ul className={styles.todoList}>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} updateTasks={updateTasks} />
        ))}
      </ul>
    </div>
  );
}