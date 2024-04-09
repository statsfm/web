import { mediaType } from '@hapi/accept';
import contentDisposition from 'content-disposition';
import fresh from 'fresh';
import { getExtension } from 'next/dist/server/serve-static';
import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { URL } from 'node:url';
import { makeRe } from 'picomatch';

export interface ImageParamsResult {
  href: string;
  isAbsolute: boolean;
  width: number;
  quality: number;
  mimeType: string;
  sizes: number[];
  minimumCacheTTL: number;
  format?: 'image/webp' | 'image/png';
  fallbackImg?: string;
}

export interface ImageUpstream {
  buffer: Buffer;
  contentType: string | null | undefined;
  cacheControl: string | null | undefined;
}

export interface RemotePattern {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
}

export const IMAGE_TYPES = {
  AVIF: 'image/avif',
  WEBP: 'image/webp',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  ANIMATABLE: ['image/webp', 'image/png', 'image/gif'] as string[],
} as const;

export function getSupportedMimeType(options: string[], accept = ''): string {
  const mimeType = mediaType(accept, options);
  return accept.includes(mimeType) ? mimeType : '';
}

function matchRemotePattern(pattern: RemotePattern, url: URL): boolean {
  if (pattern.protocol !== undefined) {
    const actualProto = url.protocol.slice(0, -1);
    if (pattern.protocol !== actualProto) {
      return false;
    }
  }
  if (pattern.port !== undefined) {
    if (pattern.port !== url.port) {
      return false;
    }
  }

  if (pattern.hostname === undefined) {
    throw new Error(
      `Pattern should define hostname but found\n${JSON.stringify(pattern)}`,
    );
  } else if (!makeRe(pattern.hostname).test(url.hostname)) {
    return false;
  }

  if (!makeRe(pattern.pathname ?? '**', { dot: true }).test(url.pathname)) {
    return false;
  }

  return true;
}

export function hasMatch(remotePatterns: RemotePattern[], url: URL): boolean {
  return remotePatterns.some((p) => matchRemotePattern(p, url));
}
/**
 * Inspects the first few bytes of a buffer to determine if
 * it matches the "magic number" of known file signatures.
 * https://en.wikipedia.org/wiki/List_of_file_signatures
 */
export function detectContentType(buffer: Buffer) {
  if ([0xff, 0xd8, 0xff].every((b, i) => buffer[i] === b)) {
    return IMAGE_TYPES.JPEG;
  }
  if (
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (b, i) => buffer[i] === b,
    )
  ) {
    return IMAGE_TYPES.PNG;
  }
  if ([0x47, 0x49, 0x46, 0x38].every((b, i) => buffer[i] === b)) {
    return IMAGE_TYPES.GIF;
  }
  if (
    [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50].every(
      (b, i) => !b || buffer[i] === b,
    )
  ) {
    return IMAGE_TYPES.WEBP;
  }
  if (
    [0, 0, 0, 0, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66].every(
      (b, i) => !b || buffer[i] === b,
    )
  ) {
    return IMAGE_TYPES.AVIF;
  }
  return null;
}

export class ImageError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    // ensure an error status is used > 400
    if (statusCode >= 400) {
      this.statusCode = statusCode;
    } else {
      this.statusCode = 500;
    }
  }
}

export function getHash(items: (string | number | Buffer)[]) {
  const hash = createHash('sha256');
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    if (typeof item === 'number') hash.update(String(item));
    else {
      hash.update(item);
    }
  }
  // See https://en.wikipedia.org/wiki/Base64#Filenames
  return hash.digest('base64').replace(/\//g, '-');
}

function getFileNameWithExtension(
  url: string,
  contentType: string | null,
): string {
  const [urlWithoutQueryParams] = url.split('?', 1);
  const fileNameWithExtension = urlWithoutQueryParams?.split('/').pop();
  if (!contentType || !fileNameWithExtension) {
    return 'image.bin';
  }

  const [fileName] = fileNameWithExtension.split('.', 1);
  const extension = getExtension(contentType);
  return `${fileName}.${extension}`;
}

function sendEtagResponse(
  req: IncomingMessage,
  res: ServerResponse,
  etag: string | undefined,
): boolean {
  if (etag) {
    /**
     * The server generating a 304 response MUST generate any of the
     * following header fields that would have been sent in a 200 (OK)
     * response to the same request: Cache-Control, Content-Location, Date,
     * ETag, Expires, and Vary. https://tools.ietf.org/html/rfc7232#section-4.1
     */
    res.setHeader('ETag', etag);
  }

  if (fresh(req.headers, { etag })) {
    res.statusCode = 304;
    res.end();
    return true;
  }

  return false;
}

export async function fetchExternalImage(
  href: string,
  fallbackImg?: string,
): Promise<ImageUpstream> {
  let res = await fetch(href);

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('upstream image response failed for', href, res.status);
    if (fallbackImg) {
      res = await fetch(fallbackImg);
      if (!res.ok) {
        throw new ImageError(res.status, 'Unable to fetch fallback image');
      }
    } else {
      throw new ImageError(
        res.status,
        '"url" parameter is valid but upstream response is invalid',
      );
    }
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('Content-Type');
  const cacheControl = res.headers.get('Cache-Control');

  return { buffer, contentType, cacheControl };
}

function parseCacheControl(
  str: string | null | undefined,
): Map<string, string> {
  const map = new Map<string, string>();
  if (!str) {
    return map;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const directive of str.split(',')) {
    let [key, value] = directive.trim().split('=', 2);
    key = key!.toLowerCase();
    if (value) {
      value = value.toLowerCase();
    }
    map.set(key, value!);
  }
  return map;
}

export function getMaxAge(str: string | null | undefined): number {
  const map = parseCacheControl(str);
  if (map) {
    let age = map.get('s-maxage') ?? map.get('max-age') ?? '';
    if (age.startsWith('"') && age.endsWith('"')) {
      age = age.slice(1, -1);
    }
    const n = parseInt(age, 10);
    if (!Number.isNaN(n)) {
      return n;
    }
  }
  return 0;
}

export function setResponseHeaders({
  req,
  res,
  url,
  etag,
  contentType,
  maxAge,
  isDev,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  url: string;
  etag: string;
  contentType: string | null;
  maxAge: number;
  isDev: boolean;
}) {
  res.setHeader('Vary', 'Accept');
  res.setHeader(
    'Cache-Control',
    `public, max-age=${isDev ? 0 : maxAge}, must-revalidate`,
  );
  if (sendEtagResponse(req, res, etag)) {
    // already called res.end() so we're finished
    return { finished: true };
  }
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }

  const fileName = getFileNameWithExtension(url, contentType);
  res.setHeader(
    'Content-Disposition',
    contentDisposition(fileName, { type: 'inline' }),
  );

  res.setHeader(
    'Content-Security-Policy',
    "script-src 'none'; frame-src 'none'; sandbox;",
  );

  return { finished: false };
}
