#!/usr/bin/env bash
# Pre-launch audit — view-source, header check, scanner links.
#
# Usage:
#   ./scripts/launch-audit.sh <base-url> [path ...]
#   ./scripts/launch-audit.sh <base-url> --file audit-pages.txt
#
# Examples:
#   ./scripts/launch-audit.sh https://www.otevru.cz / /kontakt
#   ./scripts/launch-audit.sh https://www.kinles.cz /
#   ./scripts/launch-audit.sh https://www.kolmokafe.cz --file kolmokafe/audit-pages.txt
#
# Applies to every current and future site in this repo (see RULEBOOK.md).
set -euo pipefail

slugify_path() {
  local p="$1"
  if [[ "$p" == "/" ]]; then
    echo "home"
  else
    printf '%s' "$p" | sed 's#^/##; s#/#-#g; s#[^a-zA-Z0-9._-]#-#g'
  fi
}

usage() {
  echo "Usage: $0 <base-url> [path ...]" >&2
  echo "       $0 <base-url> --file <audit-pages.txt>" >&2
  echo "" >&2
  echo "Default paths when none given: / /kontakt" >&2
  exit 1
}

[[ $# -ge 1 ]] || usage

BASE_URL="${1%/}"
shift

PATHS=()
if [[ $# -eq 0 ]]; then
  PATHS=("/" "/kontakt")
elif [[ "${1:-}" == "--file" ]]; then
  [[ $# -eq 2 && -f "$2" ]] || usage
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(printf '%s' "$line" | xargs)"
    [[ -n "$line" ]] && PATHS+=("$line")
  done < "$2"
  [[ ${#PATHS[@]} -gt 0 ]] || { echo "No paths in $2" >&2; exit 1; }
else
  PATHS=("$@")
fi

HOST="$(printf '%s' "$BASE_URL" | sed -E 's#^https?://([^/]+).*#\1#')"
HOST_SLUG="$(printf '%s' "$HOST" | tr '.:' '-')"
STAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${ROOT}/docs/audit/${STAMP}-${HOST_SLUG}"
mkdir -p "$OUT_DIR"

ENCODED="$(python3 -c "import urllib.parse; print(urllib.parse.quote('${BASE_URL}/', safe=''))")"

export BYPASS_HEADER=""
if [[ "$HOST" == *loca.lt ]]; then
  export BYPASS_HEADER=1
fi

fetch() {
  local path="$1"
  local out="$2"
  local url="${BASE_URL}${path}"
  echo "→ GET $url"
  curl -sSL -m 30 -A "WebForge-Audit/1.0" \
    ${BYPASS_HEADER:+ -H "Bypass-Tunnel-Reminder: true"} \
    "$url" -o "$out" || echo "(fetch failed)" > "$out"
}

CAPTURED=()
for path in "${PATHS[@]}"; do
  slug="$(slugify_path "$path")"
  out="${OUT_DIR}/view-source-${slug}.html"
  fetch "$path" "$out"
  CAPTURED+=("$path|$slug")
done

{
  echo "# Audit capture — $HOST"
  echo ""
  echo "- **Date (UTC):** $STAMP"
  echo "- **Base URL:** $BASE_URL"
  echo "- **Paths audited:** ${PATHS[*]}"
  echo ""
  echo "## Step 1 — view-source files"
  echo ""
  for entry in "${CAPTURED[@]}"; do
    path="${entry%%|*}"
    slug="${entry##*|}"
    echo "- [\`${path}\`](./view-source-${slug}.html) → \`view-source-${slug}.html\`"
  done
  echo ""
  echo "## Step 1 — automated signals"
  echo ""
  python3 - "$OUT_DIR" <<'PY'
import re, sys
from pathlib import Path

out = Path(sys.argv[1])

def check(name, html):
    has_form = 'data-form="' in html or "data-form='" in html
    return {
        "file": name,
        "bytes": len(html),
        "lang_cs": 'lang="cs"' in html,
        "viewport": "viewport" in html,
        "turnstile_attr": "data-turnstile-site-key" in html,
        "turnstile_mount": "data-turnstile" in html,
        "test_turnstile_key": "1x00000000000000000000AA" in html,
        "http_assets": len(re.findall(r'(?:src|href)=["\']http://', html, re.I)),
        "form_js": "/form.js" in html,
        "json_ld": "application/ld+json" in html,
        "has_form": has_form,
    }

for path in sorted(out.glob("view-source-*.html")):
    html = path.read_text(errors="ignore")
    data = check(path.name, html)
    print(f"### {path.name}\n")
    for k, v in data.items():
        if k == "file":
            continue
        flag = ""
        if k == "test_turnstile_key" and v:
            flag = "⚠️ prod blocker"
        if k == "http_assets" and v:
            flag = "⚠️ mixed content"
        if k == "has_form" and v and not data["turnstile_mount"]:
            flag = "⚠️ form without Turnstile mount"
        print(f"- **{k}:** {v} {flag}")
    print()
PY
  echo "## Response headers (homepage)"
  echo ""
  echo '```'
  curl -sSI -m 20 -A "WebForge-Audit/1.0" \
    ${BYPASS_HEADER:+ -H "Bypass-Tunnel-Reminder: true"} \
    "$BASE_URL/" | sed -n '1,30p' || echo "(header fetch failed)"
  echo '```'
  echo ""
  echo "## Step 2 — multi-perspective review (agent / optional LLM passes)"
  echo ""
  echo "Review **each saved HTML file** from three angles:"
  echo "1. **Security** — CSP, Turnstile on forms, secrets, third-party scripts"
  echo "2. **Performance** — payload size, scripts, images, LCP"
  echo "3. **SEO / a11y** — meta, headings, structured data, mobile nav"
  echo ""
  echo "Mark findings: \`OK\` / \`WARN\` / \`BLOCK\`."
  echo ""
  echo "## Step 3 — external scanners (site-wide; re-run per major URL after deploy)"
  echo ""
  echo "| Tool | Link |"
  echo "| --- | --- |"
  echo "| PageSpeed | https://pagespeed.web.dev/analysis?url=${ENCODED} |"
  echo "| Security Headers | https://securityheaders.com/?q=${ENCODED}&followRedirects=on |"
  echo "| Mozilla Observatory | https://observatory.mozilla.org/analyze/${HOST} |"
  echo "| SSL Labs | https://www.ssllabs.com/ssltest/analyze.html?d=${HOST} |"
  echo ""
  echo "## Turnstile checklist (any page with a form)"
  echo ""
  echo "- [ ] \`data-turnstile-site-key\` on \`<body>\` (prod: real key, not test key)"
  echo "- [ ] \`<div data-turnstile />\` inside every \`[data-form]\`"
  echo "- [ ] \`/form.js\` loaded from layout"
  echo "- [ ] Production env: \`TURNSTILE_SECRET_KEY\` + \`NEXT_PUBLIC_TURNSTILE_SITE_KEY\`"
} > "$OUT_DIR/REPORT.md"

echo ""
echo "Audit saved to: $OUT_DIR"
echo "Report: $OUT_DIR/REPORT.md"
cat "$OUT_DIR/REPORT.md"
