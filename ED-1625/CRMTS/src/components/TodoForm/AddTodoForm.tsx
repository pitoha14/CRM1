import React from "react";
import { Form, Input, Button, message } from "antd";
import { addTodo } from "../../api/todoApi";
import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH } from "../../constants/constant";

type Props = {
  updateTasks: () => Promise<void>;
};

export default function AddTodoForm({ updateTasks }: Props) {
  const [form] = Form.useForm();

  const onFinish = async (values: { title: string }) => {
    const title = values.title.trim();
    try {
      await addTodo(title);
      form.resetFields();
      await updateTasks();
      message.success("Задача добавлена");
    } catch {
      message.error("Ошибка при добавлении задачи");
    }
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      style={{ marginBottom: 16, width: "100%" }}
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
        <Input placeholder="Введите задачу" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Добавить
        </Button>
      </Form.Item>
    </Form>
  );
}