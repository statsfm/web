import type { FC, PropsWithChildren } from 'react';
import { DropDownNav } from './Nav';

export const SettingsHeader: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <header className="sticky top-0 z-30 flex flex-row items-center bg-background py-4">
      <DropDownNav />
      <h1 className="ml-4 text-2xl sm:text-4xl">{title}</h1>
      <div className="ml-auto flex gap-2">{children}</div>
    </header>
  );
};
