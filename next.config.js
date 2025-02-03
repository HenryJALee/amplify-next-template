/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3-*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // If using CloudFront
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      }
    ],
    // Optional: configure other image settings
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
  // Your other Next.js config options...
};

module.exports = nextConfig;
