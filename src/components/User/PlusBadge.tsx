import Link from 'next/link';
import { CrownIcon } from '../Icons';

export const PlusBadge = () => (
  <Link href="/plus">
    <span className="mx-auto flex w-fit items-center rounded-md bg-background px-1.5 py-0.5 text-base text-plus md:mx-0">
      <CrownIcon className="mr-1 w-4" />
      Plus
    </span>
  </Link>
);
