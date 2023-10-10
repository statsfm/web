import { StatsCard } from '@/components/StatsCard';
import React, { FC } from 'react';


type StatsCardProps = {
    value: string | number;
    label: string;
    loading?: boolean;
    loginRequired?: boolean;
  };
  
  type StatsCardContainerProps = {
    stats: StatsCardProps[];
  };
  
  export const StatsCardContainer: FC<StatsCardContainerProps> = ({ stats }) => {
    return (
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </ul>
    );
  };
  