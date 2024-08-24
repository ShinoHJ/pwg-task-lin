import { useState } from 'react';
import { getAllPosts, getUserPosts, createPost, editPost, deletePost, viewPost, PostResponse, PaginatedResponse } from '@/app/api/apiClient';

interface PostData {
  title: string;
  body: string;
  tags: string[];
}

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
}

interface PostsContextProps {
  posts: Post[];
  fetchAllPosts: (adminToken: string, page: number, limit: number) => Promise<void>;
  fetchUserPosts: (userToken: string, page: number, limit: number) => Promise<void>;
  addPost: (userToken: string, postData: PostData) => Promise<void>;
  updatePost: (userToken: string, postId: number, postData: PostData) => Promise<void>;
  removePost: (userToken: string, postId: number) => Promise<void>;
  getPost: (userToken: string, postId: number) => Promise<Post | null>;
  totalPages: number;
}

export const usePosts = (): PostsContextProps => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchAllPosts = async (adminToken: string, page: number, limit: number) => {
    try {
      const response = await getAllPosts(adminToken, page, limit);
      const convertedPosts: Post[] = response.data.map(post => ({
        ...post,
        id: typeof post.id === 'string' ? parseInt(post.id, 10) : post.id,
      }));
      setPosts(convertedPosts);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  const fetchUserPosts = async (userToken: string, page: number, limit: number) => {
    try {
      const response: PaginatedResponse<PostResponse> = await getUserPosts(userToken, page, limit);
      const convertedPosts: Post[] = response.data.map(post => ({
        ...post,
        id: typeof post.id === 'string' ? parseInt(post.id, 10) : post.id
      }));
      setPosts(convertedPosts);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    }
  };

  const addPost = async (userToken: string, postData: { title: string; body: string; tags: string[] }) => {
    try {
      await createPost(userToken, postData);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const updatePost = async (userToken: string, postId: number, postData: PostData) => {
    try {
      await editPost(userToken, postId, postData);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const removePost = async (userToken: string, postId: number) => {
    try {
      await deletePost(userToken, postId);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const getPost = async (userToken: string, postId: number): Promise<Post | null> => {
    try {
      const response = await viewPost(userToken, postId);
      return response;
    } catch (error) {
      console.error('Failed to fetch post:', error);
      return null;
    }
  };

  return {
    posts,
    totalPages,
    fetchAllPosts,
    fetchUserPosts,
    addPost,
    updatePost,
    removePost,
    getPost,
  };
};
