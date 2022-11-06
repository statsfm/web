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
        source: '/:id/top',
        destination: '/:id',
        permanent: false,
      },
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
      {
        source: '/discord/',
        destination: 'https://stats.fm/discord',
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
        source: '/:id/friends',
        destination: '/user/:id/friends',
      },
      {
        source: '/:id/streams',
        destination: '/user/:id/streams',
      },
      {
        source: '/:id/compare',
        destination: '/user/:id/compare',
      },
      {
        source: '/:id/top/:type',
        destination: '/user/:id/top/:type',
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
