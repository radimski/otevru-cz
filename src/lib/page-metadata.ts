import type { Metadata } from "next";

/** Merge page metadata with a path-relative canonical URL (requires metadataBase in layout). */
export function withCanonical(path: string, metadata: Metadata): Metadata {
  return {
    ...metadata,
    alternates: { canonical: path },
  };
}
