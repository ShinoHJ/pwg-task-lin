import React, { useEffect, useState } from 'react';
import { useStatistics } from '@/hooks/useStatistics';
import { useAuth } from '@/hooks/useAuth'

interface DashboardProps {
  adminToken: string;
  userToken: string;
}

const Dashboard: React.FC<DashboardProps> = ({ adminToken, userToken }) => {
  const { statistics, loading, error, refreshStatistics } = useStatistics(adminToken, userToken);
  const { isAdmin } = useAuth()

  useEffect(() => {
    refreshStatistics();
  }, [refreshStatistics]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {
        !isAdmin? null : (
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
                  <h3 className='infoTitle text-center'>My <br className='d-md-none'/>Post</h3>
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

