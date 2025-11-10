import styles from "./TodoFilter.module.css";
import type { Filter, TodosCount } from "../../utils/types";

type TodoFilterProps = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todosCount: TodosCount;
};

export default function TodoFilter({ filter, setFilter, todosCount }: TodoFilterProps) {
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
