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


export type Roles = "ADMIN" | "MODERATOR" | "USER";

export interface Profile {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  roles?: Roles[];
}

export interface UserTableItem extends Profile {
  date: string; 
  isBlocked: boolean;
  roles: Roles[];
}

export interface UserFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isBlocked?: boolean;
  limit?: number;
  page?: number;
}

export interface UsersMeta {
  totalAmount: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface UsersListResponse {
  data: UserTableItem[];
  meta: UsersMeta;
}

export interface UserRolesRequest {
  roles: Roles[];
}

export interface UserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}