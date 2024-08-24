import { useState, useEffect, useCallback } from 'react';
import { getAllAccounts, getAllPostsCount, getUserPostsCount } from '@/app/api/apiClient';
import { Statistics } from '@/type'

export const useStatistics = (adminToken: string, userToken: string) => {
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
        getAllAccounts(adminToken),
        getAllPostsCount(adminToken),
        getUserPostsCount(userToken)
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
  }, [adminToken, userToken]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { statistics, loading, error, refreshStatistics: fetchStatistics };
};