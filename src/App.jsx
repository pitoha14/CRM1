import React from "react";
import TodoListPage from "./pages/TodoListPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.appContainer}>
      <TodoListPage />
    </div>
  );
}