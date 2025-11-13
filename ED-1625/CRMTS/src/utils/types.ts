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