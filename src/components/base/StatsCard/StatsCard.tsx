import { FC } from 'vue';

interface Props {
  value: string | number;
  label: string;
}

export const StatsCard: FC<Props> = ({ value, label }) => (
  <div>
    <h3 class="truncate">{value}</h3>
    <span class="m-0 text-lg line-clamp-2">{label}</span>
  </div>
);
