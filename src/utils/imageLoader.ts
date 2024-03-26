import type { ImageLoaderProps } from 'next/image';

/*

*/
export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return `/api/image?url=${src}&w=${width}&q=${quality ?? 75}`;
}
