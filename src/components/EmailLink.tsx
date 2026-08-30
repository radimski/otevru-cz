"use client";

import { useEffect, useState, type ReactNode } from "react";

type EmailLinkProps = {
  email: string;
  className?: string;
  children?: ReactNode;
};

/** Builds mailto: only after hydration so simple scrapers miss it in HTML source. */
export function EmailLink({ email, className, children }: EmailLinkProps) {
  const [href, setHref] = useState<string | null>(null);
  const label = children ?? email;

  useEffect(() => {
    setHref("mail" + "to:" + email);
  }, [email]);

  if (!href) {
    return (
      <span className={className}>
        {typeof label === "string" ? label.replace("@", " [at] ") : label}
      </span>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
