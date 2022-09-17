import type { FC, PropsWithChildren } from 'react';
import { Container } from '../Container';
import { SideNav } from './SideNav';

// TODO: when the layouts rfc is implmented move this to a layout in /account
export const AccountLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container className="flex flex-row gap-12 pt-32">
      <nav className="sticky top-0 h-min shrink-0 py-4 md:w-48">
        <h3 className="mb-2">Account</h3>
        <SideNav />
      </nav>
      {children}
    </Container>
  );
};
