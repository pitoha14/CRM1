import React, { useState } from "react";
import { Form, Input, Button, message, Space } from "antd";
import { addTodo } from "../../api/todoApi";
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from "../../constants/constant";

type Props = {
  updateTasks: () => Promise<void>;
};

export default function AddTodoForm({ updateTasks }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: { title: string }) => {
    const title = values.title.trim();
    if (!title) return;

    try {
      setLoading(true);
      await addTodo(title);
      form.resetFields();
      await updateTasks();
      message.success("Задача добавлена!");
    } catch {
      message.error("Ошибка при добавлении задачи");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} style={{ marginBottom: 24 }}>
      <Form.Item
        name="title"
        rules={[
          { required: true, whitespace: true, message: "Введите задачу" },
          { min: MIN_TITLE_LENGTH },
          { max: MAX_TITLE_LENGTH },
        ]}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Input placeholder="Введите новую задачу" disabled={loading} />
          <Button type="primary" htmlType="submit" loading={loading}>
            Добавить
          </Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
}
