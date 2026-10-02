import { LitElement, html, nothing } from 'lit';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from 'custom-card-helpers';
import localize from './localize';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HassServiceTarget,
  Template,
  VacuumCardConfig,
  VacuumCardShortcut,
  VacuumCardStat,
} from './types';
import styles from './editor.css';

type EditorConfig = Partial<VacuumCardConfig>;

// The card renders `map` *or* `image`, never both, so the editor picks one.
type MediaSource = 'image' | 'map';

/** Editor-only key, never stored in the config. */
const MEDIA_SOURCE_KEY = 'media_source';

const MEDIA_SOURCES: MediaSource[] = ['map', 'image'];

const ACTION_KEYS = [
  'start',
  'pause',
  'resume',
  'stop',
  'locate',
  'return_to_base',
] as const;

const ACTION_LABELS: Record<string, string> = {
  start: 'common.start',
  pause: 'common.pause',
  resume: 'common.continue',
  stop: 'common.stop',
  locate: 'common.locate',
  return_to_base: 'common.return_to_base',
};

/** Keys of `config.stats`; `default` covers every state without a list. */
const STAT_STATES = [
  'default',
  'cleaning',
  'paused',
  'idle',
  'returning',
  'docked',
  'error',
] as const;

interface SchemaItem {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

interface ServiceControlValue {
  action?: string;
  data?: Record<string, unknown>;
  target?: HassServiceTarget;
}

/** Prefilled in the form, and stripped again before storing. */
const DEFAULTS: EditorConfig = {
  map_refresh: 5,
  compact_view: false,
  show_name: true,
  show_status: true,
  show_toolbar: true,
};

/** Stripped before storing, but not prefilled. */
const IMPLICIT_DEFAULTS: EditorConfig = {
  image: 'default',
};

const STAT_SCHEMA: SchemaItem[] = [
  { name: 'entity_id', selector: { entity: {} } },
  { name: 'attribute', selector: { text: {} } },
  { name: 'value_template', selector: { template: {} } },
  { name: 'unit', selector: { text: {} } },
  { name: 'subtitle', selector: { text: {} } },
];

const SHORTCUT_SCHEMA: SchemaItem[] = [
  { name: 'name', selector: { text: {} } },
  { name: 'icon', selector: { icon: {} } },
];

const buildSchema = (
  config: EditorConfig,
  mediaSource: MediaSource,
): SchemaItem[] => [
  {
    name: 'entity',
    required: true,
    selector: { entity: { domain: 'vacuum' } },
  },
  {
    name: 'battery_entity',
    selector: { entity: { domain: 'sensor' } },
  },
  {
    name: MEDIA_SOURCE_KEY,
    selector: {
      select: {
        mode: 'box',
        options: MEDIA_SOURCES.map((source) => ({
          value: source,
          label: localize(`editor.media_source_${source}`) ?? source,
        })),
      },
    },
  },
  ...(mediaSource === 'map'
    ? [
        {
          name: 'map',
          selector: { entity: { domain: ['camera', 'image'] } },
        },
        ...(config.map
          ? [
              {
                name: 'map_refresh',
                selector: {
                  number: {
                    min: 1,
                    max: 3600,
                    mode: 'box',
                    unit_of_measurement: 's',
                  },
                },
              },
            ]
          : []),
      ]
    : [
        {
          name: 'image',
          selector: { text: {} },
        },
      ]),
  { name: 'compact_view', selector: { boolean: {} } },
  { name: 'show_name', selector: { boolean: {} } },
  { name: 'show_status', selector: { boolean: {} } },
  { name: 'show_toolbar', selector: { boolean: {} } },
];

const toServiceControl = (action?: {
  service?: string;
  service_data?: Record<string, unknown>;
  target?: HassServiceTarget;
}): ServiceControlValue => ({
  action: action?.service ?? '',
  data: action?.service_data,
  target: action?.target,
});

const fromServiceControl = (value?: ServiceControlValue) => {
  if (!value?.action) {
    return undefined;
  }
  const hasData = value.data && Object.keys(value.data).length > 0;
  const hasTarget = value.target && Object.keys(value.target).length > 0;
  return {
    service: value.action,
    ...(hasData ? { service_data: value.data } : {}),
    ...(hasTarget ? { target: value.target } : {}),
  };
};

const isEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && Object.keys(value as object).length === 0);

@customElement('vacuum-card-editor')
export class VacuumCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: EditorConfig;

  @state() private _mediaSource: MediaSource = 'image';

  public setConfig(config: LovelaceCardConfig & VacuumCardConfig): void {
    // Must not fire `config-changed`: Lovelace calls this while applying a
    // config, and echoing back loops. Stubs come from `getStubConfig`.
    this._config = { ...config };
    // Lovelace echoes the config back here, so only derive when it is
    // unambiguous — otherwise a deliberate choice gets clobbered.
    if (config.map) {
      this._mediaSource = 'map';
    } else if (config.image) {
      this._mediaSource = 'image';
    }
  }

  protected render(): Template {
    // `hass` and the config arrive as separate assignments; rendering before
    // both are set is what crashed the editor (#1091, #1174).
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{
          ...DEFAULTS,
          ...this._config,
          [MEDIA_SOURCE_KEY]: this._mediaSource,
        }}
        .schema=${buildSchema(this._config, this._mediaSource)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>

      ${this._renderPanel('actions', this._renderActions)}
      ${this._renderPanel('shortcuts', this._renderShortcuts)}
      ${this._renderPanel('stats', this._renderStats)}
    `;
  }

  private _renderPanel(id: string, content: () => Template): Template {
    return html`
      <ha-expansion-panel
        outlined
        .header=${localize(`editor.section_${id}`)}
        .secondary=${localize(`editor.section_${id}_helper`)}
      >
        ${content.call(this)}
      </ha-expansion-panel>
    `;
  }

  private _renderActions(): Template {
    const actions = this._config?.actions ?? {};

    return html`
      <div class="panel-content">
        ${ACTION_KEYS.map((key) => {
          const configured = Boolean(actions[key]?.service);
          return html`
            <ha-expansion-panel
              outlined
              .header=${localize(ACTION_LABELS[key]) ?? key}
              .secondary=${
                configured
                  ? actions[key].service
                  : localize('editor.action_default')
              }
            >
              <div class="panel-content">
                <ha-service-control
                  .hass=${this.hass}
                  .value=${toServiceControl(actions[key])}
                  @value-changed=${(
                    event: CustomEvent<{ value: ServiceControlValue }>,
                  ) => this._actionChanged(key, event)}
                ></ha-service-control>
              </div>
            </ha-expansion-panel>
          `;
        })}
      </div>
    `;
  }

  private _actionChanged(
    key: string,
    event: CustomEvent<{ value: ServiceControlValue }>,
  ): void {
    event.stopPropagation();
    const actions = { ...(this._config?.actions ?? {}) };
    const action = fromServiceControl(event.detail.value);
    if (action) {
      actions[key] = action;
    } else {
      delete actions[key];
    }
    this._commit({ ...this._config, actions });
  }

  private _renderShortcuts(): Template {
    const shortcuts = this._config?.shortcuts ?? [];

    return html`
      <div class="panel-content">
        ${shortcuts.map((shortcut, index) => {
          return html`
            <ha-expansion-panel
              outlined
              .header=${
                shortcut.name || `${localize('editor.shortcut')} ${index + 1}`
              }
              .secondary=${shortcut.service}
            >
              <div class="panel-content">
                <ha-form
                  .hass=${this.hass}
                  .data=${shortcut}
                  .schema=${SHORTCUT_SCHEMA}
                  .computeLabel=${this._computeShortcutLabel}
                  @value-changed=${(
                    event: CustomEvent<{
                      value: Partial<VacuumCardShortcut>;
                    }>,
                  ) => {
                    event.stopPropagation();
                    this._shortcutChanged(index, event.detail.value);
                  }}
                ></ha-form>
                <ha-service-control
                  .hass=${this.hass}
                  .value=${toServiceControl(shortcut)}
                  @value-changed=${(
                    event: CustomEvent<{ value: ServiceControlValue }>,
                  ) => {
                    event.stopPropagation();
                    this._shortcutChanged(
                      index,
                      fromServiceControl(event.detail.value) ?? {
                        service: undefined,
                        service_data: undefined,
                        target: undefined,
                      },
                    );
                  }}
                ></ha-service-control>
                <div class="row-actions">
                  <ha-button
                    destructive
                    @click=${() => this._removeShortcut(index)}
                  >
                    ${localize('editor.remove')}
                  </ha-button>
                </div>
              </div>
            </ha-expansion-panel>
          `;
        })}
        <div class="row-actions">
          <ha-button @click=${this._addShortcut}>
            ${localize('editor.add_shortcut')}
          </ha-button>
        </div>
      </div>
    `;
  }

  private _shortcutChanged(
    index: number,
    patch: Partial<VacuumCardShortcut>,
  ): void {
    const shortcuts = [...(this._config?.shortcuts ?? [])];
    const merged = { ...shortcuts[index], ...patch } as VacuumCardShortcut;
    for (const key of Object.keys(merged) as (keyof VacuumCardShortcut)[]) {
      if (isEmpty(merged[key])) {
        delete merged[key];
      }
    }
    shortcuts[index] = merged;
    this._commit({ ...this._config, shortcuts });
  }

  private _addShortcut = (): void => {
    this._commit({
      ...this._config,
      shortcuts: [...(this._config?.shortcuts ?? []), {}],
    });
  };

  private _removeShortcut(index: number): void {
    const shortcuts = [...(this._config?.shortcuts ?? [])];
    shortcuts.splice(index, 1);
    this._commit({ ...this._config, shortcuts });
  }

  private _renderStats(): Template {
    const stats = this._config?.stats ?? {};

    return html`
      <div class="panel-content">
        ${STAT_STATES.map((stateKey) => {
          const rows = stats[stateKey] ?? [];
          const label =
            stateKey === 'default'
              ? localize('editor.stats_default')
              : (localize(`status.${stateKey}`) ?? stateKey);
          return html`
            <ha-expansion-panel
              outlined
              .header=${label}
              .secondary=${
                rows
                  .map((row) => row.subtitle || row.attribute || row.entity_id)
                  .filter(Boolean)
                  .join(', ') || localize('editor.stats_empty')
              }
            >
              <div class="panel-content">
                ${rows.map(
                  (row, index) => html`
                    <div class="stat-row">
                      <ha-form
                        .hass=${this.hass}
                        .data=${row}
                        .schema=${STAT_SCHEMA}
                        .computeLabel=${this._computeStatLabel}
                        @value-changed=${(
                          event: CustomEvent<{ value: VacuumCardStat }>,
                        ) => {
                          event.stopPropagation();
                          this._statChanged(
                            stateKey,
                            index,
                            event.detail.value,
                          );
                        }}
                      ></ha-form>
                      <div class="row-actions">
                        <ha-button
                          destructive
                          @click=${() => this._removeStat(stateKey, index)}
                        >
                          ${localize('editor.remove')}
                        </ha-button>
                      </div>
                    </div>
                  `,
                )}
                <div class="row-actions">
                  <ha-button @click=${() => this._addStat(stateKey)}>
                    ${localize('editor.add_stat')}
                  </ha-button>
                </div>
              </div>
            </ha-expansion-panel>
          `;
        })}
      </div>
    `;
  }

  private _statChanged(
    stateKey: string,
    index: number,
    value: VacuumCardStat,
  ): void {
    const stats = { ...(this._config?.stats ?? {}) };
    const rows = [...(stats[stateKey] ?? [])];
    const row = { ...value };
    for (const key of Object.keys(row) as (keyof VacuumCardStat)[]) {
      if (isEmpty(row[key])) {
        delete row[key];
      }
    }
    rows[index] = row;
    stats[stateKey] = rows;
    this._commit({ ...this._config, stats });
  }

  private _addStat(stateKey: string): void {
    const stats = { ...(this._config?.stats ?? {}) };
    stats[stateKey] = [...(stats[stateKey] ?? []), {}];
    this._commit({ ...this._config, stats });
  }

  private _removeStat(stateKey: string, index: number): void {
    const stats = { ...(this._config?.stats ?? {}) };
    const rows = [...(stats[stateKey] ?? [])];
    rows.splice(index, 1);
    stats[stateKey] = rows;
    this._commit({ ...this._config, stats });
  }

  private _computeLabel = (schema: SchemaItem): string =>
    localize(`editor.${schema.name}`) ?? schema.name;

  private _computeHelper = (schema: SchemaItem): string | undefined =>
    localize(`editor.${schema.name}_helper`);

  private _computeStatLabel = (schema: SchemaItem): string =>
    localize(`editor.stat_${schema.name}`) ?? schema.name;

  private _computeShortcutLabel = (schema: SchemaItem): string =>
    localize(`editor.shortcut_${schema.name}`) ?? schema.name;

  private _valueChanged(
    event: CustomEvent<{
      value: EditorConfig & { [MEDIA_SOURCE_KEY]?: MediaSource };
    }>,
  ): void {
    event.stopPropagation();

    if (!this._config || !this.hass) {
      return;
    }

    const { [MEDIA_SOURCE_KEY]: mediaSource, ...rest } = event.detail.value;
    const config: EditorConfig = { ...rest };

    if (mediaSource && mediaSource !== this._mediaSource) {
      this._mediaSource = mediaSource;
      if (mediaSource === 'map') {
        delete config.image;
      } else {
        delete config.map;
        delete config.map_refresh;
      }
    }

    const defaults = { ...DEFAULTS, ...IMPLICIT_DEFAULTS };
    for (const key of Object.keys(defaults) as (keyof EditorConfig)[]) {
      if (config[key] === defaults[key] || config[key] === '') {
        delete config[key];
      }
    }
    if (!config.map) {
      delete config.map;
      delete config.map_refresh;
    }
    if (!config.battery_entity) {
      delete config.battery_entity;
    }

    this._commit(config);
  }

  /** Strips defaults and empty containers so the stored YAML stays minimal. */
  private _commit(config: EditorConfig): void {
    const next: EditorConfig = { ...config };

    if (next.stats) {
      const stats = Object.fromEntries(
        Object.entries(next.stats).filter(([, rows]) => rows.length > 0),
      );
      if (Object.keys(stats).length) {
        next.stats = stats;
      } else {
        delete next.stats;
      }
    }
    if (next.actions && !Object.keys(next.actions).length) {
      delete next.actions;
    }
    if (next.shortcuts && !next.shortcuts.length) {
      delete next.shortcuts;
    }

    if (JSON.stringify(next) === JSON.stringify(this._config)) {
      return;
    }

    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  static get styles() {
    return styles;
  }
}
