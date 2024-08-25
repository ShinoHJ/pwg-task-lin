import React, { memo } from 'react';
import { StatisticItemProps } from '@/type'

const StatisticItem: React.FC<StatisticItemProps> = memo(({ title, value, className }) => (
  <div className={`col-4 mb-4`}>
    <div className={`infoArea ${className}`}>
      <h3 className='infoTitle text-center'>{title}</h3>
      <p className='infoContent text-center mb-0'>{value}</p>
    </div>
  </div>
));

export default StatisticItem;