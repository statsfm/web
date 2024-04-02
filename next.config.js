/* eslint-disable import/no-extraneous-dependencies */
/**
 * @type {(config: import('next/dist/server/config').NextConfig) => import('next/dist/server/config').NextConfig}
 */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  output: 'standalone',
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: false,
  basePath: '',
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.ts',
  },
  optimizeFonts: false,
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
      {
        source: '/import',
        destination: '/settings/imports',
        permanent: true,
      },
      {
        source: '/settings/gift',
        destination: '/gift',
        permanent: true,
      },
      {
        source: '/settings/gift/success',
        destination: '/gift/success',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://stats.fm/discord',
        permanent: false,
      },
      {
        source: '/jobs',
        destination: '/careers',
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
      {
        source: '/:id/artists',
        destination: '/user/:id/artists',
      },
      {
        source: '/:id/albums',
        destination: '/user/:id/albums',
      },
      {
        source: '/:id/tracks',
        destination: '/user/:id/tracks',
      },
      {
        source: '/:id/listeningClocks',
        destination: '/user/:id/listening-clocks',
      },
      {
        source: '/:id/listening-clocks',
        destination: '/user/:id/listening-clocks',
      },
      {
        source: '/:id/genres',
        destination: '/user/:id/genres',
      },
      {
        source: '/:id/recentStreams',
        destination: '/user/:id/recent-streams',
      },
      {
        source: '/:id/recent-streams',
        destination: '/user/:id/recent-streams',
      },
    ];
  },
  generateBuildId: () => 'statsfm-site',
});
