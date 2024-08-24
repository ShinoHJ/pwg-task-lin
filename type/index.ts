import { ReactNode } from "react";

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  date: ReactNode;
}