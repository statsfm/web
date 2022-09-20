import type { FC, PropsWithChildren } from 'react';
import { Container } from '../Container';
import { SideNav } from './Nav';

// TODO: when the layouts rfc is implmented move this to a layout in /account
export const AccountLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container className="flex flex-row gap-12 pt-32">
      <SideNav />
      {children}
    </Container>
  );
};
