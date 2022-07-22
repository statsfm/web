interface Props {
  value: string | number;
  label: string;
}

export const StatsCard = ({ value, label }: Props) => (
  <>
    <h3 className="truncate">{value}</h3>
    <span className="m-0 text-lg line-clamp-2">{label}</span>
  </>
);
