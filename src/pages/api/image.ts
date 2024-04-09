import type { NextApiRequest, NextApiResponse } from 'next';
import { cpus } from 'os';
import sharp from 'sharp';
import { URL } from 'url';
import isAnimated from 'is-animated';
import { getContentType, getExtension } from 'next/dist/server/serve-static';
import {
  IMAGE_TYPES,
  ImageError,
  detectContentType,
  fetchExternalImage,
  getHash,
  getMaxAge,
  getSupportedMimeType,
  hasMatch,
  setResponseHeaders,
  type ImageParamsResult,
  type ImageUpstream,
  type RemotePattern,
} from '@/utils/images';

const isDev = process.env.NODE_ENV === 'development';

if (sharp.concurrency() > 1) {
  const divisor = isDev ? 4 : 2;
  sharp.concurrency(Math.floor(Math.max(cpus().length / divisor, 1)));
}

const allowedHosts: RemotePattern[] = [
  {
    protocol: 'https',
    hostname: 'cdn.stats.fm',
  },
  {
    protocol: 'https',
    hostname: '**.stats.fm',
  },
  {
    protocol: 'https',
    hostname: 'stats.fm',
  },
  {
    protocol: 'https',
    hostname: '**.scdn.co',
  },
  {
    protocol: 'https',
    hostname: '**.fbcdn.net',
  },
  {
    protocol: 'https',
    hostname: '**.fbsbx.com',
  },
  {
    protocol: 'https',
    hostname: 'crowdin-static.downloads.crowdin.com',
  },
  {
    protocol: 'https',
    hostname: '**.mzstatic.com',
  },
  {
    protocol: 'http',
    hostname: 'localhost',
  },
];

function validateParams(req: NextApiRequest) {
  const {
    url,
    w,
    q,
    f: format,
    fallbackImg,
  } = req.query as {
    url: string;
    w: string;
    q: string;
    f?: 'image/webp' | 'image/png';
    fallbackImg?: string;
  };

  let href: string;

  if (!url) {
    return { errorMessage: '"url" parameter is required' };
  }
  if (Array.isArray(url)) {
    return { errorMessage: '"url" parameter cannot be an array' };
  }

  if (format) {
    if (Array.isArray(format)) {
      return { errorMessage: '"format" parameter cannot be an array' };
    }
    if (!([IMAGE_TYPES.WEBP, IMAGE_TYPES.PNG] as string[]).includes(format)) {
      return {
        errorMessage:
          '"format" parameter must be one of "image/webp" or "image/png", if provided',
      };
    }
  }

  if (fallbackImg) {
    if (Array.isArray(fallbackImg)) {
      return { errorMessage: '"failImageUrl" parameter cannot be an array' };
    }
    if (typeof fallbackImg !== 'string') {
      return { errorMessage: '"failImageUrl" parameter must be a string' };
    }
  }

  let isAbsolute: boolean;

  if (url.startsWith('/')) {
    href = url;
    isAbsolute = false;
  } else {
    let hrefParsed: URL;

    try {
      hrefParsed = new URL(url);
      href = hrefParsed.toString();
      isAbsolute = true;
    } catch (_error) {
      return { errorMessage: '"url" parameter is invalid' };
    }

    if (!['http:', 'https:'].includes(hrefParsed.protocol)) {
      return { errorMessage: '"url" parameter is invalid' };
    }

    if (!hasMatch(allowedHosts, hrefParsed)) {
      return { errorMessage: '"url" parameter is not allowed' };
    }
  }

  if (!w) {
    return { errorMessage: '"w" parameter (width) is required' };
  }
  if (Array.isArray(w)) {
    return { errorMessage: '"w" parameter (width) cannot be an array' };
  }

  if (!q) {
    return { errorMessage: '"q" parameter (quality) is required' };
  }
  if (Array.isArray(q)) {
    return { errorMessage: '"q" parameter (quality) cannot be an array' };
  }

  const width = parseInt(w, 10);

  if (width <= 0 || Number.isNaN(width)) {
    return {
      errorMessage: '"w" parameter (width) must be a number greater than 0',
    };
  }

  const sizes = [
    640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256,
    384,
  ];

  const isValidSize = sizes.includes(width);

  if (!isValidSize) {
    return {
      errorMessage: `"w" parameter (width) of ${width} is not allowed`,
    };
  }

  const quality = parseInt(q, 10);

  if (Number.isNaN(quality) || quality < 1 || quality > 100) {
    return {
      errorMessage:
        '"q" parameter (quality) must be a number between 1 and 100',
    };
  }

  const mimeType = getSupportedMimeType(
    [...(format ? [format] : []), 'image/webp'],
    req.headers.accept,
  );

  return {
    href,
    sizes,
    isAbsolute,
    width,
    quality,
    mimeType,
    minimumCacheTTL: 60,
    format,
    fallbackImg,
  };
}

async function optimizeImage({
  buffer,
  contentType,
  quality,
  width,
  height,
  format,
}: {
  buffer: Buffer;
  contentType: string;
  quality: number;
  width: number;
  height?: number;
  format?: 'image/webp' | 'image/png';
}) {
  const transformer = sharp(buffer, {
    sequentialRead: true,
  });

  transformer.rotate();

  if (height) {
    transformer.resize(width, height);
  } else {
    transformer.resize(width, undefined, {
      withoutEnlargement: true,
    });
  }

  if (format) {
    transformer.toFormat(format === 'image/png' ? 'png' : 'webp');
    // eslint-disable-next-line no-param-reassign
    contentType = format;
  }

  if (contentType === IMAGE_TYPES.AVIF) {
    if (transformer.avif) {
      const avifQuality = quality - 15;
      transformer.avif({
        quality: Math.max(avifQuality, 0),
        chromaSubsampling: '4:2:0', // same as webp
      });
    } else {
      transformer.webp({ quality });
    }
  } else if (contentType === IMAGE_TYPES.WEBP) {
    transformer.webp({ quality });
  } else if (contentType === IMAGE_TYPES.PNG) {
    transformer.png({ quality });
  } else if (contentType === IMAGE_TYPES.JPEG) {
    transformer.jpeg({ quality, progressive: true });
  }

  return transformer.toBuffer();
}

export async function imageOptimizer(
  imageUpstream: ImageUpstream,
  paramsResult: Pick<
    ImageParamsResult,
    'href' | 'width' | 'quality' | 'mimeType' | 'format'
  >,
  _isDev: boolean | undefined,
) {
  const { href, quality, width, mimeType, format } = paramsResult;
  const upstreamBuffer = imageUpstream.buffer;
  const maxAge = getMaxAge(imageUpstream.cacheControl);
  const upstreamType =
    detectContentType(upstreamBuffer) ??
    imageUpstream.contentType?.toLowerCase().trim();

  if (upstreamType) {
    if (upstreamType.startsWith('image/svg')) {
      throw new ImageError(
        400,
        '"url" parameter is valid but image type is not supported',
      );
    }

    if (
      IMAGE_TYPES.ANIMATABLE.includes(upstreamType) &&
      isAnimated(upstreamBuffer)
    ) {
      return {
        buffer: upstreamBuffer,
        contentType: upstreamType,
        maxAge,
      };
    }

    if (!upstreamType.startsWith('image/') || upstreamType.includes(',')) {
      // eslint-disable-next-line no-console
      console.error(
        "The requested resource isn't a valid image for",
        href,
        'received',
        upstreamType,
      );
      throw new ImageError(400, "The requested resource isn't a valid image.");
    }
  }

  let contentType: string;

  if (format) {
    contentType = format;
  } else if (mimeType) {
    contentType = mimeType;
  } else if (
    upstreamType?.startsWith('image/') &&
    getExtension(upstreamType) &&
    upstreamType !== IMAGE_TYPES.WEBP &&
    upstreamType !== IMAGE_TYPES.AVIF
  ) {
    contentType = upstreamType;
  } else {
    contentType = IMAGE_TYPES.JPEG;
  }

  try {
    const optimizedBuffer = await optimizeImage({
      buffer: upstreamBuffer,
      contentType,
      quality,
      width,
      format,
    });
    if (optimizedBuffer) {
      return {
        buffer: optimizedBuffer,
        contentType,
        maxAge: Math.max(maxAge, 60),
      };
    }
    throw new ImageError(500, 'Failed to optimize image');
  } catch (error) {
    if (upstreamBuffer && upstreamType) {
      // If we fail to optimize, fallback to the original image
      return {
        buffer: upstreamBuffer,
        contentType: upstreamType,
        maxAge: Math.max(maxAge, 60),
      };
    }
    throw new ImageError(
      400,
      'Unable to optimize image and unable to fallback to upstream image',
    );
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = validateParams(req);

  if ('errorMessage' in data) {
    res.status(400).send(data.errorMessage);
    return;
  }

  const { isAbsolute, href, fallbackImg } = data;

  try {
    if (!isAbsolute)
      throw new ImageError(400, '"url" parameter must be an absolute URL');

    const imageUpstream = await fetchExternalImage(href, fallbackImg);

    const {
      buffer,
      contentType: tempContentType,
      maxAge,
    } = await imageOptimizer(imageUpstream, data, isDev);

    const contentType = getContentType(getExtension(tempContentType) as string);

    const result = setResponseHeaders({
      req,
      res,
      url: data.href,
      etag: getHash([buffer]),
      contentType,
      maxAge,
      isDev: process.env.NODE_ENV === 'development',
    });

    if (!result.finished) {
      res.setHeader('Content-Length', Buffer.byteLength(buffer));
      res.end(buffer);
    }
  } catch (error) {
    if (error instanceof ImageError) {
      res.status(error.statusCode).send(error.message);
      return;
    }
    throw error;
  }
}
