export interface Account {
  userId: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface AccountsResponse {
  accounts: Account[];
}

export interface PostData {
  title: string;
  body: string;
  tags: string[];
}

export interface PostResponse {
  date: string;
  id: number;
  title: string;
  body: string;
  tags: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalPosts: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}