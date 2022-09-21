import type { GiftCode } from '@/types/gift';
import dayjs from '@/utils/dayjs';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import { CouponModal } from './CouponModal';

export const Coupon: FC<{ giftcode: GiftCode }> = ({ giftcode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="max-h-max max-w-max rounded-2xl bg-bodySecundary p-5"
      onClick={() => {
        console.log('asd');
        setOpen(true);
      }}
    >
      <span
        className="w-max cursor-pointer select-none rounded-xl bg-primary/10 py-1 px-4 font-bold text-primary"
        onClick={() => navigator.clipboard.writeText(giftcode.code)}
      >
        {giftcode.code}
      </span>
      {giftcode.claimedAt ? (
        <p className="mt-3 text-center">
          Claimed {dayjs(giftcode.claimedAt).fromNow()} by{' '}
          <Link href={`/user/${giftcode.claimedBy.id}`}>
            <a className="font-bold text-white hover:opacity-70">
              {giftcode.claimedBy.displayName}
            </a>
          </Link>
        </p>
      ) : (
        <p className="mt-3 mb-0 text-center">
          Purchased {dayjs(giftcode.purchasedAt).fromNow()}
        </p>
      )}
      <CouponModal
        open={open}
        onClose={() => setOpen(false)}
        giftCode={giftcode}
      />
    </div>
  );
};
