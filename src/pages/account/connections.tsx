import { AccountLayout } from '@/components/account/Layout';
import { Section } from '@/components/Section';
import type { NextPage } from 'next';

const ConnectionsList = () => {
  return (
    <Section title="Connections">
      <div></div>
    </Section>
  );
};

const Connections: NextPage = () => {
  return (
    <AccountLayout>
      <ConnectionsList />
    </AccountLayout>
  );
};

export default Connections;
