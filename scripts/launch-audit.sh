#!/usr/bin/env bash
# Pre-launch audit helper — view-source capture, header check, scanner links.
# Usage: ./scripts/launch-audit.sh https://www.example.cz [contact-path]
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <base-url> [contact-path]" >&2
  echo "Example: $0 https://www.otevru.cz /kontakt" >&2
  exit 1
fi

BASE_URL="${1%/}"
CONTACT_PATH="${2:-/kontakt}"
HOST="$(printf '%s' "$BASE_URL" | sed -E 's#^https?://([^/]+).*#\1#')"
SLUG="$(printf '%s' "$HOST" | tr '.' '-')"
STAMP="$(date -u +%Y-%m-%dT%H%M%SZ)"
OUT_DIR="$(dirname "$0")/../docs/audit/${STAMP}-${SLUG}"
mkdir -p "$OUT_DIR"

ENCODED="$(python3 -c "import urllib.parse; print(urllib.parse.quote('$BASE_URL/', safe=''))")"

fetch() {
  local path="$1"
  local out="$2"
  local url="${BASE_URL}${path}"
  echo "→ GET $url"
  curl -sSL -m 30 -A "WebForge-Audit/1.0" \
    ${BYPASS_HEADER:+ -H "Bypass-Tunnel-Reminder: true"} \
    "$url" -o "$out" || echo "(fetch failed)" > "$out"
}

export BYPASS_HEADER=""
if [[ "$HOST" == *loca.lt ]]; then
  export BYPASS_HEADER=1
fi

fetch "/" "$OUT_DIR/view-source-home.html"
fetch "$CONTACT_PATH" "$OUT_DIR/view-source-contact.html"

{
  echo "# Audit capture — $HOST"
  echo ""
  echo "- **Date (UTC):** $STAMP"
  echo "- **Base URL:** $BASE_URL"
  echo "- **Contact path:** $CONTACT_PATH"
  echo ""
  echo "## Step 1 — view-source files"
  echo ""
  echo "- [\`view-source-home.html\`](./view-source-home.html)"
  echo "- [\`view-source-contact.html\`](./view-source-contact.html)"
  echo ""
  echo "## Step 1 — automated signals"
  echo ""
  python3 - "$OUT_DIR" <<'PY'
import re, sys
from pathlib import Path

out = Path(sys.argv[1])

def check(name, html):
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
    }

for path in sorted(out.glob("view-source-*.html")):
    html = path.read_text(errors="ignore")
    data = check(path.name, html)
    print(f"### {path.name}\n")
    for k, v in data.items():
        if k == "file":
            continue
        flag = "⚠️" if (k == "test_turnstile_key" and v) or (k == "http_assets" and v) else ""
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
  echo "## Step 2 — multi-model review (manual / agent)"
  echo ""
  echo "Review saved HTML from three perspectives:"
  echo "1. **Security** — CSP, Turnstile, secrets, third-party scripts"
  echo "2. **Performance** — HTML size, script count, images"
  echo "3. **SEO / a11y** — meta, headings, structured data"
  echo ""
  echo "## Step 3 — external scanners"
  echo ""
  echo "| Tool | Link |"
  echo "| --- | --- |"
  echo "| PageSpeed | https://pagespeed.web.dev/analysis?url=${ENCODED} |"
  echo "| Security Headers | https://securityheaders.com/?q=${ENCODED}&followRedirects=on |"
  echo "| Mozilla Observatory | https://observatory.mozilla.org/analyze/${HOST} |"
  echo "| SSL Labs | https://www.ssllabs.com/ssltest/analyze.html?d=${HOST} |"
  echo ""
  echo "## Turnstile checklist"
  echo ""
  echo "- [ ] \`data-turnstile-site-key\` in HTML (production: real key, not test key)"
  echo "- [ ] \`data-turnstile\` mount on contact form"
  echo "- [ ] \`/form.js\` loaded"
  echo "- [ ] Production env: \`TURNSTILE_SECRET_KEY\` + \`NEXT_PUBLIC_TURNSTILE_SITE_KEY\`"
} > "$OUT_DIR/REPORT.md"

echo ""
echo "Audit saved to: $OUT_DIR"
echo "Report: $OUT_DIR/REPORT.md"
cat "$OUT_DIR/REPORT.md"
