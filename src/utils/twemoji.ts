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

export const apis = {
  twemoji: (code: string) =>
    `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code.toLowerCase()}.svg`,
  openmoji: 'https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/',
  blobmoji: 'https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/',
  noto: 'https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/',
  fluent: (code: string) =>
    `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_color.svg`,
  fluentFlat: (code: string) =>
    `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_flat.svg`,
};

const emojiCache: Record<string, Promise<string>> = {};

export async function loadEmoji(type: keyof typeof apis, code: string) {
  const key = `${type}:${code}`;

  if (key in emojiCache) {
    return emojiCache[key]!;
  }

  let selectedType = type;

  if (!type || !apis[type]) {
    selectedType = 'twemoji';
  }

  const api = apis[selectedType];

  let emojiPromise: Promise<string>;

  if (typeof api === 'function') {
    emojiPromise = fetch(api(code)).then(async (r) => r.text());
  } else {
    emojiPromise = fetch(`${api}${code.toUpperCase()}.svg`).then(async (r) =>
      r.text(),
    );
  }

  emojiCache[key] = emojiPromise; // Storing the promise in the cache

  return emojiPromise; // Returning the promise
}
