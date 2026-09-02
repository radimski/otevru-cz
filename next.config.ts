import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/security-headers";

const isFtpExport = process.env.BUILD_TARGET === "ftp";

const nextConfig: NextConfig = isFtpExport
  ? {
      output: "export",
      // Flat *.html at web root so relative asset paths work on every page.
      trailingSlash: false,
      assetPrefix: "./",
      images: { unoptimized: true },
      poweredByHeader: false,
      transpilePackages: ["@websites/legal-cz", "@websites/form-engine"],
    }
  : {
      poweredByHeader: false,
      transpilePackages: ["@websites/legal-cz", "@websites/form-engine"],
      async headers() {
        return [{ source: "/:path*", headers: buildSecurityHeaders() }];
      },
    };

export default nextConfig;

if (!isFtpExport) {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}
