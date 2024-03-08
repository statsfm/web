import Linkify from 'linkify-react';
import type { FC, PropsWithChildren } from 'react';
import type * as statsfm from '@statsfm/statsfm.js';
import { Container } from '../Container';

export const UserBanScope: FC<
  PropsWithChildren<{ user: statsfm.UserPublic }>
> = ({ children, user }) => {
  if (user.userBan?.active === true) {
    return (
      <Container className="mt-8">
        <h3>Account banned</h3>
        <p className="[&>a]:text-primary">
          The account you are viewing has been banned from the platform.
        </p>
        <p className="[&>a]:text-primary">
          You can view more info about banned accounts here{' '}
          <Linkify options={{ target: '_blank', rel: 'noopener noreferrer' }}>
            https://support.stats.fm/docs/banned
          </Linkify>
          .
        </p>
      </Container>
    );
  }

  return <>{children}</>;
};
