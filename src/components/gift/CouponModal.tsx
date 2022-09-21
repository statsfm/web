import { useApi } from '@/hooks';
import type { GiftCode } from '@/types/gift';
import { Dialog } from '@headlessui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { Overlay } from '../Overlay';
import { Textarea } from '../Textarea';

export const CouponModal: FC<{
  giftCode: GiftCode;
  open: boolean;
  onClose: () => void;
}> = ({ giftCode, open, onClose }) => {
  const api = useApi();
  const [message, setMessage] = useState(giftCode.message);
  const [saving, setSaving] = useState(false);

  const formatCode = (code: string) => {
    return code.match(/.{1,4}/g)!.join('-');
  };

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(
      `${window.location.origin}/redeem/${giftCode.code}`
    );
  }, [giftCode]);

  const save = useCallback(async () => {
    setSaving(true);
    const { success } = await api.http.put(
      `/me/plus/giftcodes/${giftCode.id}`,
      {
        body: JSON.stringify({
          message,
        }),
      }
    );
    setSaving(false);

    // TODO: replace with toaster
    if (!success) {
      // eslint-disable-next-line no-alert
      alert('something went wrong trying to save!');
      return;
    }

    onClose();
  }, [message]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Overlay visible={open} className="fixed top-0 z-20" />
      <Dialog.Panel className="z-20 max-h-max cursor-default rounded-2xl bg-bodySecundary p-5 shadow-xl">
        <Dialog.Title as="h1">
          Coupon <span className="text-neutral-400">#{giftCode.id}</span>
        </Dialog.Title>
        <div className="mt-2 flex w-[90vw] flex-col gap-2 md:w-[60vw]">
          <div className="flex justify-between gap-5">
            <span>Purchased On</span>
            <span className="text-white">
              {dayjs(giftCode.purchasedAt).format('L')}
            </span>
          </div>
          <div className="flex justify-between gap-5">
            <span>Bought by</span>
            <Link href={`/user/${giftCode.boughtBy.id}`}>
              <a className="font-bold text-primary">
                {giftCode.boughtBy.displayName}
              </a>
            </Link>
          </div>
          <div className="flex justify-between gap-5">
            <span>Claimed by</span>
            {giftCode.claimedBy ? (
              <Link href={`/user/${giftCode.claimedBy.id}`}>
                <a className="font-bold text-primary">
                  {giftCode.claimedBy.displayName}
                </a>
              </Link>
            ) : (
              <span className="text-white">-</span>
            )}
          </div>
          <div className="flex justify-between gap-5">
            <span>Claimed on</span>
            <span className="text-white">
              {giftCode.claimedAt ? dayjs(giftCode.claimedAt).format('L') : '-'}
            </span>
          </div>
          <div className="flex justify-between gap-5">
            <span>Redeem code</span>
            <span className="text-white">{formatCode(giftCode.code)}</span>
          </div>
        </div>
        {!giftCode.claimedBy && (
          <div className="pt-4">
            <Textarea
              name="about"
              label="Edit Message"
              placeholder="Enter message"
              className="!bg-background !p-2"
              maxLength={512}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        )}
        {giftCode.claimedBy ? (
          <>
            <Divider className="my-4 border-neutral-600" />
            <Button className=" w-full" onClick={onClose}>
              Close
            </Button>
          </>
        ) : (
          <>
            <Button onClick={save} className="mt-3 w-full">
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Divider className="my-4 border-neutral-600" />
            <Button onClick={copyLink} className="w-full">
              Copy Link
            </Button>
          </>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};
