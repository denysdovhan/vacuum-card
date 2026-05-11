import { LitElement, html, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
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

type ConfigElement = HTMLElement & {
  configValue?: keyof VacuumCardConfig;
  value?: string | number | boolean;
  checked?: boolean;
};

@customElement('vacuum-card-editor')
export class VacuumCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config!: Partial<VacuumCardConfig>;
  @state() private configVersion = 0;

  @state() private entity?: string;
  @state() private battery_entity?: string;
  @state() private map?: string;
  @state() private image?: string;
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
    //console.log('🔧 setConfig called with:', config);

    this.config = config;

    if (!this.config.entity) {
      this.config.entity = this.getEntitiesByType('vacuum')[0] || '';
      fireEvent(this, 'config-changed', { config: this.config });
    }

    // ⭐ CARICA ENTITY, BATTERY_ENTITY, MAP
    this.entity = config.entity;
    this.battery_entity = config.battery_entity;
    this.map = config.map;
    this.xiaomi_entity_id = config.xiaomi_miot?.entity_id;
    this.fan_speed_siid = config.xiaomi_miot?.fan_speed?.siid;
    this.fan_speed_piid = config.xiaomi_miot?.fan_speed?.piid;
    this.cleaning_mode_siid = config.xiaomi_miot?.cleaning_mode?.siid;
    this.cleaning_mode_piid = config.xiaomi_miot?.cleaning_mode?.piid;

    // ⭐ CARICA LE TRADUZIONI (come oggetto con chiavi string)
    this.mode_0_label = config.traduzioni_modalita?.['0'];
    this.mode_1_label = config.traduzioni_modalita?.['1'];
    this.mode_2_label = config.traduzioni_modalita?.['2'];

    //console.log('📝 Loaded translations:', {
//       mode_0: this.mode_0_label,
//       mode_1: this.mode_1_label,
//       mode_2: this.mode_2_label,
//     });

    // ⭐ CARICA GLI ALTRI CAMPI VISIBILITÀ
    this.image = config.image;
    this.compact_view = config.compact_view ?? false;
    this.show_name = config.show_name ?? true;
    this.show_status = config.show_status ?? true;
    this.show_toolbar = config.show_toolbar ?? true;

    //console.log('✅ All state properties loaded');

    // ⭐ INCREMENTA IL CONTATORE PER FORZARE IL RICREAMENTO DEI COMPONENTI
    this.configVersion++;
    this.requestUpdate();
  }

  private getEntitiesByType(type: string): string[] {
    if (!this.hass) {
      return [];
    }
    return Object.keys(this.hass.states).filter((id) => id.startsWith(type));
  }

  protected render(): Template {
     if (!this.config || !this.hass) {
        return html``;
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
          ${keyed('entity_' + this.configVersion, html`
            <ha-select
              .label=${localize('editor.entity')}
              @selected=${this.valueChanged}
              .configValue=${'entity'}
              .value=${this.entity ?? ''}
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
          `)}
        </div>

        <div class="option">
          ${keyed('battery_' + this.configVersion, html`
            <ha-select
              .label=${localize('editor.battery_entity')}
              @selected=${this.valueChanged}
              .configValue=${'battery_entity'}
              .value=${this.battery_entity ?? ''}
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
          `)}
        </div>

        <div class="option">
          ${keyed('map_' + this.configVersion, html`
            <ha-select
              .label=${localize('editor.map')}
              @selected=${this.valueChanged}
              .configValue=${'map'}
              .value=${this.map ?? ''}
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
          `)}
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
          ${keyed('xiaomi_entity_' + this.configVersion, html`
            <ha-textfield
              label="Entity ID MIoT"
              .value=${this.xiaomi_entity_id ?? ''}
              @change=${(e: Event) =>
                this.xiaomiValueChanged(e, 'entity_id')}
            ></ha-textfield>
          `)}
        </div>

        <div class="option">
          ${keyed('fan_speed_siid_' + this.configVersion, html`
            <ha-textfield
              label="Fan Speed SIID"
              type="number"
              .value=${String(this.fan_speed_siid ?? 7)}
              @change=${(e: Event) =>
                this.xiaomiValueChanged(e, 'fan_speed_siid')}
            ></ha-textfield>
          `)}
        </div>

        <div class="option">
          ${keyed('fan_speed_piid_' + this.configVersion, html`
            <ha-textfield
              label="Fan Speed PIID"
              type="number"
              .value=${String(this.fan_speed_piid ?? 7)}
              @change=${(e: Event) =>
                this.xiaomiValueChanged(e, 'fan_speed_piid')}
            ></ha-textfield>
          `)}
        </div>

        <div class="option">
          ${keyed('cleaning_mode_siid_' + this.configVersion, html`
            <ha-textfield
              label="Cleaning Mode SIID"
              type="number"
              .value=${String(this.cleaning_mode_siid ?? 2)}
              @change=${(e: Event) => this.xiaomiValueChanged(e, 'cleaning_mode_siid')}
            ></ha-textfield>
          `)}
        </div>

        <div class="option">
         ${keyed('cleaning_mode_piid_' + this.configVersion, html`
           <ha-textfield
             label="Cleaning Mode PIID"
             type="number"
             .value=${String(this.cleaning_mode_piid ?? 4)}
             @change=${(e: Event) => this.xiaomiValueChanged(e, 'cleaning_mode_piid')}
           ></ha-textfield>
         `)}
        </div>

        <!-- ⭐ SEZIONE TRADUZIONI -->
        <br />
        <h3>Traduzioni Modalità di Pulizia</h3>

        <div class="option">
         ${keyed('mode_0_' + this.configVersion, html`
           <ha-textfield
             label="Modalità 0 (Aspirapolvere)"
             .value=${this.mode_0_label ?? ''}
             @change=${(e: Event) => this.translationChanged(e, 0)}
             placeholder="Aspirapolvere"
           ></ha-textfield>
         `)}
        </div>

        <div class="option">
          ${keyed('mode_1_' + this.configVersion, html`
            <ha-textfield
              label="Modalità 1 (Aspirapolvere + Lavaggio)"
              .value=${this.mode_1_label ?? ''}
              @change=${(e: Event) => this.translationChanged(e, 1)}
              placeholder="Aspirapolvere e Lavapavimenti"
            ></ha-textfield>
          `)}
        </div>

        <div class="option">
         ${keyed('mode_2_' + this.configVersion, html`
           <ha-textfield
             label="Modalità 2 (Lavaggio)"
             .value=${this.mode_2_label ?? ''}
             @change=${(e: Event) => this.translationChanged(e, 2)}
             placeholder="Lavapavimenti"
           ></ha-textfield>
         `)}
        </div>
        <strong>${localize('editor.code_only_note')}</strong>
      </div>
    `;
  }

  private valueChanged(event: Event): void {
    //console.log('🎯 valueChanged triggered');

    if (!this.config || !this.hass || !event.target) {
      return;
    }
    const target = event.target as ConfigElement;
    if (!target.configValue) {
      return;
    }

    const newValue = target.checked ?? target.value ?? '';

    //console.log(`📤 Updating ${target.configValue} to:`, newValue);

    // Aggiorna config
    if (newValue === '') {
      delete this.config[target.configValue];
    } else {
      this.config = {
        ...this.config,
        [target.configValue]: newValue,
      };
    }

    // ⭐ AGGIORNA LE PROPRIETÀ @state() CORRISPONDENTI
    this.updateStateProperty(target.configValue, newValue);

    //console.log('📢 Firing config-changed event from valueChanged');
    //console.log('📤 Complete config:', JSON.stringify(this.config, null, 2));
    fireEvent(this, 'config-changed', { config: this.config });
    this.requestUpdate();
  }

  // ⭐ METODO HELPER PER AGGIORNARE LE PROPRIETÀ @state()
  private updateStateProperty(key: keyof VacuumCardConfig, value: any): void {
    switch (key) {
      case 'entity':
        this.entity = value as string;
        break;
      case 'battery_entity':
        this.battery_entity = value as string;
        break;
      case 'map':
        this.map = value as string;
        break;
      case 'image':
        this.image = value as string;
        break;
      case 'compact_view':
        this.compact_view = Boolean(value);
        break;
      case 'show_name':
        this.show_name = Boolean(value);
        break;
      case 'show_status':
        this.show_status = Boolean(value);
        break;
      case 'show_toolbar':
        this.show_toolbar = Boolean(value);
        break;
    }
  }

  private xiaomiValueChanged(event: Event, field: string): void {
    //console.log(`🎯 xiaomiValueChanged triggered for field: ${field}`);

    if (!this.config || !event.target) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const raw = target.value;
    const value = target.type === 'number' ? Number(raw) : raw;

    //console.log(`📤 New xiaomi value for ${field}:`, value);

    const oldXiaomi = this.config.xiaomi_miot ?? {};

    let newXiaomi = { ...oldXiaomi };

    if (field === 'entity_id') {
      newXiaomi = {
        ...newXiaomi,
        entity_id: value as string,
      };
      // ⭐ AGGIORNA LA PROPRIETÀ @state()
      this.xiaomi_entity_id = value as string;
    }

    if (field.startsWith('fan_speed_')) {
      const prop = field.replace('fan_speed_', '') as 'siid' | 'piid';

      newXiaomi = {
        ...newXiaomi,
        fan_speed: {
          ...(oldXiaomi.fan_speed ?? { siid: 7, piid: 5 }),
          [prop]: value as number,
        },
      };
      // ⭐ AGGIORNA LE PROPRIETÀ @state()
      if (prop === 'siid') this.fan_speed_siid = value as number;
      if (prop === 'piid') this.fan_speed_piid = value as number;
    }

    if (field.startsWith('cleaning_mode_')) {
      const prop = field.replace('cleaning_mode_', '') as 'siid' | 'piid';

      newXiaomi = {
        ...newXiaomi,
        cleaning_mode: {
          ...(oldXiaomi.cleaning_mode ?? { siid: 2, piid: 4 }),
          [prop]: value as number,
        },
      };
      // ⭐ AGGIORNA LE PROPRIETÀ @state()
      if (prop === 'siid') this.cleaning_mode_siid = value as number;
      if (prop === 'piid') this.cleaning_mode_piid = value as number;
    }

    // ⭐ ASSEGNA IL VALORE AGGIORNATO A this.config PRIMA DI LANCIARE L'EVENTO
    this.config = {
      ...this.config,
      xiaomi_miot: newXiaomi,
    };

    //console.log('📢 Firing config-changed event from xiaomiValueChanged');
    //console.log('📤 Complete config:', JSON.stringify(this.config, null, 2));
    fireEvent(this, 'config-changed', { config: this.config });
    this.requestUpdate();
  }

  private translationChanged(event: Event, modeIndex: number): void {
    //console.log(`🎯 translationChanged triggered for mode ${modeIndex}`);

    if (!this.config || !event.target) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const value = target.value ?? '';

    //console.log(`📤 New translation for mode ${modeIndex}:`, value);

    // ⭐ TRATTA traduzioni_modalita COME UN OGGETTO CON CHIAVI STRING
    const oldTranslations = (this.config.traduzioni_modalita ?? {}) as Record<string, string>;
    const newTranslations = { ...oldTranslations };

    const modeKey = String(modeIndex);

    if (value === '') {
      delete newTranslations[modeKey];
    } else {
      newTranslations[modeKey] = value;
    }

    // ⭐ AGGIORNA LE PROPRIETÀ @state()
    if (modeIndex === 0) this.mode_0_label = value || undefined;
    if (modeIndex === 1) this.mode_1_label = value || undefined;
    if (modeIndex === 2) this.mode_2_label = value || undefined;

    // ⭐ ASSEGNA IL VALORE AGGIORNATO A this.config PRIMA DI LANCIARE L'EVENTO
    this.config = {
      ...this.config,
      traduzioni_modalita: newTranslations,
    };

    //console.log('📢 Firing config-changed event from translationChanged');
    //console.log('📤 Complete config:', JSON.stringify(this.config, null, 2));
    fireEvent(this, 'config-changed', { config: this.config });
    this.requestUpdate();
  }

  static get styles() {
    return styles;
  }
}