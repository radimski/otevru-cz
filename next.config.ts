import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@websites/legal-cz", "@websites/form-engine"],
  async headers() {
    return [{ source: "/:path*", headers: buildSecurityHeaders() }];
  },
};

export default nextConfig;
