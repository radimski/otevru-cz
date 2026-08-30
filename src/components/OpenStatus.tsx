"use client";

import { useSyncExternalStore } from "react";
import {
  evaluateOpenStatus,
  type OpeningSchedule,
} from "@websites/legal-cz";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  return Math.floor(Date.now() / 60_000);
}

type OpenStatusProps = {
  schedule: OpeningSchedule;
  className?: string;
  detailClassName?: string;
  showDetail?: boolean;
};

export function OpenStatus({
  schedule,
  className = "open-status",
  detailClassName,
  showDetail = true,
}: OpenStatusProps) {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const status = evaluateOpenStatus(schedule);

  return (
    <span className={className} role="status" aria-label={status.ariaLabel}>
      <span
        className={`open-status-dot ${status.isOpen ? "is-open" : "is-closed"}`}
        aria-hidden
      />
      <span className="open-status-label">{status.label}</span>
      {showDetail && status.detail ? (
        <span className={detailClassName ?? "open-status-detail"}>
          {status.detail}
        </span>
      ) : null}
    </span>
  );
}
