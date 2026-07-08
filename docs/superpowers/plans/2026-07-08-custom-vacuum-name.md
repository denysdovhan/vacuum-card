# Custom Vacuum Name Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `name` config field to `vacuum-card` that overrides the displayed vacuum name, falling back to the entity's `friendly_name` when unset.

**Architecture:** Thread a new `name: string` field through the existing config pipeline (`types.ts` → `config.ts` → `vacuum-card.ts` render) exactly the way other optional string fields (`battery_entity`, `map`) already flow, then expose it in the visual editor and docs.

**Tech Stack:** TypeScript, Lit (`LitElement`), Rollup build, no unit test framework (verification is `npm run lint` + `npm run build` + manual check via `npm start`).

## Global Constraints

- Config key is exactly `name` (not `custom_name`).
- Default value is `''` (empty string) — meaning "no override, use entity's `friendly_name`" — set via `config.name ?? ''` in `buildConfig()`, matching the existing pattern for `battery_entity`/`map`.
- `renderName()` must prefer `this.config.name` over `friendly_name` only when `this.config.name` is truthy (i.e. `this.config.name || friendly_name`); `show_name` continues to gate visibility exactly as before.
- The editor's new `paper-input` binds directly to `.value=${this.config.name}` — no separate `@state()` tracking field (unlike the existing `image` field's local `@state() private image?`).
- Editor field placement: immediately after the `map` `ha-select` block and before the existing `image` `paper-input`.
- Add exactly one new translation key, `editor.name`, to `src/translations/en.json` only. Do not touch any other locale file — `scripts/validate-i18n` only fails on keys present in a locale but missing from `en.json`, never the reverse, and `localize.ts` falls back to English for missing keys.
- No unit test suite exists in this repo. Every task's automated verification is `npm run lint` and `npm run build` (both must exit 0 with no new warnings).

---

### Task 1: Add `name` to config schema and card rendering

**Files:**

- Modify: `src/types.ts:63-76` (the `VacuumCardConfig` interface)
- Modify: `src/config.ts:20-33` (the object returned by `buildConfig()`)
- Modify: `src/vacuum-card.ts:396-404` (`renderName()`)

**Interfaces:**

- Produces: `VacuumCardConfig.name: string` — a required-but-defaultable field (always present after `buildConfig()` runs, default `''`). Task 2's editor code reads/writes `this.config.name` and assumes this exact field name and type.

- [ ] **Step 1: Add the `name` field to `VacuumCardConfig`**

  In `src/types.ts`, the interface currently reads:

  ```ts
  export interface VacuumCardConfig {
    entity: string;
    battery_entity: string;
    map: string;
    map_refresh: number;
    image: string;
    show_name: boolean;
    show_status: boolean;
    show_toolbar: boolean;
    compact_view: boolean;
    stats: Record<string, VacuumCardStat[]>;
    actions: Record<string, VacuumCardAction>;
    shortcuts: VacuumCardShortcut[];
  }
  ```

  Change it to:

  ```ts
  export interface VacuumCardConfig {
    entity: string;
    name: string;
    battery_entity: string;
    map: string;
    map_refresh: number;
    image: string;
    show_name: boolean;
    show_status: boolean;
    show_toolbar: boolean;
    compact_view: boolean;
    stats: Record<string, VacuumCardStat[]>;
    actions: Record<string, VacuumCardAction>;
    shortcuts: VacuumCardShortcut[];
  }
  ```

- [ ] **Step 2: Default `name` in `buildConfig()`**

  In `src/config.ts`, the returned object currently reads:

  ```ts
  return {
    entity: config.entity,
    battery_entity: config.battery_entity ?? '',
    map: config.map ?? '',
    map_refresh: config.map_refresh ?? 5,
    image: config.image ?? 'default',
    show_name: config.show_name ?? true,
    show_status: config.show_status ?? true,
    show_toolbar: config.show_toolbar ?? true,
    compact_view: config.compact_view ?? false,
    stats: config.stats ?? {},
    actions: config.actions ?? {},
    shortcuts: config.shortcuts ?? [],
  };
  ```

  Change it to:

  ```ts
  return {
    entity: config.entity,
    name: config.name ?? '',
    battery_entity: config.battery_entity ?? '',
    map: config.map ?? '',
    map_refresh: config.map_refresh ?? 5,
    image: config.image ?? 'default',
    show_name: config.show_name ?? true,
    show_status: config.show_status ?? true,
    show_toolbar: config.show_toolbar ?? true,
    compact_view: config.compact_view ?? false,
    stats: config.stats ?? {},
    actions: config.actions ?? {},
    shortcuts: config.shortcuts ?? [],
  };
  ```

- [ ] **Step 3: Prefer the config override in `renderName()`**

  In `src/vacuum-card.ts`, `renderName()` currently reads:

  ```ts
  private renderName(): Template {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.config.show_name) {
      return nothing;
    }

    return html` <div class="vacuum-name">${friendly_name}</div> `;
  }
  ```

  Change the return statement to prefer `this.config.name`:

  ```ts
  private renderName(): Template {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.config.show_name) {
      return nothing;
    }

    return html`
      <div class="vacuum-name">${this.config.name || friendly_name}</div>
    `;
  }
  ```

- [ ] **Step 4: Type-check and build**

  Run: `npm run build`
  Expected: exits 0, no TypeScript errors, `dist/vacuum-card.js` is (re)generated.

- [ ] **Step 5: Lint**

  Run: `npm run lint`
  Expected: exits 0 (ESLint and `validate-i18n` both pass — this step doesn't touch translations yet, so `validate-i18n` output should be unchanged: `Translation keys are consistent with en.json.`).

- [ ] **Step 6: Commit**

  ```bash
  git add src/types.ts src/config.ts src/vacuum-card.ts
  git commit -m "feat: add name config field to override displayed vacuum name"
  ```

---

### Task 2: Expose `name` in the visual editor, add translation key, update README

**Files:**

- Modify: `src/editor.ts:99-125` (insert new `paper-input` block between the `map` `ha-select` and the `image` `paper-input`)
- Modify: `src/translations/en.json:65-83` (the `editor` section)
- Modify: `README.md:109-123` (the config options table)

**Interfaces:**

- Consumes: `VacuumCardConfig.name: string` (from Task 1) and `localize()` from `src/localize.ts` (existing signature: `localize(str: string): string | undefined`).

- [ ] **Step 1: Add the `editor.name` translation key**

  In `src/translations/en.json`, the `editor` section currently starts:

  ```json
    "editor": {
      "entity": "Entity (Required)",
      "battery_entity": "Battery Entity (Optional)",
      "map": "Map Camera (Optional)",
      "image": "Image (Optional)",
  ```

  Add a `name` key right after `map` and before `image`:

  ```json
    "editor": {
      "entity": "Entity (Required)",
      "name": "Name (Optional)",
      "battery_entity": "Battery Entity (Optional)",
      "map": "Map Camera (Optional)",
      "image": "Image (Optional)",
  ```

- [ ] **Step 2: Add the `paper-input` for `name` in the editor**

  In `src/editor.ts`, between the `map` `ha-select` block (ending at line 116 with `</div>`) and the `image` `paper-input` block (starting at line 118), the code currently reads:

  ```html
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.image')}"
            .value=${this.image}
            .configValue=${'image'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
  ```

  Insert a new `name` input block before the `image` block:

  ```html
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.name')}"
            .value=${this.config.name}
            .configValue=${'name'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.image')}"
            .value=${this.image}
            .configValue=${'image'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
  ```

- [ ] **Step 3: Add the `name` row to the README options table**

  In `README.md`, the options table currently reads:

  ```markdown
  | Name             |   Type   | Default      | Description                                                                |
  | ---------------- | :------: | ------------ | -------------------------------------------------------------------------- |
  | `type`           | `string` | **Required** | `custom:vacuum-card`                                                       |
  | `entity`         | `string` | **Required** | An entity_id within the `vacuum` domain.                                   |
  | `battery_entity` | `string` | Optional     | An entity_id within the `sensor` domain to display battery state and icon. |
  ```

  Insert a `name` row right after the `entity` row:

  ```markdown
  | Name             |   Type   | Default      | Description                                                                |
  | ---------------- | :------: | ------------ | -------------------------------------------------------------------------- |
  | `type`           | `string` | **Required** | `custom:vacuum-card`                                                       |
  | `entity`         | `string` | **Required** | An entity_id within the `vacuum` domain.                                   |
  | `name`           | `string` | Optional     | Custom name to display instead of the entity's friendly name.              |
  | `battery_entity` | `string` | Optional     | An entity_id within the `sensor` domain to display battery state and icon. |
  ```

- [ ] **Step 4: Type-check and build**

  Run: `npm run build`
  Expected: exits 0, no TypeScript errors.

- [ ] **Step 5: Lint (including translation validation)**

  Run: `npm run lint`
  Expected: exits 0. In particular, `npm run lint:translations` (`node scripts/validate-i18n`) must still print `Translation keys are consistent with en.json.` — adding `editor.name` only to `en.json` does not create an "extra key" in any other locale, so this must not fail.

- [ ] **Step 6: Manual verification**

  Run: `npm start` (serves `dist/` at `http://localhost:5000`), add `http://localhost:5000/vacuum-card.js` as a Lovelace resource in a real Home Assistant dev instance, then check:
  1. With no `name` set in the card's YAML config, the card header shows the vacuum entity's `friendly_name` (unchanged behavior).
  2. Adding `name: Custom Label` to the YAML config changes the card header to "Custom Label".
  3. Removing `name` from the YAML reverts the header to the entity's `friendly_name`.
  4. Setting `show_name: false` hides the name entirely, regardless of `name`.
  5. In the visual card editor (UI mode, not YAML), the new "Name (Optional)" field appears after the Map Camera field and before the Image field; typing into it updates the YAML `name:` value; clearing it removes the override.

- [ ] **Step 7: Commit**

  ```bash
  git add src/editor.ts src/translations/en.json README.md
  git commit -m "feat: expose name field in visual editor and document it"
  ```
