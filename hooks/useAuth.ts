import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  username: string;
  role: 'admin' | 'user';
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setToken(storedToken)
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