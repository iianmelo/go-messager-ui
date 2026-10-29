/** @type {import('next').NextConfig} */
const apiBase = (
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://go-messenger.onrender.com"
).replace(/\/$/, "");

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/signin",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
  env: {
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || process.env.WS_URL || "",
  },
};

module.exports = nextConfig;
