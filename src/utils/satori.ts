import satori from 'satori';
import type { SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import { join } from 'path';
import type { ReactElement } from 'react';

const fonts: SatoriOptions['fonts'] = [
  // the first entry is used as the default font
  {
    name: 'Sans',
    data: fs.readFileSync(join('.', 'src/pages/fonts/StatsfmSans-Regular.ttf')),
    weight: 400,
  },
  {
    name: 'Statsfm Sans',
    data: fs.readFileSync(join('.', 'src/pages/fonts/StatsfmSans-Thin.ttf')),
    weight: 100,
  },
  {
    name: 'Statsfm Sans',
    data: fs.readFileSync(join('.', 'src/pages/fonts/StatsfmSans-Light.ttf')),
    weight: 300,
  },
  {
    name: 'Sans Medium',
    data: fs.readFileSync(join('.', 'src/pages/fonts/StatsfmSans-Medium.ttf')),
    weight: 500,
  },
  {
    name: 'Sans Bold',
    data: fs.readFileSync(join('.', 'src/pages/fonts/StatsfmSans-Bold.ttf')),
    weight: 700,
  },
];

type Options = {
  width: number;
  height: number;
  debug: boolean;
  fonts?: SatoriOptions['fonts'];
};

// reversed engineered version of @vercel/og
// https://vercel.com/docs/concepts/functions/edge-functions/og-image-api
// that does not depend on wasm modules
// so works in pure node env
export async function renderToImage(
  node: ReactElement,
  options: Options = {
    width: 1200,
    height: 600,
    debug: false,
  },
) {
  const svg = await satori(node, {
    width: options.width,
    height: options.height,
    debug: options.debug,
    fonts: options.fonts ?? fonts,
  });

  const w = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: options.width,
    },
  });
  return w.render().asPng();
}
