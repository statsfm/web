import { useAuth } from '@/hooks';
import { useRouter } from 'next/router';
import type { ElementType, FC, PropsWithChildren } from 'react';
import { Skeleton } from '../Skeleton';

interface Props {
  label: string;
  value?: string | number;
  as?: ElementType;
  loginRequired?: boolean;
  loading?: boolean;
}

export const StatsCard = ({
  value,
  label,
  as: Component = 'li',
  loginRequired,
  loading,
}: Props) => {
  const { user, login } = useAuth();
  const router = useRouter();

  const Card: FC<PropsWithChildren<{}>> = (props) => (
    <Component>
      {props.children}
      <span className="m-0 text-lg line-clamp-2">{label}</span>
    </Component>
  );

  if (loginRequired && !user)
    return (
      <Card>
        <h3
          className="h-9 cursor-pointer truncate text-xl leading-8 hover:underline"
          onClick={() => login(router.asPath)}
        >
          Login to see
        </h3>
      </Card>
    );

  if (loading)
    return (
      <Card>
        <div className="flex h-9 items-center">
          <Skeleton.Text width="50%" height="28px" />
        </div>
      </Card>
    );

  return (
    <Card>
      <h3 className="truncate capitalize">{value}</h3>
    </Card>
  );
};
