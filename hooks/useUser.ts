import { useState } from 'react';
import { registerUser, loginUser, getAllAccounts } from '@/app/api/apiClient';

interface User {
  username: string;
  email: string;
  token?: string;
  message?: string;
  userId?: number;
  password?: string;
  role?: string;
}

interface UserProps {
  fetchAllAccounts: (adminToken: string) => Promise<number>;
  totalAccounts: number;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });

      const fetchedUser: User = {
        username: response.username,
        email: response.email,
        token: response.token,
        message: response.message,
        userId: response.userId,
      };
      setUser(fetchedUser);
      localStorage.setItem('token', fetchedUser.token || '');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, role: string) => {
    try {
      const response = await registerUser({ username, email, password, role });

      const fetchedUser: User = {
        username: response.username,
        email: response.email,
        password: response.password,
        role: response.role,
      };
      setUser(fetchedUser);
      localStorage.setItem('token', fetchedUser.token || '');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return {
    user,
    login,
    register,
    logout
  };
};
