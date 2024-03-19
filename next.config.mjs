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
            value: "*",
            // value: process.env.ALLOWED_ORIGIN,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            // value: process.env.ALLOWED_METHOD,
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
            // value: process.env.ALLOWED_HEADERS,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
