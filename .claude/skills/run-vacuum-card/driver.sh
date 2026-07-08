#!/usr/bin/env bash
# Builds vacuum-card, serves the harness over loopback, and drives it with
# headless Chrome (dump-dom for the PASS/FAIL assertions, screenshot for a
# visual check). See SKILL.md in this directory for context.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"
# Randomized default port: a fixed default risks colliding with an orphaned
# server left behind by a prior interrupted run (seen in practice - the
# harness process outlived its parent script's EXIT trap once when the
# surrounding session was reset mid-run). Override with
# VACUUM_CARD_HARNESS_PORT if you need a fixed port.
PORT="${VACUUM_CARD_HARNESS_PORT:-$((20000 + RANDOM % 20000))}"
WORKDIR="$(mktemp -d /tmp/vacuum-card-harness.XXXXXX)"
SCREENSHOT="${VACUUM_CARD_HARNESS_SCREENSHOT:-/tmp/vacuum-card-harness-screenshot.png}"
SERVER_PID=""

cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

echo "==> Building (npm run build)"
(cd "$ROOT" && npm run build >/dev/null)

cp "$ROOT/dist/vacuum-card.js" "$WORKDIR/"
cp "$SKILL_DIR/harness.html" "$WORKDIR/"

echo "==> Serving $WORKDIR on 127.0.0.1:$PORT"
# --directory avoids `(cd "$WORKDIR" && python3 ...) &`, which backgrounds a
# subshell rather than python3 itself on some bash builds - $! would then be
# the wrong pid to kill in cleanup().
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$WORKDIR" \
  >/tmp/vacuum-card-harness-server.log 2>&1 &
SERVER_PID=$!
timeout 15 bash -c "until curl -sf http://127.0.0.1:$PORT/harness.html >/dev/null; do sleep 0.5; done"

echo "==> Running assertions (headless Chrome, dump-dom)"
DOM="$(google-chrome --headless=new --disable-gpu --no-sandbox \
  --virtual-time-budget=4000 --dump-dom "http://127.0.0.1:$PORT/harness.html")"
OUTPUT="$(printf '%s\n' "$DOM" | sed -n '/<pre id="output">/,/<\/pre>/p' | sed '1s/.*<pre id="output">//; $s/<\/pre>.*//')"
echo "$OUTPUT"

echo "==> Screenshot -> $SCREENSHOT"
google-chrome --headless=new --disable-gpu --no-sandbox --window-size=800,420 \
  --virtual-time-budget=3000 --screenshot="$SCREENSHOT" \
  "http://127.0.0.1:$PORT/harness.html" >/dev/null

if printf '%s\n' "$OUTPUT" | grep -q '^FAIL'; then
  echo "==> FAILURES FOUND"
  exit 1
fi

echo "==> All checks passed"
