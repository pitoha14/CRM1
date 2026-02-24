import { FC, useState } from "react";
import { Input, Checkbox, Button, Space } from "antd";
import type { Todo } from "../../types/types";

interface Props {
  todo: Todo;
  updateTasks: () => void;
}

const TodoItem: FC<Props> = ({ todo, updateTasks }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>(todo.title);

  return (
    <Space>
      <Checkbox checked={todo.isDone} />
      {isEditing ? (
        <Input
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
        />
      ) : (
        <span>{todo.title}</span>
      )}
      <Button onClick={() => setIsEditing((prev) => !prev)}> 
        {isEditing ? "Сохранить" : "Редактировать"}
      </Button>
    </Space>
  );
};

export default TodoItem;