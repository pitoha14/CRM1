import { Menu } from "antd";
import type { Filter, TodosCount } from "../../utils/types";

type TodoFilterProps = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  todosCount: TodosCount;
};

export default function TodoFilter({ filter, setFilter, todosCount }: TodoFilterProps) {
  const items = [
    { key: "all", label: `Все (${todosCount.all})` },
    { key: "inWork", label: `В работе (${todosCount.inWork})` },
    { key: "completed", label: `Выполнено (${todosCount.completed})` },
  ];

  return <Menu mode="horizontal" selectedKeys={[filter]} items={items} onClick={(e) => setFilter(e.key as Filter)} />;
}