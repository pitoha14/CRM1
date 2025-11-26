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

export interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
}

export interface AuthData {
  login: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  roles?: string[];
}