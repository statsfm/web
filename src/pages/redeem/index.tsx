import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import { useToaster } from '@/hooks';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

const RedeemPage: NextPage = () => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const toaster = useToaster();

  const setCoupongCallback = (value: string) => {
    const cleanCode = value.replaceAll('-', '');
    const trimmed = cleanCode.slice(0, 12);
    // TODO: this is garbage, rewrite it
    if (trimmed.length > 8) {
      setCouponCode(
        `${trimmed.slice(0, 4)}-${trimmed.slice(4, 8)}-${trimmed.slice(8)}`
      );
    } else if (trimmed.length > 4) {
      setCouponCode(`${trimmed.slice(0, 4)}-${trimmed.slice(4, 8)}`);
    } else {
      setCouponCode(`${trimmed.slice(0, 4)}`);
    }
  };

  const continueRedeem = useCallback(() => {
    const cleanCode = couponCode.replaceAll('-', '');

    if (cleanCode.length === 12) router.push(`/redeem/${cleanCode}`);
    else toaster.error('Invalid coupon code');
  }, [couponCode]);

  return (
    <Container className="pt-20">
      <Title>Redeem</Title>
      <h1>Redeem a Plus coupon</h1>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCoupongCallback(e.target.value)}
        placeholder="XXXX-XXXX-XXXX"
        className="my-5 w-full rounded-2xl bg-foreground p-4 text-lg font-bold uppercase tracking-[0.15em]"
      />
      <Button onClick={continueRedeem}>continue</Button>
    </Container>
  );
};

export default RedeemPage;
