---
name: run-vacuum-card
description: Build vacuum-card and drive it in headless Chrome to check rendering, config behavior, and the visual editor without a live Home Assistant instance. Use when asked to run vacuum-card, verify a change to it, take a screenshot of its card/editor UI, or smoke-test its config options.
---

vacuum-card is a Home Assistant Lovelace custom card (Lit web component, bundled by Rollup into a single `dist/vacuum-card.js`). It only renders inside HA's frontend in production, so it's driven here via `.claude/skills/run-vacuum-card/driver.sh`, which builds the card, serves a small HTML harness (`harness.html`, same directory) that stubs the minimal `hass` object the card reads, and drives it with headless Chrome — no live Home Assistant instance needed.

All paths below are relative to the repo root.

## Prerequisites

Already present in this container — nothing extra to install:

```bash
python3 --version   # any Python 3 (used only for `http.server`)
google-chrome --version
```

`google-chrome` is used directly with `--headless=new`; no `chromium-cli`/Playwright/Puppeteer is installed in this environment, and none is required.

## Setup / Build

```bash
npm install   # one-time
```

The driver runs `npm run build` itself before every drive, so there's no separate manual build step.

## Run (agent path)

```bash
bash .claude/skills/run-vacuum-card/driver.sh
```

This: builds the card (`npm run build`), copies `dist/vacuum-card.js` and `harness.html` into a temp dir, serves that dir on `127.0.0.1:<random port>` (override with `VACUUM_CARD_HARNESS_PORT` to pin a fixed port), then:

1. Runs `google-chrome --headless=new --dump-dom` against the harness and prints its `#output` block — a PASS/FAIL log of: default render falls back to the entity's `friendly_name`, the `name` config overrides it, `show_name: false` hides the name entirely, the visual editor's `name` field is positioned between Map Camera and Image, and typing/clearing that editor field fires `config-changed` with the right config.
2. Runs `google-chrome --headless=new --screenshot` against the same harness and saves it to `docs/screenshots/vacuum-card-harness-screenshot.png` (override with `VACUUM_CARD_HARNESS_SCREENSHOT`) — two rendered `<vacuum-card>` instances side by side (default name vs. custom name override), so you can visually confirm the card isn't broken, not just check text content. `docs/screenshots/` is gitignored — these are throwaway verification artifacts, not committed docs images.
3. Exits non-zero if any `FAIL` line appears.

Read the screenshot with the Read tool after running — a headless dump-dom pass doesn't catch a broken layout.

To extend coverage (e.g. verifying a different config option), edit the assertions in `harness.html`'s `<script type="module">` — it's a flat, sequential test script, not a framework.

## Run (human path)

```bash
npm start
```

Starts a Rollup watch build serving `dist/` at `http://localhost:5000`. Useless on its own headless — it just serves the built file; a human still needs a real Home Assistant instance with `http://localhost:5000/vacuum-card.js` added as a Lovelace resource to see it rendered against real entities.

## Test

```bash
npm test   # lint (ESLint + scripts/validate-i18n) + build
```

No unit test suite exists in this repo — `npm test` is lint + build only. `driver.sh` above is the way to actually exercise rendering behavior.

## Gotchas

- **`python3 -m http.server` without `--bind 127.0.0.1` gets denied.** The sandbox's auto-mode classifier blocks starting an HTTP server that isn't explicitly loopback-bound (it reads as "exposing a local service to the network"). Always pass `--bind 127.0.0.1`; `driver.sh` already does this.
- **The card can't just be opened as a static HTML file.** `vacuum-card.js` is loaded as an ES module (`<script type="module">`), which browsers refuse to fetch over `file://` (CORS). It must be served over `http://`, even for a throwaway local check.
- **Most Home Assistant custom elements (`ha-select`, `paper-input`, `ha-switch`, `mwc-list-item`, `ha-card`, `ha-icon`, `ha-dropdown`, `ha-spinner`) are undefined outside HA's real frontend.** They render as inert unknown elements — properties like `.value`/`.configValue` set via Lit bindings still work as plain JS properties, but the components' own behavior (e.g. `paper-input` dispatching `value-changed` when a user types) doesn't exist. The harness works around this by setting `.value` directly on the target element and dispatching the same `value-changed`/`config-changed` CustomEvents the real widgets would, which exercises the actual `editor.ts` `valueChanged()` handler rather than mocking it away.
- **`dist/` is a single self-contained bundle.** `inlineDynamicImports: true` in `rollup.config.mjs` means the lazy-loaded `<vacuum-card-editor>` (normally dynamically imported via `getConfigElement()`) and the inlined SVG default image both end up in the one `vacuum-card.js` file — no second file or asset to copy alongside it into the harness dir.
