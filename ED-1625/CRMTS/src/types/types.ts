export type Filter = "all" | "inWork" | "completed";

export type Todo = {
  id: number;
  title: string;
  created?: string;
  isDone?: boolean;
};

export type TodosCount = {
  all: number;
  inWork: number;
  completed: number;
};

export type ApiResponse<T> = {
  data: T;
  info?: TodosCount;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};