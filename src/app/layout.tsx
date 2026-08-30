import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import { FormRouteBinder } from "@websites/form-engine/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { otevruConfig } from "@/config/site";
import "./globals.css";
import "./otevru.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-otevru",
});

export const metadata: Metadata = {
  metadataBase: new URL(otevruConfig.url),
  title: `${otevruConfig.brand} | Zámečnická pohotovost Frýdek-Místek`,
  description: otevruConfig.tagline,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: otevruConfig.brand,
    title: `${otevruConfig.brand} | Zámečnická pohotovost Frýdek-Místek`,
    description: otevruConfig.shortDescription,
    url: otevruConfig.url,
    locale: "cs_CZ",
  },
  twitter: {
    card: "summary_large_image",
    title: `${otevruConfig.brand} | Zámečnická pohotovost`,
    description: otevruConfig.shortDescription,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Locksmith",
  name: otevruConfig.name,
  url: otevruConfig.url,
  telephone: "+420606262118",
  email: otevruConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "O. Kišové 88",
    postalCode: "739 25",
    addressLocality: "Sviadnov",
    addressCountry: "CZ",
  },
  areaServed: "Frýdek-Místek, Ostrava a okolí",
  geo: { "@type": "GeoCoordinates", latitude: 49.6892, longitude: 18.3278 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${dmSans.variable} h-full`}>
      <body
        data-form-endpoint="/api/form"
        data-turnstile-site-key={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        className="otevru-root flex min-h-full flex-col font-[family-name:var(--font-otevru)] antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        <Script src="/form.js" strategy="beforeInteractive" />
        <FormRouteBinder />
        <a
          href={otevruConfig.phoneHref}
          className="otevru-btn-orange fixed bottom-5 right-5 z-40 rounded-full px-5 py-3 text-sm font-bold shadow-lg sm:hidden"
        >
          Zavolat
        </a>
      </body>
    </html>
  );
}
