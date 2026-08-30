import type { MetadataRoute } from "next";
import { otevruConfig } from "@/config/site";

const paths = [
  "/",
  "/kontakt",
  "/ochrana-osobnich-udaju",
  "/cookies",
  "/provozovatel",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = new URL(otevruConfig.url);
  const now = new Date();

  return paths.map((path) => ({
    url: new URL(path, base).href,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/kontakt" ? 0.9 : 0.4,
  }));
}
