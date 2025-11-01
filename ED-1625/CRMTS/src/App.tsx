import React from "react";
import TodoListPage from "./pages/TodoListPage";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <TodoListPage />
    </div>
  );
};

export default App;