import exp from "constants";
import { ReactNode } from "react";

export interface Post {
  id: number;
  userId?: number;
  title: string;
  body: string;
  tags: string[];
  date: string;
}

export interface PostData {
  title: string;
  body: string;
  tags: string[];
}

export interface PostsContextProps {
  posts: Post[];
  addPost: (userToken: string, postData: PostData) => Promise<void>;
  updatePost: (userToken: string, postId: number, postData: PostData) => Promise<void>;
  removePost: (userToken: string, post: Post) => Promise<void>;
  getPost: (userToken: string, postId: number) => Promise<Post | null>;
  totalPages: number;
  fetchPostsBasedOnRole: (token: string, page: number, limit: number) => Promise<void>;
}

type ModalMode = 'add' | 'edit';
export interface ModalState {
  mode: ModalMode;
  showModal: boolean;
  editingPost: Post | null | '';
}

export interface DelModalState {
  showModal: boolean;
  postId: number;
}

export interface PostProps {
  post: Post;
}

export interface DashboardProps {
  adminToken: string;
  userToken: string;
}

export interface DeleteModalProps {
  post: Post | null;
  isVisible: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PostModalProps {
  mode: 'add' | 'edit';
  post?: Post | null | '';
  onSave: (post: { title: string; body: string; tags: string[] }) => void;
  onClose: () => void;
  isVisible: boolean;
}

export interface ToolbarProps {
  showAddPostButton?: boolean
  showGoBackButton?: boolean
  onAdd?: () => void;
}

export interface DecodedToken {
  userId: string;
  username: string;
  role: 'admin' | 'user';
  exp: number;
}

export interface Statistics {
  totalAccounts: number;
  totalPosts: number;
  userPosts: number;
}

export interface User {
  username: string;
  email: string;
  token?: string;
  message?: string;
  userId?: number;
  password?: string;
  role?: string;
}

export interface UserProps {
  fetchAllAccounts: (adminToken: string) => Promise<number>;
  totalAccounts: number;
}

export interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface DecodedToken {
  userId: string;
  username: string;
  role: 'admin' | 'user';
  exp: number;
}

export interface ModalInstance {
  show: () => void;
  hide: () => void;
}