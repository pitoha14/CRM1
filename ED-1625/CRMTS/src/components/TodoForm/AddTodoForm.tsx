import React, { useState } from "react";
import { addTodo } from "../../api/todoApi";
import { Input, Button, message, Form } from "antd";
import '@ant-design/v5-patch-for-react-19';

type AddTodoFormProps = {
  updateTasks: () => Promise<void>;
};

export default function AddTodoForm({ updateTasks }: AddTodoFormProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 2) {
      message.error("Задача должна быть минимум 2 символа");
      return;
    }
    if (trimmed.length > 64) {
      message.error("Задача не может быть длиннее 64 символов");
      return;
    }

    try {
      setLoading(true);
      await addTodo(trimmed);
      setInputValue("");
      await updateTasks();
      message.success("Задача добавлена");
    } catch {
      message.error("Ошибка при добавлении задачи");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="inline" onFinish={handleSubmit} style={{ marginBottom: 16 }}>
      <Form.Item style={{ flexGrow: 1 }}>
        <Input
          placeholder="Введите задачу"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Добавить</Button>
      </Form.Item>
    </Form>
  );
}