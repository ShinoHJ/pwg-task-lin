import { useEffect, useState } from 'react';
import { getAllPosts, getUserPosts, createPost, editPost, deletePost, viewPost } from '@/app/api/apiClient';
import { useAuth } from '@/hooks/useAuth';
import { Post, PostData, PostsContextProps } from '@/type';
import { PostResponse, PaginatedResponse } from '@/type/api';

export const usePosts = (): PostsContextProps => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { token, isAdmin } = useAuth();

  const formatToTaiwanTime = (dateString: string): string => {
    const date = new Date(dateString);
    const taiwanOffset = 24 * 60;
    const localOffset = date.getTimezoneOffset();
    const taiwanTime = new Date(date.getTime() + (taiwanOffset + localOffset) * 60000);
    return taiwanTime.toISOString().substring(0, 10);
  };

  const fetchPostsBasedOnRole = async (token: string, page: number, limit: number) => {
    if (isAdmin) {
      try {
        const response = await getAllPosts(token, page, limit);
        const convertedPosts: Post[] = response.data.map(post => ({
          ...post,
          id: typeof post.id === 'string' ? parseInt(post.id, 10) : post.id,
          date: formatToTaiwanTime(post.date)
        }));
        setPosts(convertedPosts);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    } else {
      try {
        const response: PaginatedResponse<PostResponse> = await getUserPosts(token, page, limit)
        const convertedPosts: Post[] = response.data.map(post => ({
          ...post,
          id: typeof post.id === 'string' ? parseInt(post.id, 10) : post.id,
          date: formatToTaiwanTime(post.date)
        }));
        setPosts(convertedPosts);
        setTotalPages(response.totalPages);

      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      }
    };
  }

  useEffect(() => {
    if (token) {
      fetchPostsBasedOnRole(token, 1, 10)
    }
  }, [token, isAdmin])

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

  const removePost = async (userToken: string, post: Post) => {
    try {
      await deletePost(userToken, post.id);
      setPosts(currentPosts => currentPosts.filter(p => !(p.id === post.id && p.userId === post.userId)));
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
    fetchPostsBasedOnRole,
    addPost,
    updatePost,
    removePost,
    getPost,
  };
};
