import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@websites/legal-cz", "@websites/form-engine"],
};

export default nextConfig;
