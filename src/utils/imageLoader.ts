import { DEFAULT_USER_IMAGE_URL } from '@/constants';
import type { ImageLoaderProps } from 'next/image';

/*

*/
export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}&fallbackImg=${DEFAULT_USER_IMAGE_URL}`;
}
