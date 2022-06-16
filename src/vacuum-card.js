import { LitElement, html, nothing } from 'lit';
import { hasConfigOrEntityChanged, fireEvent } from 'custom-card-helpers';
import registerTemplates from 'ha-template';
import get from 'lodash.get';
import localize from './localize';
import styles from './styles.css';
import defaultImage from './vacuum.svg';
import { version } from '../package.json';
import { String } from 'typescript-string-operations';

import './vacuum-card-editor';

registerTemplates();

console.info(
  `%c VACUUM-CARD %c ${version} `,
  'color: white; background: blue; font-weight: 700;',
  'color: blue; background: white; font-weight: 700;'
);

if (!customElements.get('ha-icon-button')) {
  customElements.define(
    'ha-icon-button',
    class extends customElements.get('paper-icon-button') {}
  );
}

class VacuumCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      requestInProgress: Boolean,
    };
  }

  static get styles() {
    return styles;
  }

  static async getConfigElement() {
    return document.createElement('vacuum-card-editor');
  }

  static getStubConfig(hass, entities) {
    const [vacuumEntity] = entities.filter(
      (eid) => eid.substr(0, eid.indexOf('.')) === 'vacuum'
    );

    return {
      entity: vacuumEntity || '',
      image: 'default',
    };
  }

  get entity() {
    return this.hass.states[this.config.entity];
  }

  get map() {
    if (!this.hass) {
      return null;
    }
    return this.hass.states[this.config.map];
  }

  get image() {
    if (this.config.image === 'default') {
      return defaultImage;
    }

    return this.config.image || defaultImage;
  }

  get showName() {
    if (this.config.show_name === undefined) {
      return true;
    }

    return this.config.show_name;
  }

  get showStatus() {
    if (this.config.show_status === undefined) {
      return true;
    }

    return this.config.show_status;
  }

  get showToolbar() {
    if (this.config.show_toolbar === undefined) {
      return true;
    }

    return this.config.show_toolbar;
  }

  get compactView() {
    if (this.config.compact_view === undefined) {
      return false;
    }

    return this.config.compact_view;
  }

  get waterLevelEntity() {
    if (!this.hass || !this.config.water_level) {
      return null;
    }

    const entity_type = 'select';
    const waterLevel = this.config.water_level;
    if (!waterLevel.startsWith(entity_type)) {
      throw new Error(
        String.Format(
          localize('error.domain_not_supported'),
          entity_type,
          waterLevel.split('.')[0]
        )
      );
    }

    return waterLevel;
  }

  get waterLevel() {
    return this.hass.states[this.waterLevelEntity];
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error(localize('error.missing_entity'));
    }

    const actions = config.actions;
    if (actions && Array.isArray(actions)) {
      console.warn(localize('warning.actions_array'));
    }

    this.config = config;
  }

  getCardSize() {
    return this.config.compact_view || false ? 3 : 8;
  }

  hasWaterLevelChanged(changedProps) {
    return (
      this.hass &&
      this.config.water_level &&
      changedProps.get('hass').states[this.waterLevelEntity].state !==
        this.waterLevel.state
    );
  }

  shouldUpdate(changedProps) {
    return (
      hasConfigOrEntityChanged(this, changedProps) ||
      this.hasWaterLevelChanged(changedProps)
    );
  }

  updated(changedProps) {
    if (
      changedProps.get('hass') &&
      changedProps.get('hass').states[this.config.entity].state !==
        this.hass.states[this.config.entity].state
    ) {
      this.requestInProgress = false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.compactView && this.map) {
      this.requestUpdate();
      this.thumbUpdater = setInterval(
        () => this.requestUpdate(),
        (this.config.map_refresh || 5) * 1000
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.map) {
      clearInterval(this.thumbUpdater);
    }
  }

  handleMore(entityId = this.entity.entity_id) {
    fireEvent(
      this,
      'hass-more-info',
      {
        entityId,
      },
      {
        bubbles: false,
        composed: true,
      }
    );
  }

  handleSpeed(e, context) {
    const fan_speed = e.target.getAttribute('value');
    context.callService('set_fan_speed', { isRequest: false }, { fan_speed });
  }

  handleSelect(e, context) {
    const value = e.target.getAttribute('value');
    context.hass.callService('select', 'select_option', {
      entity_id: context.waterLevel.entity_id,
      option: value,
    });
  }

  handleStart() {
    const actions = this.config.actions;
    if (!actions || !actions.start) {
      this.callService('start');
      return;
    }

    this.callAction(actions.start);
  }

  handlePause() {
    const actions = this.config.actions;
    if (!actions || !actions.pause) {
      this.callService('pause');
      return;
    }

    this.callAction(actions.pause);
  }

  handleResume() {
    const actions = this.config.actions;
    if (!actions || !actions.resume) {
      this.callService('start');
      return;
    }

    this.callAction(actions.resume);
  }

  handleAction(action, params = { isRequest: true }) {
    const actions = this.config.actions || {};

    return () => {
      if (!actions[action]) {
        this.callService(params.defaultService || action, {
          isRequest: params.isRequest,
        });
        return;
      }

      this.callAction(actions[action]);
    };
  }

  callService(service, params = { isRequest: true }, options = {}) {
    this.hass.callService('vacuum', service, {
      entity_id: this.config.entity,
      ...options,
    });

    if (params.isRequest) {
      this.requestInProgress = true;
      this.requestUpdate();
    }
  }

  callAction(action) {
    const { service, service_data } = action;
    const [domain, name] = service.split('.');
    this.hass.callService(domain, name, service_data);
  }

  getAttributes(entity) {
    const {
      status,
      state,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
    } = entity.attributes;

    return {
      status: status || state || entity.state,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
    };
  }

  renderSource() {
    const { fan_speed: source, fan_speed_list: sources } = this.getAttributes(
      this.entity
    );

    return this.renderDropDown(
      source,
      sources,
      'mdi:fan',
      this.handleSpeed,
      'source'
    );
  }

  renderWaterLevel() {
    const entity = this.waterLevel;
    if (entity) {
      return this.renderDropDown(
        entity.state,
        entity.attributes.options,
        'mdi:water',
        this.handleSelect,
        'water_level'
      );
    }
  }

  renderDropDown(
    selectedObject,
    objects,
    icon,
    onSelected,
    localizePrefix = ''
  ) {
    if (!objects) {
      return nothing;
    }

    const selected = objects.indexOf(selectedObject);

    if (localizePrefix !== '' && !localizePrefix.endsWith('.')) {
      localizePrefix += '.';
    }

    return html`
      <div class="tip">
        <ha-button-menu @click="${(e) => e.stopPropagation()}">
          <div slot="trigger">
            <ha-icon icon="${icon}"></ha-icon>
            <span class="icon-title">
              ${localize(`${localizePrefix}${selectedObject}`) ||
              selectedObject}
            </span>
          </div>
          ${objects.map(
            (item, index) =>
              html`
                <mwc-list-item
                  ?activated=${selected === index}
                  value=${item}
                  @click="${(e) => onSelected(e, this)}"
                >
                  ${localize(`source.${item}`) || item}
                </mwc-list-item>
              `
          )}
        </ha-button-menu>
      </div>
    `;
  }

  renderBattery() {
    const { battery_level, battery_icon } = this.getAttributes(this.entity);

    return html`
      <div class="tip" @click="${() => this.handleMore()}">
        <ha-icon icon="${battery_icon}"></ha-icon>
        <span class="icon-title">${battery_level}%</span>
      </div>
    `;
  }

  renderMapOrImage(state) {
    if (this.compactView) {
      return nothing;
    }

    if (this.map) {
      const map = this.hass.states[this.config.map];
      return map && map.attributes.entity_picture
        ? html`
            <img
              class="map"
              src="${map.attributes.entity_picture}&v=${Date.now()}"
              @click=${() => this.handleMore(this.config.map)}
            />
          `
        : nothing;
    }

    if (this.image) {
      return html`
        <img
          class="vacuum ${state}"
          src="${this.image}"
          @click="${() => this.handleMore()}"
        />
      `;
    }

    return nothing;
  }

  renderStats(state) {
    const { stats = {} } = this.config;

    const statsList = stats[state] || stats.default || [];

    return statsList.map(
      ({ entity_id, attribute, value_template, unit, subtitle }) => {
        if (!entity_id && !attribute && !value_template) {
          return nothing;
        }

        const state = entity_id
          ? this.hass.states[entity_id].state
          : get(this.entity.attributes, attribute);

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
      }
    );
  }

  renderName() {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.showName) {
      return nothing;
    }

    return html` <div class="vacuum-name">${friendly_name}</div> `;
  }

  renderStatus() {
    const { status } = this.getAttributes(this.entity);
    const localizedStatus = localize(`status.${status}`) || status;

    if (!this.showStatus) {
      return nothing;
    }

    return html`
      <div class="status">
        <span class="status-text" alt=${localizedStatus}>
          ${localizedStatus}
        </span>
        <mwc-circular-progress
          .indeterminate=${this.requestInProgress}
          density="-5"
        ></mwc-circular-progress>
      </div>
    `;
  }

  renderToolbar(state) {
    if (!this.showToolbar) {
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
            <paper-button @click="${this.handleAction('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
            <paper-button @click="${this.handleAction('stop')}">
              <ha-icon icon="hass:stop"></ha-icon>
              ${localize('common.stop')}
            </paper-button>
            <paper-button @click="${this.handleAction('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'paused': {
        return html`
          <div class="toolbar">
            <paper-button
              @click="${this.handleAction('resume', {
                defaultService: 'start',
              })}"
            >
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleAction('return_to_base')}">
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
              @click="${this.handleAction('resume', {
                defaultService: 'start',
              })}"
            >
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleAction('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
          </div>
        `;
      }
      case 'docked':
      case 'idle':
      default: {
        const { shortcuts = [] } = this.config;

        const buttons = shortcuts.map(
          ({ name, service, icon, service_data }) => {
            const execute = () => {
              this.callAction({ service, service_data });
            };
            return html`
              <ha-icon-button label="${name}" @click="${execute}">
                <ha-icon icon="${icon}"></ha-icon>
              </ha-icon-button>
            `;
          }
        );

        const dockButton = html`
          <ha-icon-button
            label="${localize('common.return_to_base')}"
            @click="${this.handleAction('return_to_base')}"
            ><ha-icon icon="hass:home-map-marker"></ha-icon>
          </ha-icon-button>
        `;

        return html`
          <div class="toolbar">
            <ha-icon-button
              label="${localize('common.start')}"
              @click="${this.handleAction('start')}"
              ><ha-icon icon="hass:play"></ha-icon>
            </ha-icon-button>

            <ha-icon-button
              label="${localize('common.locate')}"
              @click="${this.handleAction('locate', { isRequest: false })}"
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

  render() {
    if (!this.entity) {
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

    const { state } = this.entity;

    return html`
      <ha-card>
        <div class="preview">
          <div class="header">
            <div class="tips">
              ${this.renderSource()} ${this.renderWaterLevel()}
              ${this.renderBattery()}
            </div>
            <ha-icon-button
              class="more-info"
              icon="mdi:dots-vertical"
              ?more-info="true"
              @click="${() => this.handleMore()}"
              ><ha-icon icon="mdi:dots-vertical"></ha-icon
            ></ha-icon-button>
          </div>

          ${this.renderMapOrImage(state)}

          <div class="metadata">
            ${this.renderName()} ${this.renderStatus()}
          </div>

          <div class="stats">${this.renderStats(state)}</div>
        </div>

        ${this.renderToolbar(state)}
      </ha-card>
    `;
  }
}

customElements.define('vacuum-card', VacuumCard);

window.customCards = window.customCards || [];
window.customCards.push({
  preview: true,
  type: 'vacuum-card',
  name: localize('common.name'),
  description: localize('common.description'),
});
