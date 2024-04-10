import { useApi, useToaster } from '@/hooks';
import type { GiftCode } from '@/utils/statsfm';
import { Dialog, Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FC, Fragment } from 'react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Overlay } from '@/components/Overlay';
import { Textarea } from '@/components/Textarea';

export const CouponModal: FC<{
  giftCode: GiftCode;
  open: boolean;
  onClose: () => void;
}> = ({ giftCode, open, onClose }) => {
  const toaster = useToaster();
  const api = useApi();
  const [message, setMessage] = useState(giftCode.message);
  const [saving, setSaving] = useState(false);

  const formatCode = (code: string) => {
    return code.match(/.{1,4}/g)!.join('-');
  };

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(
      `${window.location.origin}/redeem/${giftCode.code}`,
    );
  }, [giftCode]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      await api.me.updateGiftCode(giftCode.id, message);
      setSaving(false);
    } catch (e: any) {
      toaster.error('Something went wrong trying to save!');
      return;
    }

    onClose();
  }, [message]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="z-40 max-h-max cursor-default rounded-2xl bg-foreground p-5 shadow-xl w-full max-w-md transform overflow-hidden text-left align-middle transition-all">
                <Dialog.Title as="h1">
                  Coupon{' '}
                  <span className="text-neutral-400">#{giftCode.id}</span>
                </Dialog.Title>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex justify-between gap-5">
                    <span>Purchased On</span>
                    <span className="text-white">
                      {dayjs(giftCode.purchasedAt).format('L')}
                    </span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span>Bought by</span>
                    <Link legacyBehavior href={`/user/${giftCode.boughtBy.id}`}>
                      <a className="font-bold text-primary">
                        {giftCode.boughtBy.displayName}
                      </a>
                    </Link>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span>Claimed by</span>
                    {giftCode.claimedBy ? (
                      <Link
                        legacyBehavior
                        href={`/user/${giftCode.claimedBy.id}`}
                      >
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
                      {giftCode.claimedAt
                        ? dayjs(giftCode.claimedAt).format('L')
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span>Redeem code</span>
                    <span className="text-white">
                      {formatCode(giftCode.code)}
                    </span>
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
                      value={message ?? ''}
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
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
