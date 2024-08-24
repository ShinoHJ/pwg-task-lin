import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'https://api-for-testing-gujp.onrender.com/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Account {
  userId: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface AccountsResponse {
  accounts: Account[];
}

interface PostData {
  title: string;
  body: string;
  tags: string[];
}

export interface PostResponse {
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

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

// Account API calls
export const registerUser = async (userData: { username: string; email: string; password: string; role: string }): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await apiClient.post('/api/account/register', userData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await apiClient.post('/api/account/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllAccounts = async (adminToken: string): Promise<AccountsResponse> => {
  try {
    const response: AxiosResponse<AccountsResponse> = await apiClient.get('/api/accounts', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


// Posts API calls
export const getAllPosts = async (adminToken: string, page: number, limit: number): Promise<PaginatedResponse<PostResponse>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<PostResponse>> = await apiClient.get('/api/posts', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPostsCount = async (adminToken: string): Promise<number> => {
  try {
    const response = await getAllPosts(adminToken, 1, 1);
    return response.totalPosts;
  } catch (error) {
    throw error;
  }
};

export const getUserPosts = async (userToken: string, page: number, limit: number): Promise<PaginatedResponse<PostResponse>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<PostResponse>> = await apiClient.post('/api/posts/mypost', { page, limit }, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPostsCount = async (userToken: string): Promise<number> => {
  try {
    const response = await getUserPosts(userToken, 1, 1);
    return response.totalPosts;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (userToken: string, postData: PostData): Promise<PostResponse> => {
  try {
    const response: AxiosResponse<PostResponse> = await apiClient.post('/api/posts/create', postData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editPost = async (userToken: string, postId: number, postData: PostData): Promise<PostResponse> => {
  try {
    const response: AxiosResponse<PostResponse> = await apiClient.put(`/api/posts/edit/${postId}`, postData, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (userToken: string, postId: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/posts/delete/${postId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const viewPost = async (userToken: string, postId: number): Promise<PostResponse> => {
  try {
    const response: AxiosResponse<PostResponse> = await apiClient.get(`/api/posts/view/${postId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
