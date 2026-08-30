/**
 * Next.js adapter for the vendored form engine.
 *
 * Third implementation of the upstream wire protocol, alongside `api/form.php`
 * (production on shared hosting) and `functions/api/form.js` (Cloudflare
 * previews). `core.mjs` stays pure; everything stateful lives here.
 */

import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import nodemailer from "nodemailer";
import {
  FormError,
  checkOrigin,
  issueToken,
  processSubmission,
  readBody,
} from "./core.mjs";
import type { FormValues, FormsJson, ResolvedForm } from "./core.mjs";

const DEV_SECRET = "dev-secret-not-for-production-0000000000000000";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex",
} as const;

/**
 * Single-use tokens and rate-limit counters. In-memory, which is enough for a
 * single long-running Node process; a multi-instance deployment needs a shared
 * store (the PHP engine keeps both on disk).
 */
const spentNonces = new Set<string>();
const rateLog = new Map<string, number[]>();

export type FormRouteOptions = {
  formsJson: FormsJson;
  /** Namespaces stored submissions and rate-limit keys per site. */
  siteId: string;
};

export function createFormRoute({ formsJson, siteId }: FormRouteOptions) {
  const secret = resolveSecret();
  const nonceTtl = Number(process.env.FORM_NONCE_TTL || 7200);
  const debug = process.env.FORM_DEBUG === "1";
  const allowedOrigins = (process.env.FORM_ALLOWED_ORIGINS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const dataDir = join(
    process.env.FORM_DATA_DIR || ".form-data",
    siteId,
  );

  async function GET(request: Request) {
    try {
      checkOrigin(
        request.headers.get("origin"),
        request.headers.get("referer"),
        allowedOrigins,
      );

      const formId = new URL(request.url).searchParams.get("form") || "";
      if (!formsJson.forms?.[formId]) {
        throw new FormError("bad_form", `Unknown form "${formId}".`);
      }

      return json({
        ok: true,
        nonce: await issueToken(formId, secret),
        ttl: nonceTtl,
      });
    } catch (error) {
      return errorResponse(error, debug);
    }
  }

  async function POST(request: Request) {
    try {
      checkOrigin(
        request.headers.get("origin"),
        request.headers.get("referer"),
        allowedOrigins,
      );

      const body = await readBody(request);
      const ip = clientIp(request);

      await verifyTurnstile(
        String(body["cf-turnstile-response"] ?? ""),
        ip,
      );

      const { formId, form, values, verdict } = await processSubmission({
        body,
        formsJson,
        secret,
        nonceTtl,
        ip,
        consumeNonce: async (token) => {
          if (spentNonces.has(token)) return false;
          spentNonces.add(token);
          return true;
        },
        checkRate: async (ip, id, perHour, perDay) => {
          const key = `${ip}|${id}`;
          const now = Date.now();
          const stamps = (rateLog.get(key) || []).filter(
            (at) => now - at < 86_400_000,
          );

          const lastHour = stamps.filter((at) => now - at < 3_600_000).length;
          if (
            (perHour > 0 && lastHour >= perHour) ||
            (perDay > 0 && stamps.length >= perDay)
          ) {
            rateLog.set(key, stamps);
            throw new FormError("rate_limited", "Too many submissions.");
          }

          stamps.push(now);
          rateLog.set(key, stamps);
        },
      });

      const id = `${new Date()
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, 15)}-${randomUUID().slice(0, 8)}`;

      const record = {
        id,
        form: formId,
        at: new Date().toISOString(),
        spam: verdict.quarantined,
        spamScore: verdict.score,
        spamReasons: verdict.reasons,
        values,
      };

      if (form.store !== false) {
        await store(dataDir, formId, record);
      }

      // Quarantined submissions are kept but not mailed, and still reported as
      // success so a false positive costs a look in the log rather than a lost
      // enquiry — and a real spammer gets no signal to tune against.
      if (verdict.quarantined) {
        return json({ ok: true, id });
      }

      const mail = await deliverMail(dataDir, form, values, record);
      return json({ ok: true, id, mail });
    } catch (error) {
      return errorResponse(error, debug);
    }
  }

  return { GET, POST };
}

function resolveSecret() {
  const secret = process.env.FORM_SECRET;
  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[form-engine] FORM_SECRET is not set — falling back to the shared development key. Set it before going live.",
    );
  }
  return DEV_SECRET;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "0.0.0.0";
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new FormError(
        "server",
        "Turnstile is not configured for this environment.",
      );
    }
    return;
  }

  if (!token) {
    throw new FormError("captcha", "Security check missing.");
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const data = (await res.json()) as { success?: boolean };
  if (!data.success) {
    throw new FormError("captcha", "Security check failed.");
  }
}

async function store(
  dataDir: string,
  formId: string,
  record: Record<string, unknown>,
) {
  const dir = join(dataDir, "submissions", formId);
  await mkdir(dir, { recursive: true });
  await appendFile(
    join(dir, `${new Date().toISOString().slice(0, 7)}.jsonl`),
    `${JSON.stringify(record)}\n`,
    "utf8",
  );
}

type MailRecord = { id: string; spamScore: number };

function buildMailBody(
  form: ResolvedForm,
  values: FormValues,
  record: MailRecord,
) {
  const lines: string[] = [];
  for (const [name, spec] of Object.entries(form.fields)) {
    if (spec.type === "hidden" || !(name in values)) continue;
    let value = values[name];
    if (typeof value === "boolean") value = value ? "ano" : "ne";
    if (value === "" || value == null) continue;
    lines.push(`${spec.label || name}: ${value}`);
  }

  const subject = String(form.subject).replace(
    /\{([A-Za-z0-9_]+)\}/g,
    (_, key: string) => {
      const value = values[key];
      if (typeof value === "boolean") return value ? "ano" : "ne";
      return String(value ?? "");
    },
  );

  const replyTo =
    form.replyTo && values[form.replyTo] ? String(values[form.replyTo]) : "";

  const text = [
    form.label,
    "=".repeat(Math.max(4, form.label.length)),
    "",
    ...lines,
    "",
    "-".repeat(40),
    `ID: ${record.id}`,
    `Spam score: ${record.spamScore}`,
  ].join("\n");

  return { subject, text, replyTo };
}

function buildEml(
  form: ResolvedForm,
  values: FormValues,
  record: MailRecord,
  from: string,
) {
  const { subject, text, replyTo } = buildMailBody(form, values, record);

  return [
    `Date: ${new Date().toUTCString()}`,
    `From: ${from}`,
    `To: ${form.to.join(", ")}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text,
  ]
    .filter((line) => line !== null)
    .join("\r\n");
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim());
}

function resolveSmtpFrom() {
  const from = process.env.SMTP_FROM?.trim();
  if (from) return from;
  const user = process.env.SMTP_USER?.trim();
  if (user) return user;
  return "Web form <noreply@localhost>";
}

async function sendViaSmtp(
  form: ResolvedForm,
  values: FormValues,
  record: MailRecord,
) {
  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "1" ||
    process.env.SMTP_SECURE === "true" ||
    port === 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = resolveSmtpFrom();
  const { subject, text, replyTo } = buildMailBody(form, values, record);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  await transporter.sendMail({
    from,
    to: form.to,
    replyTo: replyTo || undefined,
    subject,
    text,
  });
}

/**
 * Sends via SMTP when configured; otherwise writes a `.eml` file the operator
 * can open locally. In production without SMTP, logs a warning and still
 * stores the outbox copy as a fallback.
 */
async function deliverMail(
  dataDir: string,
  form: ResolvedForm,
  values: FormValues,
  record: MailRecord,
) {
  const from = resolveSmtpFrom();

  if (smtpConfigured()) {
    try {
      await sendViaSmtp(form, values, record);
      return "smtp";
    } catch (error) {
      console.error("[form-engine] SMTP delivery failed:", error);
      if (process.env.NODE_ENV === "production") {
        throw new FormError(
          "server",
          "Message could not be delivered. Please try again later.",
        );
      }
    }
  } else if (process.env.NODE_ENV === "production") {
    console.warn(
      "[form-engine] SMTP is not configured — writing to outbox only. Set SMTP_HOST before launch.",
    );
  }

  const outbox = join(dataDir, "outbox");
  await mkdir(outbox, { recursive: true });
  await writeFile(
    join(outbox, `${record.id}.eml`),
    buildEml(form, values, record, from),
    "utf8",
  );
  return "outbox";
}

function errorResponse(error: unknown, debug: boolean) {
  if (error instanceof FormError) {
    return json(error.toJSON(debug), error.status);
  }
  console.error("[form-engine]", error);
  return json(
    {
      ok: false,
      error: "server",
      message: debug ? String(error) : undefined,
    },
    500,
  );
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}
