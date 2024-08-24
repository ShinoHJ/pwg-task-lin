import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '@/type'

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setToken(token)
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  return { user, token, loading, isAdmin: user?.role === 'admin' };
};