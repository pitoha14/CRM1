import styles from "./TodoFilter.module.css";

export default function TodoFilter({ filter, setFilter, todosCount }) {
  return (
    <div className={styles.todoFilter}>
      <button
        className={filter === "all" ? styles.active : ""}
        onClick={() => setFilter("all")}
      >
        Все ({todosCount.all})
      </button>
      <button
        className={filter === "inWork" ? styles.active : ""}
        onClick={() => setFilter("inWork")}
      >
        В работе ({todosCount.inWork})
      </button>
      <button
        className={filter === "completed" ? styles.active : ""}
        onClick={() => setFilter("completed")}
      >
        Выполнено ({todosCount.completed})
      </button>
    </div>
  );
}
