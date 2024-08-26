import { useState } from 'react';
import { registerUser, loginUser } from '@/app/api/apiClient';
import { User, UserProps } from '@/type'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // const login = async (email: string, password: string) => {
  //   try {
  //     const response = await loginUser({ email, password });

  //     const fetchedUser: User = {
  //       username: response.username,
  //       email: response.email,
  //       token: response.token,
  //       message: response.message,
  //       userId: response.userId,
  //     };
  //     setUser(fetchedUser);
  //     localStorage.setItem('token', fetchedUser.token || '');
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     throw error;
  //   }
  // };

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
    } catch (error: any) {
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
        message: response.message
      };
      setUser(fetchedUser);
      localStorage.setItem('token', fetchedUser.token || '');
    } catch (error: any) {
      throw error;
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
