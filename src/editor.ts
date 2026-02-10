import { LitElement, html, nothing } from 'lit';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardEditor,
  fireEvent,
} from 'custom-card-helpers';
import localize from './localize';
import { customElement, property, state } from 'lit/decorators.js';
import { Template, VacuumCardConfig } from './types';
import styles from './editor.css';

type ConfigElement = HTMLInputElement & {
  configValue?: keyof VacuumCardConfig;
};

@customElement('vacuum-card-editor')
export class VacuumCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config!: Partial<VacuumCardConfig>;

  @state() private image? = undefined;
  @state() private compact_view = false;
  @state() private show_name = true;
  @state() private show_status = true;
  @state() private show_toolbar = true;
  // ⭐ NUOVE PROPRIETÀ
  @state() private xiaomi_entity_id?: string;
  @state() private fan_speed_siid?: number;
  @state() private fan_speed_piid?: number;
  @state() private cleaning_mode_siid?: number;
  @state() private cleaning_mode_piid?: number;
  @state() private mode_0_label?: string;
  @state() private mode_1_label?: string;
  @state() private mode_2_label?: string;

  setConfig(config: LovelaceCardConfig & VacuumCardConfig): void {
    this.config = config;

    if (!this.config.entity) {
      this.config.entity = this.getEntitiesByType('vacuum')[0] || '';
      fireEvent(this, 'config-changed', { config: this.config });
    }
    // ⭐ CARICA I VALORI XIAOMI MIOT
    this.xiaomi_entity_id = config.xiaomi_miot?.entity_id;
    this.fan_speed_siid = config.xiaomi_miot?.fan_speed?.siid;
    this.fan_speed_piid = config.xiaomi_miot?.fan_speed?.piid;
    this.cleaning_mode_siid = config.xiaomi_miot?.cleaning_mode?.siid;
    this.cleaning_mode_piid = config.xiaomi_miot?.cleaning_mode?.piid;

    // ⭐ CARICA LE TRADUZIONI
    this.mode_0_label = config.traduzioni_modalita?.[0];
    this.mode_1_label = config.traduzioni_modalita?.[1];
    this.mode_2_label = config.traduzioni_modalita?.[2];
  }

  private getEntitiesByType(type: string): string[] {
    if (!this.hass) {
      return [];
    }
    return Object.keys(this.hass.states).filter((id) => id.startsWith(type));
  }

  protected render(): Template {
    if (!this.hass) {
      return nothing;
    }

    const vacuumEntities = this.getEntitiesByType('vacuum');
    const batteryEntities = this.getEntitiesByType('sensor');
    const cameraEntities = [
      ...this.getEntitiesByType('camera'),
      ...this.getEntitiesByType('image'),
    ];

    return html`
      <div class="card-config">
        <div class="option">
          <ha-select
            .label=${localize('editor.entity')}
            @selected=${this.valueChanged}
            .configValue=${'entity'}
            .value=${this.config.entity}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
            required
            validationMessage=${localize('error.missing_entity')}
          >
            ${vacuumEntities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <ha-select
            .label=${localize('editor.battery_entity')}
            @selected=${this.valueChanged}
            .configValue=${'battery_entity'}
            .value=${this.config.battery_entity}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            ${batteryEntities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <ha-select
            .label=${localize('editor.map')}
            @selected=${this.valueChanged}
            .configValue=${'map'}
            .value=${this.config.map}
            @closed=${(e: Event) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            ${cameraEntities.map(
              (entity) =>
                html` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`,
            )}
          </ha-select>
        </div>

        <div class="option">
          <paper-input
            label="${localize('editor.image')}"
            .value=${this.image}
            .configValue=${'image'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.compact_view
                ? 'editor.compact_view_aria_label_off'
                : 'editor.compact_view_aria_label_on',
            )}
            .checked=${Boolean(this.compact_view)}
            .configValue=${'compact_view'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.compact_view')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.show_name
                ? 'editor.show_name_aria_label_off'
                : 'editor.show_name_aria_label_on',
            )}
            .checked=${Boolean(this.show_name)}
            .configValue=${'show_name'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_name')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.show_status
                ? 'editor.show_status_aria_label_off'
                : 'editor.show_status_aria_label_on',
            )}
            .checked=${Boolean(this.show_status)}
            .configValue=${'show_status'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_status')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(
              this.show_toolbar
                ? 'editor.show_toolbar_aria_label_off'
                : 'editor.show_toolbar_aria_label_on',
            )}
            .checked=${Boolean(this.show_toolbar)}
            .configValue=${'show_toolbar'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_toolbar')}
        </div>
        <!-- ⭐ SEZIONE XIAOMI MIOT -->
        <br />
        <h3>Configurazione Xiaomi MIoT</h3>

        <div class="option">
          <paper-input
            label="Entity ID MIoT"
            .value=${this.xiaomi_entity_id ?? ''}
            @value-changed=${(e: Event) =>
              this.xiaomiValueChanged(e, 'entity_id')}
            placeholder="vacuum.xiaomi_b112_fb10_robot_cleaner"
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="Fan Speed SIID"
            type="number"
            .value=${this.fan_speed_siid?.toString() ?? '7'}
            @value-changed=${(e: Event) =>
              this.xiaomiValueChanged(e, 'fan_speed_siid')}
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="Fan Speed PIID"
            type="number"
            .value=${this.fan_speed_piid?.toString() ?? '5'}
            @value-changed=${(e: Event) =>
              this.xiaomiValueChanged(e, 'fan_speed_piid')}
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="Cleaning Mode SIID"
            type="number"
            .value=${this.cleaning_mode_siid?.toString() ?? '2'}
            @value-changed=${(e: Event) =>
              this.xiaomiValueChanged(e, 'cleaning_mode_siid')}
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="Cleaning Mode PIID"
            type="number"
            .value=${this.cleaning_mode_piid?.toString() ?? '4'}
            @value-changed=${(e: Event) =>
              this.xiaomiValueChanged(e, 'cleaning_mode_piid')}
          ></paper-input>
        </div>

        <!-- ⭐ SEZIONE TRADUZIONI -->
        <br />
        <h3>Traduzioni Modalità di Pulizia</h3>

        <div class="option">
          <paper-input
            label="Modalità 0 (Aspirapolvere)"
            .value=${this.mode_0_label ?? ''}
            @value-changed=${(e: Event) => this.translationChanged(e, 0)}
            placeholder="Aspirapolvere"
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="Modalità 1 (Aspirapolvere + Lavaggio)"
            .value=${this.mode_1_label ?? ''}
            @value-changed=${(e: Event) => this.translationChanged(e, 1)}
            placeholder="Aspirapolvere e Lavapavimenti"
          ></paper-input>
        </div>

        <div class="option">
          <paper-input
            label="Modalità 2 (Lavaggio)"
            .value=${this.mode_2_label ?? ''}
            @value-changed=${(e: Event) => this.translationChanged(e, 2)}
            placeholder="Lavapavimenti"
          ></paper-input>
        </div>
        <strong>${localize('editor.code_only_note')}</strong>
      </div>
    `;
  }

  private valueChanged(event: Event): void {
    if (!this.config || !this.hass || !event.target) {
      return;
    }
    const target = event.target as ConfigElement;
    if (
      !target.configValue ||
      this.config[target.configValue] === target?.value
    ) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this.config[target.configValue];
      } else {
        this.config = {
          ...this.config,
          [target.configValue]: target.checked ?? target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.config });
  }

  // ⭐ NUOVA FUNZIONE PER XIAOMI MIOT
  private xiaomiValueChanged(event: Event, field: string): void {
    if (!this.config || !this.hass || !event.target) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const value =
      target.type === 'number' ? parseInt(target.value, 10) : target.value;

    // Crea la struttura xiaomi_miot se non esiste
    if (!this.config.xiaomi_miot) {
      this.config.xiaomi_miot = {};
    }

    // Gestisci i campi nidificati
    if (field === 'entity_id') {
      this.config.xiaomi_miot.entity_id = value as string;
    } else if (field.startsWith('fan_speed_')) {
      if (!this.config.xiaomi_miot.fan_speed) {
        this.config.xiaomi_miot.fan_speed = { siid: 7, piid: 5 };
      }
      const prop = field.replace('fan_speed_', '') as 'siid' | 'piid';
      this.config.xiaomi_miot.fan_speed[prop] = value as number;
    } else if (field.startsWith('cleaning_mode_')) {
      if (!this.config.xiaomi_miot.cleaning_mode) {
        this.config.xiaomi_miot.cleaning_mode = { siid: 2, piid: 4 };
      }
      const prop = field.replace('cleaning_mode_', '') as 'siid' | 'piid';
      this.config.xiaomi_miot.cleaning_mode[prop] = value as number;
    }

    this.config = { ...this.config };
    fireEvent(this, 'config-changed', { config: this.config });
  }

  // ⭐ NUOVA FUNZIONE PER LE TRADUZIONI
  private translationChanged(event: Event, modeIndex: number): void {
    if (!this.config || !this.hass || !event.target) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Crea la struttura traduzioni_modalita se non esiste
    if (!this.config.traduzioni_modalita) {
      this.config.traduzioni_modalita = {};
    }

    if (value === '') {
      delete this.config.traduzioni_modalita[modeIndex];
    } else {
      this.config.traduzioni_modalita[modeIndex] = value;
    }

    this.config = { ...this.config };
    fireEvent(this, 'config-changed', { config: this.config });
  }

  static get styles() {
    return styles;
  }
}
