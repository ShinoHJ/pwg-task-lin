import React, { useCallback, useEffect, useState } from 'react';
import { useStatistics } from '@/hooks/useStatistics';
import { useAuth } from '@/hooks/useAuth'
import {DashboardProps} from '@/type'
import StatisticItem from '@/components/StatisticItem';

const Dashboard: React.FC<DashboardProps> = ({ adminToken, userToken, shouldUpdate, onUpdateComplete }) => {
  const { statistics, loading, error, refreshStatistics } = useStatistics(adminToken, userToken);
  const { isAdmin } = useAuth()

  const handleRefresh = useCallback(() => {
    refreshStatistics();
    onUpdateComplete();
  }, [refreshStatistics, onUpdateComplete]);
  
  useEffect(() => {
    refreshStatistics();
  }, [refreshStatistics]);

  useEffect(() => {
    if (shouldUpdate) {
      handleRefresh();
    }
  }, [shouldUpdate, handleRefresh]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {
        !isAdmin? null : (
          <>
            <div className="row w-100" >
              <div className="col-4 mb-4">
                <div className='infoArea bg-yellow02'>
                  <h3 className='infoTitle text-center'>Total <br className='d-md-none'/>Account</h3>
                  <p className='infoContent text-center mb-0'>{statistics.totalAccounts}</p>
                </div>
              </div>
              <div className="col-4 mb-4">
                <div className='infoArea bg-red02'>
                  <h3 className='infoTitle text-center'>Total <br className='d-md-none'/>Post</h3>
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

