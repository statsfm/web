import { StatsCard } from '@/components/StatsCard';
import { type FC } from 'react';

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
    <ul className="flex flex-row flex-wrap gap-6 lg:flex-nowrap">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </ul>
  );
};
