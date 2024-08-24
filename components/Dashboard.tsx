import React, { useEffect, useState } from 'react';
import { useStatistics } from '@/hooks/useStatistics';
import { useAuth } from '@/hooks/useAuth'

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const { statistics, loading, refreshStatistics } = useStatistics(token);
  const { isAdmin } = useAuth()

  useEffect(() => {
    if (!isAdmin) {
      return
    } else {
      refreshStatistics();
    }
  }, [refreshStatistics]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {
        !isAdmin ? null : (
          <>
            <div className="row w-100" >
              <div className="col-4 mb-4">
                <div className='infoArea bg-yellow02'>
                  <h3 className='infoTitle text-center'>Total Account</h3>
                  <p className='infoContent text-center mb-0'>{statistics.totalAccounts}</p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className='infoArea bg-red02'>
                  <h3 className='infoTitle text-center'>Total Post</h3>
                  <p className='infoContent text-center mb-0'>{statistics.totalPosts}</p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className='infoArea bg-green03'>
                  <h3 className='infoTitle text-center'>My Post</h3>
                  <p className='infoContent text-center mb-0'>{statistics.userPosts}</p>
                </div>
              </div>
            </div >
          </>
        )
      }
    </>
  );
};

export default Dashboard;

