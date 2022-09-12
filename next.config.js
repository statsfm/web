/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  images: {
    domains: [
      'i.scdn.co',
      'cdn.stats.fm',
      'platform-lookaside.fbsbx.com',
      'scontent-cdt1-1.xx.fbcdn.net',
      'scontent-cdg2-1.xx.fbcdn.net',
      'scontent-frt3-1.xx.fbcdn.net',
      'scontent.flux1-1.fna.fbcdn.net',
      'scontent-frx5-1.xx.fbcdn.net',
      'scontent-amt2-1.xx.fbcdn.net',
      'scontent-ams4-1.xx.fbcdn.net',
      'scontent-lcy1-1.xx.fbcdn.net',
      'scontent-ams2-1.xx.fbcdn.net',
    ],
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  async rewrites() {
    return [
      {
        source: '/:id',
        destination: '/user/:id',
      },
    ];
  },
});
