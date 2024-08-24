import { useState, useEffect, useCallback } from 'react';
import { getAllAccounts, getAllPostsCount, getUserPostsCount } from '@/app/api/apiClient';

interface Statistics {
  totalAccounts: number;
  totalPosts: number;
  userPosts: number;
}

export const useStatistics = (token: string) => {
  const [statistics, setStatistics] = useState<Statistics>({
    totalAccounts: 0,
    totalPosts: 0,
    userPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      
      const [accountsResponse, totalPosts, userPosts] = await Promise.all([
        getAllAccounts(token),
        getAllPostsCount(token),
        getUserPostsCount(token)
      ]);

      setStatistics({
        totalAccounts: accountsResponse.accounts.length,
        totalPosts,
        userPosts
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch statistics');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { statistics, loading, error, refreshStatistics: fetchStatistics };
};