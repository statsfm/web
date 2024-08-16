/**
 * modified version of https://unpkg.com/twemoji@13.1.0/dist/twemoji.esm.js.
 */

/* ! Copyright Twitter Inc. and other contributors. Licensed under MIT */

const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;

function toCodePoint(unicodeSurrogates: string) {
  const r = [];
  let c = 0;
  let i = 0;
  let p = 0;

  while (i < unicodeSurrogates.length) {
    // eslint-disable-next-line no-plusplus
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      // eslint-disable-next-line no-bitwise
      r.push((65536 + ((p - 55296) << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (c >= 55296 && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join('-');
}

export function getIconCode(char: string) {
  return toCodePoint(!char.includes(U200D) ? char.replace(UFE0Fg, '') : char);
}

export enum EmojiType {
  TWEMOJI = 'twemoji',
  OPENOJI = 'openmoji',
  BLOBMOJI = 'blobmoji',
  NOTO = 'noto',
  FLUENT = 'fluent',
  FLUENT_FLAT = 'fluentFlat',
}

function getEmojiImageUrl(code: string, type: EmojiType): string {
  switch (type) {
    case 'twemoji':
      return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code.toLowerCase()}.svg`;
    case 'openmoji':
      return `https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/${code.toUpperCase()}.svg`;
    case 'blobmoji':
      return `https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/${code.toUpperCase()}.svg`;
    case 'noto':
      return `https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/${code.toUpperCase()}.svg`;
    case 'fluent':
      return `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_color.svg`;
    case 'fluentFlat':
      return `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_flat.svg`;
    default:
      return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code.toLowerCase()}.svg`;
  }
}

const cachedEmojis = new Map<string, string>();

export async function loadEmojiSVGEncoded(
  type: EmojiType,
  code: string,
): Promise<string> {
  const key = `${type}:${code}`;

  if (cachedEmojis.has(key)) {
    return cachedEmojis.get(key)!;
  }

  const emojiImageURL = getEmojiImageUrl(code, type);
  const emojiSVGEncoded = await fetch(emojiImageURL)
    .then((res) => res.arrayBuffer())
    .then((content) => Buffer.from(content))
    .then((buff) => `data:image/svg+xml;base64,${buff.toString('base64')}`);

  cachedEmojis.set(key, emojiSVGEncoded);

  return emojiSVGEncoded;
}
