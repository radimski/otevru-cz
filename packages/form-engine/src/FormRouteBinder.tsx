"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function bindPendingForms() {
  const pending = Array.from(document.querySelectorAll("[data-form]")).some(
    (form) => !form.querySelector('[name="_website"]'),
  );
  if (!pending) return;

  const script = document.createElement("script");
  script.src = "/form.js";
  script.async = true;
  script.dataset.formEngine = "true";
  document.body.appendChild(script);
}

/**
 * The layout ships a deferred `form.js` for the first paint. After client-side
 * navigation onto a page with a form, inject the script again so new `[data-form]`
 * markup gets bound.
 */
export function FormRouteBinder() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    bindPendingForms();
  }, [pathname]);

  return null;
}
