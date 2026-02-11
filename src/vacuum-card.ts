import { LitElement, html, nothing } from 'lit';
import type { CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  hasConfigOrEntityChanged,
  fireEvent,
  HomeAssistant,
  ServiceCallRequest,
  computeStateDisplay,
  stateIcon,
} from 'custom-card-helpers';
import registerTemplates from 'ha-template';
import get from 'lodash/get';
import localize from './localize';
import styles from './styles.css';
import buildConfig from './config';
import {
  Template,
  VacuumCardAction,
  VacuumCardConfig,
  VacuumEntity,
  HassEntity,
  VacuumBatteryEntity,
  VacuumEntityState,
  VacuumServiceCallParams,
  VacuumActionParams,
} from './types';
import DEFAULT_IMAGE from './vacuum.svg';

registerTemplates();

// String in the right side will be replaced by Rollup
const PKG_VERSION = 'PKG_VERSION_VALUE';

console.info(
  `%c VACUUM-CARD %c ${PKG_VERSION}`,
  'color: white; background: blue; font-weight: 700;',
  'color: blue; background: white; font-weight: 700;',
);

if (!customElements.get('ha-icon-button')) {
  customElements.define(
    'ha-icon-button',
    class extends (customElements.get('paper-icon-button') ?? HTMLElement) {},
  );
}

@customElement('vacuum-card')
export class VacuumCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: VacuumCardConfig;
  @state() private requestInProgress = false;
  @state() private thumbUpdater: ReturnType<typeof setInterval> | null = null;
  @state() private isLoadingWater: boolean = false;
  @state() private isLoadingMode: boolean = false;
  @state() private isLoadingFan: boolean = false;
  @state() private isSuccess: boolean | null = null;
  private _config?: VacuumCardConfig; // ⭐ AGGIUNGI QUESTA RIGA
  static get styles(): CSSResultGroup {
    return styles;
  }

  public static async getConfigElement() {
    await import('./editor');
    return document.createElement('vacuum-card-editor');
  }

  static getStubConfig(_: unknown, entities: string[]) {
    const [vacuumEntity] = entities.filter((eid) => eid.startsWith('vacuum'));

    return {
      entity: vacuumEntity ?? '',
    };
  }

  get entity(): VacuumEntity {
    return this.hass.states[this.config.entity] as VacuumEntity;
  }


  get map(): HassEntity | null {
    if (!this.hass || !this.config.map) {
      return null;
    }
    return this.hass.states[this.config.map];
  }

  get batteryEntity(): VacuumBatteryEntity | null {
    const batteryEntityId = this.config.battery_entity;
    if (!this.hass || !batteryEntityId) {
      return null;
    }
    return (this.hass.states[batteryEntityId] as VacuumBatteryEntity) ?? null;
  }

  public setConfig(config: VacuumCardConfig): void {
    this.config = buildConfig(config);
    this._config = config; // ⭐ Salva anche la config originale per le traduzioni
  }

  public getCardSize(): number {
    return this.config.compact_view ? 3 : 8;
  }

  public shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected updated(changedProps: PropertyValues) {
    if (
      changedProps.get('hass') &&
      changedProps.get('hass').states[this.config.entity].state !==
        this.hass.states[this.config.entity].state
    ) {
      this.requestInProgress = false;
    }
  }

  public connectedCallback() {
    super.connectedCallback();
    if (!this.config.compact_view && this.map) {
      this.requestUpdate();
      this.thumbUpdater = setInterval(
        () => this.requestUpdate(),
        this.config.map_refresh * 1000,
      );
    }
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    if (this.map && this.thumbUpdater) {
      clearInterval(this.thumbUpdater);
    }
  }

  private handleMore(entityId: string = this.entity.entity_id): void {
    fireEvent(
      this,
      'hass-more-info',
      {
        entityId,
      },
      {
        bubbles: false,
        composed: true,
      },
    );
  }

  private callService(action: VacuumCardAction) {
    const { service, service_data, target } = action;
    const [domain, name] = service.split('.');
    this.hass.callService(domain, name, service_data, target);
  }

  private callVacuumService(
    service: ServiceCallRequest['service'],
    params: VacuumServiceCallParams = { request: true },
    options: ServiceCallRequest['serviceData'] = {},
  ) {
    this.hass.callService('vacuum', service, {
      entity_id: this.config.entity,
      ...options,
    });

    if (params.request) {
      this.requestInProgress = true;
      this.requestUpdate();
    }
  }

  private handleSpeed(e: CustomEvent<{ item?: { value?: string } }>): void {
    const fan_speed = e.detail.item?.value;
    if (!fan_speed) return;

    this.isLoadingFan = true;
    this.callVacuumService('set_fan_speed', { request: false }, { fan_speed });

    setTimeout(() => {
      console.log('leggo valore post update');
    }, 5000);

    // ⭐ LEGGI I VALORI DALLA CONFIG (o usa i default)
    const entity_id =
      this._config?.xiaomi_miot?.entity_id ?? this._config?.entity;
    const mapping = this._config?.xiaomi_miot?.fan_speed || {
      siid: 7,
      piid: 5,
    };

    this.hass?.callService('xiaomi_miot', 'get_properties', {
      update_entity: true,
      entity_id: entity_id,
      mapping: [mapping],
    });

    setTimeout(() => {
      const updated =
        this.hass?.states?.['vacuum.xiaomi_b112_fb10_robot_cleaner'];
      const updatedVal = updated?.attributes?.['sweep.water_state'];

      console.log('✅ Valore aggiornato dopo 10s:', updatedVal);

      if (updatedVal === fan_speed) {
        console.log("🎉 L'entità è stata aggiornata correttamente!");
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
        console.warn(
          "⚠️ L'entità NON è stata aggiornata (o è ancora in attesa di refresh).",
        );
      }

      setTimeout(() => {
        this.isLoadingFan = false;
        this.isSuccess = null;
        this.requestUpdate();
      }, 1000);
    }, 10000);
  }

  private getCleaningModeLabel(modeValue: number): string {
    // ⭐ Prova a leggere dalla configurazione
    if (this._config?.traduzioni_modalita?.[modeValue]) {
      return this._config.traduzioni_modalita[modeValue];
    }

    // ⭐ Valori di default se non configurato
    const defaultModes: Record<number, string> = {
      0: 'Aspirapolvere',
      1: 'Aspirapolvere e Lavapavimenti',
      2: 'Lavapavimenti',
    };

    return defaultModes[modeValue] || `Modalità ${modeValue}`;
  }

  // ⭐ AGGIUNGI QUESTA NUOVA FUNZIONE
  private getAllCleaningModes(): Record<number, string> {
    return {
      0: this.getCleaningModeLabel(0),
      1: this.getCleaningModeLabel(1),
      2: this.getCleaningModeLabel(2),
    };
  }
  private handleModeChange(
    e: CustomEvent<{ item?: { value?: string } }>,
  ): void {
    const mode = e.detail.item?.value;

    if (mode !== null && mode !== undefined) {
      const modeInt = parseInt(mode, 10);

      if (!isNaN(modeInt)) {
        this.isLoadingMode = true;

        this.hass?.callService('xiaomi_miot', 'set_property', {
          entity_id: 'vacuum.xiaomi_b112_fb10_robot_cleaner',
          field: 'vacuum.mode',
          value: modeInt,
        });

        setTimeout(() => {
          console.log('leggo valore post update');
        }, 5000);

        this.hass?.callService('xiaomi_miot', 'get_properties', {
          update_entity: true,
          entity_id: 'vacuum.xiaomi_b112_fb10_robot_cleaner',
          mapping: [
            {
              siid: 2,
              piid: 4,
            },
          ],
        });

        setTimeout(() => {
          const updated =
            this.hass?.states?.['vacuum.xiaomi_b112_fb10_robot_cleaner'];
          const updatedVal = updated?.attributes?.['vacuum.mode'];

          console.log('✅ Valore aggiornato dopo 10s:', updatedVal);

          if (updatedVal === modeInt) {
            console.log("🎉 L'entità è stata aggiornata correttamente!");
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
            console.warn(
              "⚠️ L'entità NON è stata aggiornata (o è ancora in attesa di refresh).",
            );
          }

          setTimeout(() => {
            this.isLoadingMode = false;
            this.isSuccess = null;
            this.requestUpdate();
          }, 1000);
        }, 10000);
      } else {
        console.error('Invalid mode value:', mode);
      }
    } else {
      console.error('Mode attribute is null');
    }
  }

  private handleWaterChange(
    e: CustomEvent<{ item?: { value?: string } }>,
  ): void {
    const mode = e.detail.item?.value;
    console.log('▶️ Valore selezionato:', mode);

    if (mode !== null && mode !== undefined) {
      const modeInt = parseInt(mode, 10);

      if (!isNaN(modeInt)) {
        this.isLoadingWater = true;

        const attributes = this.entity?.attributes as Record<string, any>;
        const currentVal = attributes?.['sweep.water_state'];

        console.log('📦 Valore attuale prima del cambio:', currentVal);

        this.hass?.callService('xiaomi_miot', 'set_property', {
          entity_id: 'vacuum.xiaomi_b112_fb10_robot_cleaner',
          field: 'sweep.water_state',
          value: modeInt,
        });

        setTimeout(() => {
          console.log('leggo valore post update');
        }, 5000);

        this.hass?.callService('xiaomi_miot', 'get_properties', {
          update_entity: true,
          entity_id: 'vacuum.xiaomi_b112_fb10_robot_cleaner',
          mapping: [
            {
              siid: 7,
              piid: 6,
            },
          ],
        });

        setTimeout(() => {
          const updated =
            this.hass?.states?.['vacuum.xiaomi_b112_fb10_robot_cleaner'];
          const updatedVal = updated?.attributes?.['sweep.water_state'];

          console.log('✅ Valore aggiornato dopo 10s:', updatedVal);

          if (updatedVal === modeInt) {
            console.log("🎉 L'entità è stata aggiornata correttamente!");
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
            console.warn(
              "⚠️ L'entità NON è stata aggiornata (o è ancora in attesa di refresh).",
            );
          }

          setTimeout(() => {
            this.isLoadingWater = false;
            this.isSuccess = null;
            this.requestUpdate();
          }, 1000);
        }, 10000);
      } else {
        console.error('❌ Valore non numerico:', mode);
      }
    } else {
      console.error('❌ Attributo `value` nullo');
    }
  }

  private navigateToMapView() {
    const event = new CustomEvent('hass-navigate', {
      detail: { path: '/lovelace/mappa' },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private renderLoadingIcon(): Template {
    if (this.isLoadingFan || this.isLoadingMode || this.isLoadingWater) {
      if (this.isSuccess === true) {
        return html`<ha-icon
          style="color:limegreen"
          icon="mdi:progress-download"
        ></ha-icon>`;
      } else if (this.isSuccess === false) {
        return html`<ha-icon
          style="color:crimson"
          icon="mdi:alert-circle-outline"
        ></ha-icon>`;
      } else {
        return html`<ha-icon icon="mdi:progress-download"></ha-icon>`;
      }
    }
    return nothing;
  }

  private renderDropdown({
    icon,
    value,
    options,
    onSelect,
    formatLabel,
    ariaLabel,
    isLoading = false,
  }: {
    icon: string;
    value: string;
    options: string[];
    onSelect: (e: CustomEvent<{ item?: { value?: string } }>) => void;
    formatLabel: (value: string) => string;
    ariaLabel?: string;
    isLoading?: boolean;
  }): Template {
    const selectedLabel = formatLabel(value);

    return html`
      <div class="tip dropdown-tip" @click=${(e: Event) => e.stopPropagation()}>
        <ha-dropdown placement="bottom" @wa-select=${onSelect}>
          <button
            class="dropdown-trigger"
            slot="trigger"
            aria-label=${ariaLabel ?? selectedLabel}
          >
            ${isLoading ? this.renderLoadingIcon() : nothing}
            <ha-icon icon=${icon}></ha-icon>
            <span class="tip-title">${selectedLabel}</span>
            <ha-icon
              class="dropdown-trigger-arrow"
              icon="mdi:menu-down"
            ></ha-icon>
          </button>
          ${repeat(
            options,
            (item) => item,
            (item) => html`
              <ha-dropdown-item .value=${item} ?checked=${item === value}>
                ${formatLabel(item)}
              </ha-dropdown-item>
            `,
          )}
        </ha-dropdown>
      </div>
    `;
  }

  private handleVacuumAction(
    action: string,
    params: VacuumActionParams = { request: true },
  ) {
    return () => {
      if (!this.config.actions[action]) {
        return this.callVacuumService(params.defaultService ?? action, params);
      }

      this.callService(this.config.actions[action]);
    };
  }

  private getAttributes(entity: VacuumEntity) {
    const { status, state } = entity.attributes;

    return {
      ...entity.attributes,
      status: status ?? state ?? entity.state,
    };
  }

  private renderSource(): Template {
    const { fan_speed: source, fan_speed_list: sources } = this.getAttributes(
      this.entity,
    );

    if (!Array.isArray(sources) || sources.length === 0 || !source) {
      return nothing;
    }

    return this.renderDropdown({
      icon: 'mdi:fan',
      value: source,
      options: sources,
      onSelect: this.handleSpeed.bind(this),
      formatLabel: (value: string) =>
        localize(`source.${value.toLowerCase()}`) ?? value,
      ariaLabel: localize('source.fan_speed') ?? 'Fan speed',
      isLoading: this.isLoadingFan,
    });
  }

  private renderMode(): Template {
    const attributes = this.getAttributes?.(this.entity) as
      | Record<string, any>
      | undefined;
    const mode = attributes?.['vacuum.mode'] ?? 0;

    // ⭐ Ottieni le modalità disponibili
    const modeMap = this.getAllCleaningModes();

    const modes = Object.keys(modeMap);
    const modeValues = Object.values(modeMap);
    const currentModeLabel = modeMap[mode] ?? modeMap[0];

    return this.renderDropdown({
      icon: 'mdi:vacuum',
      value: mode.toString(),
      options: modes,
      onSelect: this.handleModeChange.bind(this),
      formatLabel: (value: string) => {
        const index = parseInt(value, 10);
        const modeLabel = modeMap[index];
        if (!modeLabel) return value;
        const localized = localize(`mode.${modeLabel.toLowerCase()}`);
        return localized ?? modeLabel; // Usa modeLabel se localize restituisce undefined
      },
      ariaLabel: 'Vacuum mode',
      isLoading: this.isLoadingMode,
    });
  }

  private renderWater(): Template {
    const attributes = this.getAttributes?.(this.entity) as
      | Record<string, any>
      | undefined;
    const mode = attributes?.['sweep.water_state'] ?? 1;

    const modeMap: Record<number, string> = {
      1: 'Basso',
      2: 'Medio',
      3: 'Alto',
    };

    const modes = Object.keys(modeMap);

    return this.renderDropdown({
      icon: 'mdi:water-percent',
      value: mode.toString(),
      options: modes,
      onSelect: this.handleWaterChange.bind(this),
      formatLabel: (value: string) => {
        const index = parseInt(value, 10);
        return (
          localize(`water.${modeMap[index]?.toLowerCase()}`) ??
          modeMap[index] ??
          value
        );
      },
      ariaLabel: 'Water level',
      isLoading: this.isLoadingWater,
    });
  }

  private getBatteryDisplay(): {
    icon: string;
    value: string;
    entityId: string;
  } | null {
    const batteryEntity = this.batteryEntity;

    if (batteryEntity) {
      const value = computeStateDisplay(
        this.hass.localize,
        batteryEntity,
        this.hass.locale,
      );
      const icon = stateIcon(batteryEntity) ?? 'mdi:battery';

      return {
        icon,
        value,
        entityId: batteryEntity.entity_id,
      };
    }

    const { battery_level, battery_icon } = this.getAttributes(this.entity);

    if (battery_level == null) {
      return null;
    }

    return {
      icon: battery_icon ?? 'mdi:battery',
      value: `${battery_level}%`,
      entityId: this.entity.entity_id,
    };
  }

  private renderBattery(): Template {
    const battery = this.getBatteryDisplay();

    if (!battery) {
      return nothing;
    }

    return html`
      <div class="tip" @click="${() => this.handleMore(battery.entityId)}">
        <ha-icon icon="${battery.icon}"></ha-icon>
        <span class="tip-title">${battery.value}</span>
      </div>
    `;
  }

  private renderMapOrImage(state: VacuumEntityState): Template {
    if (this.config.compact_view) {
      return nothing;
    }

    if (this.map) {
      return this.map && this.map.attributes.entity_picture
        ? html`
            <img
              class="map"
              src="${this.map.attributes.entity_picture}&v=${Date.now()}"
              @click=${() => this.handleMore(this.config.map)}
            />
          `
        : nothing;
    }

    const src =
      this.config.image === 'default' ? DEFAULT_IMAGE : this.config.image;

    return html`
      <img
        class="vacuum ${state}"
        src="${src}"
        @click="${() => this.handleMore()}"
      />
    `;
  }

  private renderStats(state: VacuumEntityState): Template {
    const statsList =
      this.config.stats[state] || this.config.stats.default || [];

    const stats = statsList.map(
      ({ entity_id, attribute, value_template, unit, subtitle }) => {
        if (!entity_id && !attribute) {
          return nothing;
        }

        let state = '';

        if (entity_id && attribute) {
          state = get(this.hass.states[entity_id].attributes, attribute);
        } else if (attribute) {
          state = get(this.entity.attributes, attribute);
        } else if (entity_id) {
          state = this.hass.states[entity_id].state;
        } else {
          return nothing;
        }

        const value = html`
          <ha-template
            hass=${this.hass}
            template=${value_template}
            value=${state}
            variables=${{ value: state }}
          ></ha-template>
        `;

        return html`
          <div class="stats-block" @click="${() => this.handleMore(entity_id)}">
            <span class="stats-value">${value}</span>
            ${unit}
            <div class="stats-subtitle">${subtitle}</div>
          </div>
        `;
      },
    );

    if (!stats.length) {
      return nothing;
    }

    return html`<div class="stats">${stats}</div>`;
  }

  private renderName(): Template {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.config.show_name) {
      return nothing;
    }

    return html` <div class="vacuum-name">${friendly_name}</div> `;
  }

  private renderStatus(): Template {
    const { status } = this.getAttributes(this.entity);
    const localizedStatus =
      localize(`status.${status.toLowerCase()}`) ?? status;

    if (!this.config.show_status) {
      return nothing;
    }

    return html`
      <div class="status">
        ${this.requestInProgress
          ? html`<ha-spinner class="status-spinner" size="tiny"></ha-spinner>`
          : nothing}
        <span class="status-text" alt=${localizedStatus}>
          ${localizedStatus}
        </span>
      </div>
    `;
  }

  private renderToolbar(state: VacuumEntityState): Template {
    if (!this.config.show_toolbar) {
      return nothing;
    }

    switch (state) {
      case 'on':
      case 'auto':
      case 'spot':
      case 'edge':
      case 'single_room':
      case 'cleaning': {
        return html`
          <div class="toolbar">
            <paper-button @click="${this.handleVacuumAction('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('stop')}">
              <ha-icon icon="hass:stop"></ha-icon>
              ${localize('common.stop')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
            <paper-button @click="${this.navigateToMapView}">
              <ha-icon icon="hass:map"></ha-icon>
              Mappa
            </paper-button>
          </div>
        `;
      }

      case 'paused': {
        return html`
          <div class="toolbar">
            <paper-button
              @click="${this.handleVacuumAction('resume', {
                defaultService: 'start',
                request: true,
              })}"
            >
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'returning': {
        return html`
          <div class="toolbar">
            <paper-button
              @click="${this.handleVacuumAction('resume', {
                defaultService: 'start',
                request: true,
              })}"
            >
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
          </div>
        `;
      }
      case 'docked':
      case 'idle':
      default: {
        const buttons = this.config.shortcuts.map(
          ({ name, service, icon, service_data, target }) => {
            const execute = () => {
              if (service) {
                return this.callService({ service, service_data, target });
              }
            };
            return html`
              <ha-icon-button label="${name}" @click="${execute}">
                <ha-icon icon="${icon}"></ha-icon>
              </ha-icon-button>
            `;
          },
        );

        const dockButton = html`
          <ha-icon-button
            label="${localize('common.return_to_base')}"
            @click="${this.handleVacuumAction('return_to_base')}"
            ><ha-icon icon="hass:home-map-marker"></ha-icon>
          </ha-icon-button>
        `;

        return html`
          <div class="toolbar">
            <ha-icon-button
              label="${localize('common.start')}"
              @click="${this.handleVacuumAction('start')}"
              ><ha-icon icon="hass:play"></ha-icon>
            </ha-icon-button>

            <ha-icon-button
              label="${localize('common.locate')}"
              @click="${this.handleVacuumAction('locate', { request: false })}"
              ><ha-icon icon="mdi:map-marker"></ha-icon>
            </ha-icon-button>

            ${state === 'idle' ? dockButton : ''}
            <div class="fill-gap"></div>
            ${buttons}
          </div>
        `;
      }
    }
  }

  private renderUnavailable(): Template {
    return html`
      <ha-card>
        <div class="preview not-available">
          <div class="metadata">
            <div class="not-available">
              ${localize('common.not_available')}
            </div>
          <div>
        </div>
      </ha-card>
    `;
  }

  protected render(): Template {
    if (!this.entity) {
      return this.renderUnavailable();
    }

    return html`
      <ha-card>
        <ha-ripple></ha-ripple>
        <div class="preview">
          <div class="header">
            <div class="tips">
              ${this.renderSource()} ${this.renderBattery()}
              ${this.renderMode()} ${this.renderWater()}
            </div>
            <ha-icon-button
              class="more-info"
              icon="mdi:dots-vertical"
              ?more-info="true"
              @click="${() => this.handleMore()}"
              ><ha-icon icon="mdi:dots-vertical"></ha-icon
            ></ha-icon-button>
          </div>

          ${this.renderMapOrImage(this.entity.state)}

          <div class="metadata">
            ${this.renderName()} ${this.renderStatus()}
          </div>

          ${this.renderStats(this.entity.state)}
        </div>

        ${this.renderToolbar(this.entity.state)}
      </ha-card>
    `;
  }
}

declare global {
  interface Window {
    customCards?: unknown[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'vacuum-card',
  name: localize('common.name'),
  description: localize('common.description'),
});
