import type { PropsWithChildren } from 'react';

export const NotEnoughData = ({
  data,
  loading = false,
  children,
}: PropsWithChildren<{ data: any[]; loading?: boolean }>) => {
  if (data && data.length === 0 && !loading) {
    return (
      <div className="grid w-full place-items-center">
        <p className="m-0 text-text-grey">
          Not enough data to complete this list
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
