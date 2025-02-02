/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    reactStrictMode: true,
  };
  
  module.exports = nextConfig;
  
  