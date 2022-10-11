/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextBuildId = require('next-build-id');

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.stats.fm',
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
    ],
  },
  async redirects() {
    return [
      {
        source: '/account/:path*',
        destination: '/settings/:path*',
        permanent: false,
      },
      {
        source: '/settings',
        destination: '/settings/profile',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:id',
        destination: '/user/:id',
      },
      {
        source: '/artist/:id/:ignore',
        destination: '/artist/:id',
      },
      {
        source: '/track/:id/:ignore',
        destination: '/track/:id',
      },
      {
        source: '/album/:id/:ignore',
        destination: '/album/:id',
      },
    ];
  },
  generateBuildId: () => nextBuildId({ dir: __dirname }),
});
