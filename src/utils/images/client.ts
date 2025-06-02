import { DEFAULT_USER_IMAGE_URL } from '@/constants';
import { decodeImage } from '@rive-app/react-webgl2';

export async function fetchAndFitImage(
  url: string,
  targetWidth: number,
  targetHeight: number,
) {
  const queryParams = new URLSearchParams({
    url,
    w: targetWidth.toString(),
    q: '75',
    fallbackImg: DEFAULT_USER_IMAGE_URL,
  });

  const res = await fetch(`/api/image?${queryParams.toString()}`);

  const imgBlob = await res.blob();
  const img = await createImageBitmap(imgBlob);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;

  const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
  const x = (targetWidth - img.width * scale) / 2;
  const y = (targetHeight - img.height * scale) / 2;

  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  const arrayBuffer: ArrayBuffer = await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      blob?.arrayBuffer().then(resolve);
    });
  });

  return decodeImage(new Uint8Array(arrayBuffer));
}
