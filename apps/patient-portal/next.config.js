/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/api", "@repo/auth", "@repo/db", "@repo/config"],
};

export default nextConfig;
