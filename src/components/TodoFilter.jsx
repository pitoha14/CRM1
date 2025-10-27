import React from "react";

export default function TodoFilter({ filter, setFilter, todos }) {
  return (
    <div className="todo-filter">
      <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
        Все ({todos.length})
      </button>
      <button className={filter === "inWork" ? "active" : ""} onClick={() => setFilter("inWork")}>
        В работе ({todos.filter((t) => !t.isDone).length})
      </button>
      <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>
        Выполнено ({todos.filter((t) => t.isDone).length})
      </button>
    </div>
  );
}