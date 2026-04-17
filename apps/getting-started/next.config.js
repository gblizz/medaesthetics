/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/db", "@repo/config"],
};
export default nextConfig;
