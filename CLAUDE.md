# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Home Assistant Lovelace custom card (`custom:vacuum-card`) for controlling robot vacuums. Distributed as a single bundled JS file via HACS/manual install; no server-side component.

## Commands

- `npm run start` — Rollup watch build, serves `dist/` at `http://localhost:5000` for local development.
- `npm run build` — Production bundle to `dist/vacuum-card.js` (minified, Terser + HTML literal minification).
- `npm run lint` — Runs `lint:src` (ESLint on `src/`) and `lint:translations` (i18n validation).
- `npm run lint:fix` — Auto-fix ESLint issues in `src/`.
- `npm run format` — Prettier formats the whole repo (single quotes).
- `npm test` — `lint` + `build`. There is no unit test suite/runner in this repo; this is the only correctness gate.
- `node scripts/validate-i18n` — Validates that all files in `src/translations/*.json` have matching keys against `en.json`; run automatically as part of `npm run lint`.

Pre-commit (Husky) runs `lint-staged`: ESLint --fix on `*.js` and Prettier on all staged files. There's no separate CI-only check beyond what `npm test` runs locally.

## Architecture

Entry point is `src/vacuum-card.ts`, which registers two custom elements:

- `<vacuum-card>` (`VacuumCard` class) — the card itself, a `LitElement`.
- `<vacuum-card-editor>` (`src/editor.ts`) — the visual config UI, lazy-loaded via `getConfigElement()` only when a user opens the card editor in Lovelace (keeps it out of the main bundle path until needed).

Key modules and how they connect:

- `src/config.ts` (`buildConfig`) — the single source of truth for defaulting/normalizing user YAML/UI config into a full `VacuumCardConfig`. Called once from `setConfig()`. Throws (localized) errors for missing `entity`.
- `src/types.ts` — re-exports `home-assistant-js-websocket` types and adds card-specific types (`VacuumEntity`, `VacuumCardConfig`, `VacuumCardStat`, `VacuumCardAction`, `VacuumCardShortcut`, etc.). Read this first to understand the config shape end-to-end.
- `src/localize.ts` — resolves `section.key` strings against `src/translations/*.json`, picking language from `localStorage.selectedLanguage` or `navigator.language`, falling back to `en`. Adding a UI string requires adding the key to **every** translation file (or at least `en.json`, since lookups fall back to English) — `validate-i18n` enforces key parity across all locale files.
- `src/styles.css` / `src/editor.css` — imported directly into `.ts` files (via `rollup-plugin-postcss` + `postcss-lit`), not as external stylesheets; `declarations.d.ts` declares the `*.css`/`*.svg` module shims TypeScript needs for this.

Rendering model in `VacuumCard`: `render()` dispatches to a set of `renderX()` methods (`renderMapOrImage`, `renderStats`, `renderToolbar`, `renderSource`, `renderBattery`, `renderStatus`, `renderName`) based on the vacuum entity's current `state` (`cleaning`/`docked`/`paused`/`returning`/etc.) and the resolved config. `renderToolbar` in particular switches on vacuum state to decide which action buttons (start/pause/stop/resume/return_to_base/locate + custom `shortcuts`) are shown. Actions call either the fixed `vacuum.*` domain service (`callVacuumService`) or a user-overridden service from `config.actions` (`callService`), per the `actions` config object documented in the README.

State flow: `hass` is set externally by Lovelace on every state change; `shouldUpdate` uses `hasConfigOrEntityChanged` from `custom-card-helpers` to avoid unnecessary re-renders. `requestInProgress` is local UI state cleared in `updated()` once the entity's actual state changes, used to show a spinner while a service call is in flight.

Build pipeline (`rollup.config.mjs`): single entry (`src/vacuum-card.ts`) bundled to ES module `dist/`, with `PKG_VERSION_VALUE` string-replaced with `package.json` version (or `DEVELOPMENT` in watch mode) at build time — don't hardcode a version elsewhere.

## Conventions from AGENTS.md

- Prefer `home-assistant-js-websocket` for HA types/functions and `custom-card-helpers` for card lifecycle/event utilities over hand-rolling equivalents.
- Kebab-case filenames for components, matching existing `src/` patterns.
- Commit messages follow Conventional Commits (Angular preset), e.g. `feat: ...`, `fix: ...`, `chore(deps): ...` — dependency bumps use `chore(deps): ...` for semantic-release. Releases are automated via semantic-release on `main`, publishing `dist/vacuum-card.js`.
