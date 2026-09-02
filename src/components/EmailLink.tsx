"use client";

import { useEffect, useState, type ReactNode } from "react";

type EmailLinkProps = {
  email: string;
  className?: string;
  children?: ReactNode;
  /** Contact-style display — show @ before hydration (e.g. kontakt page, static ftp/). */
  plain?: boolean;
};

function splitEmail(email: string) {
  const at = email.indexOf("@");
  if (at === -1) return { local: email, domain: "" };
  return { local: email.slice(0, at), domain: email.slice(at + 1) };
}

/** Builds mailto: only after hydration so simple scrapers miss it in HTML source. */
export function EmailLink({
  email,
  className,
  children,
  plain = false,
}: EmailLinkProps) {
  const [href, setHref] = useState<string | null>(null);
  const label = children ?? email;
  const { local, domain } = splitEmail(email);

  useEffect(() => {
    setHref("mail" + "to:" + email);
  }, [email]);

  if (!href) {
    return (
      <span className={className}>
        {plain && !children ? (
          <>
            {local}@{domain}
          </>
        ) : typeof label === "string" ? (
          label.replace("@", " [at] ")
        ) : (
          label
        )}
      </span>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
