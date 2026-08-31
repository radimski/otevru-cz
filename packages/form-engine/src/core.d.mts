/** Types for the vendored `core.mjs` (upstream: site/functions/_core.mjs). */

export declare const HONEYPOTS: string[];
export declare const SPAM_THRESHOLD: number;

export declare class FormError extends Error {
  constructor(
    code: string,
    message?: string,
    fields?: Record<string, string> | null,
  );
  code: string;
  fields: Record<string, string> | null;
  readonly status: number;
  toJSON(debug?: boolean): {
    ok: false;
    error: string;
    fields?: Record<string, string>;
    message?: string;
  };
}

export type FieldSpec = {
  type?: string;
  label?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  options?: string[];
  maxLinks?: number;
};

export type FormConfirmation = {
  field: string;
  subject: string;
  intro: string;
  footer?: string;
};

export type ResolvedForm = {
  label: string;
  to: string[];
  cc: string[];
  subject: string;
  replyTo: string;
  minSeconds: number;
  maxPerHour: number;
  maxPerDay: number;
  store: boolean;
  fields: Record<string, FieldSpec>;
  confirmation?: FormConfirmation;
};

export type FormsJson = {
  forms: Record<string, Partial<ResolvedForm> & { fields: Record<string, FieldSpec> }>;
};

export type SpamVerdict = {
  score: number;
  reasons: string[];
  quarantined: boolean;
};

export type FormValues = Record<string, string | number | boolean>;

export declare function resolveForm(
  formsJson: FormsJson,
  id: string,
): ResolvedForm;

export declare function issueToken(
  formId: string,
  secret: string,
  now?: number,
): Promise<string>;

export declare function verifyToken(
  token: string,
  formId: string,
  secret: string,
  ttl: number,
  now?: number,
): Promise<number>;

export declare function validate(
  fields: Record<string, FieldSpec>,
  input: Record<string, unknown>,
): FormValues;

export declare function checkOrigin(
  originHeader: string | null,
  refererHeader: string | null,
  allowed: string[],
): void;

export declare function evaluateSpam(
  raw: Record<string, unknown>,
  clean: FormValues,
  form: ResolvedForm,
  tokenAge: number,
): SpamVerdict;

export declare function readBody(
  request: Request,
): Promise<Record<string, unknown>>;

export declare function processSubmission(options: {
  body: Record<string, unknown>;
  formsJson: FormsJson;
  secret: string;
  nonceTtl?: number;
  consumeNonce?: (token: string) => Promise<boolean>;
  checkRate?: (
    ip: string,
    form: string,
    perHour: number,
    perDay: number,
  ) => Promise<void>;
  ip?: string;
}): Promise<{
  formId: string;
  form: ResolvedForm;
  values: FormValues;
  verdict: SpamVerdict;
  issuedAt: number;
}>;
