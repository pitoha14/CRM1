import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import type { Todo } from "../../types/types";
import { updateTodo, deleteTodo } from "../../api/todoApi";
import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH } from "../../constants/constant";

type Props = {
  todo: Todo;
  updateTasks: () => Promise<void>;
};

export default function TodoItem({ todo, updateTasks }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleIsDone = async () => {
    try {
      await updateTodo(todo.id, { isDone: !todo.isDone });
      await updateTasks();
    } catch {
      message.error("Ошибка при изменении статуса задачи");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
      await updateTasks();
      message.success("Задача удалена");
    } catch {
      message.error("Ошибка при удалении задачи");
    }
  };

  const handleEditFinish = async (values: { title: string }) => {
    const title = values.title.trim();
    try {
      setLoading(true);
      await updateTodo(todo.id, { title });
      setIsEditing(false);
      await updateTasks();
      message.success("Задача обновлена");
    } catch {
      message.error("Ошибка при обновлении задачи");
    } finally {
      setLoading(false);
    }
  };

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
        gap: 8,
      }}
    >
      <Checkbox checked={!!todo.isDone} onChange={handleToggleIsDone} style={{ flexShrink: 0 }}>
        {!isEditing && (
          <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>{todo.title}</span>
        )}
      </Checkbox>

      {isEditing ? (
        <Form
          onFinish={handleEditFinish}
          initialValues={{ title: todo.title }}
          style={{ display: "flex", gap: 8, flexGrow: 1, marginLeft: 8 }}
        >
          <Form.Item
            name="title"
            rules={[
              { required: true, message: "Введите задачу" },
              { min: MIN_TITLE_LENGTH, message: `Минимум ${MIN_TITLE_LENGTH} символа` },
              { max: MAX_TITLE_LENGTH, message: `Максимум ${MAX_TITLE_LENGTH} символов` },
            ]}
            style={{ flexGrow: 1, minWidth: 0 }}
          >
            <Input disabled={loading} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить
          </Button>
          <Button
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Отменить
          </Button>
        </Form>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="link" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
          <Button type="link" danger onClick={handleDelete}>
            Удалить
          </Button>
        </div>
      )}
    </li>
  );
}