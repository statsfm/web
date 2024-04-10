import type { GiftCode } from '@/utils/statsfm';
import dayjs from '@/utils/dayjs';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import { CouponModal } from './CouponModal';

export const Coupon: FC<{ giftcode: GiftCode }> = ({ giftcode }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="max-h-max max-w-max rounded-2xl bg-foreground p-5 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span
          className="w-max cursor-pointer select-none rounded-xl bg-primary/10 px-4 py-1 font-bold text-primary"
          onClick={() => navigator.clipboard.writeText(giftcode.code)}
        >
          {giftcode.code}
        </span>
        {giftcode.claimedAt ? (
          <p className="mt-3 text-center">
            Claimed {dayjs(giftcode.claimedAt).fromNow()} by{' '}
            <Link
              legacyBehavior
              href={`/user/${
                giftcode.claimedBy
                  ? giftcode.claimedBy.id
                  : giftcode.claimedById
              }`}
            >
              <a className="font-bold text-white hover:opacity-70">
                {giftcode.claimedBy
                  ? giftcode.claimedBy.displayName
                  : giftcode.claimedById}
              </a>
            </Link>
          </p>
        ) : (
          <p className="mb-0 mt-3 text-center">
            Purchased {dayjs(giftcode.purchasedAt).fromNow()}
          </p>
        )}
      </div>

      {/* TODO: move this modal to a more central place bc this is not optimal for performance */}
      <CouponModal
        open={open}
        onClose={() => {
          setOpen(false);
          console.log('close: ', open);
        }}
        giftCode={giftcode}
      />
    </>
  );
};
