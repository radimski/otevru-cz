/**
 * Response headers for production hardening (securityheaders.com / Observatory).
 * HSTS and upgrade-insecure-requests apply in production only so local HTTP dev works.
 */
export function buildSecurityHeaders(): { key: string; value: string }[] {
  const isProd = process.env.NODE_ENV === "production";

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.fbcdn.net",
    "font-src 'self'",
    "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    isProd ? "upgrade-insecure-requests" : null,
  ]
    .filter(Boolean)
    .join("; ");

  const headers: { key: string; value: string }[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
    },
    { key: "Content-Security-Policy", value: csp },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];

  if (isProd) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  return headers;
}
