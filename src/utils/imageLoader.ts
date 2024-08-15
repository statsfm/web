import type { ImageLoaderProps } from 'next/image';

/*

*/
export default function customImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}&fallbackImg=https://cdn.stats.fm/file/statsfm/images/placeholders/users/private.webp`;
}
