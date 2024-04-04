/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.CORS_ALLOWED_ORIGIN,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: process.env.CORS_ALLOWED_METHOD,
          },
          {
            key: "Access-Control-Allow-Headers",
            value: process.env.CORS_ALLOWED_HEADERS,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
