# Custom vacuum name field

## Problem

The card always shows the vacuum entity's `friendly_name` as its header (in `renderName()`). Users have no way to display a different label on the card without renaming the entity itself in Home Assistant, which affects the entity everywhere else too.

## Goal

Add an optional `name` config field to the card. When set, it overrides the displayed name; when unset, the card falls back to the entity's `friendly_name` (current behavior). The `show_name` toggle continues to control visibility, unchanged.

## Design

### Config shape

- `src/types.ts`: add `name: string;` to the `VacuumCardConfig` interface.
- `src/config.ts`: in `buildConfig()`, default it with `name: config.name ?? ''`. Empty string means "no override, use entity's friendly_name" — consistent with how other optional strings (`battery_entity`, `map`) are defaulted in this file.

### Rendering

- `src/vacuum-card.ts`, `renderName()`: currently reads `friendly_name` from `getAttributes(this.entity)` unconditionally. Change to prefer the config override:

  ```ts
  private renderName(): Template {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.config.show_name) {
      return nothing;
    }

    return html` <div class="vacuum-name">${this.config.name || friendly_name}</div> `;
  }
  ```

  No other rendering logic changes. `show_name` still gates visibility exactly as today.

### Visual editor

- `src/editor.ts`: add a `paper-input` for `name`, placed immediately after the entity/battery/map `ha-select` blocks and before the existing `image` input — grouping "what identifies this vacuum" fields together before the display-toggle switches. Wired identically to the existing `image` field:

  ```html
  <div class="option">
    <paper-input
      label="${localize('editor.name')}"
      .value=${this.config.name}
      .configValue=${'name'}
      @value-changed=${this.valueChanged}
    ></paper-input>
  </div>
  ```

  No new component state field is needed (unlike `image`, which uses a local `@state() private image?` — `name` can bind directly to `this.config.name` since it doesn't need a separate default-tracking variable).

### Localization

- `src/translations/en.json`: add `editor.name` key (e.g. `"Name"`) for the editor field label.
- No other locale files need updating. Per the existing i18n fallback (`src/localize.ts`) and validator (`scripts/validate-i18n`), missing keys in non-English locales fall back to English; the validator only fails on _extra_ keys not present in `en.json`, not missing ones.

### Documentation

- `README.md`: add a `name` row to the top-level config options table, next to `entity`/`battery_entity`/etc., describing it as an optional override for the displayed name (default: entity's friendly name).

## Out of scope

- No changes to `stats`, `actions`, or `shortcuts`.
- No changes to how `show_name` behaves.
- No new translation keys beyond the one editor label.

## Testing / verification

No unit test suite exists in this repo; verification is:

1. `npm run lint` and `npm run build` pass.
2. Manual check via `npm start` + a local Lovelace dev instance: setting `name: Custom Label` in YAML overrides the card header; removing it falls back to the entity's `friendly_name`; toggling `show_name` off still hides the name entirely; the visual editor's new "Name" field round-trips correctly (typing updates YAML, clearing reverts to blank/no override).
