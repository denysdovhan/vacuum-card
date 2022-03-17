import { LitElement, html } from 'lit-element';
import { nothing } from 'lit-html';
import { hasConfigOrEntityChanged, fireEvent } from 'custom-card-helpers';
import get from 'lodash.get';
import './vacuum-card-editor';
import localize from './localize';
import styles from './styles.css';
import defaultImage from './vacuum.svg';
import { version } from '../package.json';

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

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
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

  handleMore() {
    fireEvent(
      this,
      'hass-more-info',
      {
        entityId: this.entity.entity_id,
      },
      {
        bubbles: true,
        composed: true,
      }
    );
  }

  handleSpeed(e) {
    const fan_speed = e.target.getAttribute('value');
    this.callService('set_fan_speed', false, { fan_speed });
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

  handleStop() {
    const actions = this.config.actions;
    if (!actions || !actions.stop) {
      this.callService('stop');
      return;
    }

    this.callAction(actions.stop);
  }

  handleLocate() {
    const actions = this.config.actions;
    if (!actions || !actions.locate) {
      this.callService('locate', false);
      return;
    }

    this.callAction(actions.locate);
  }

  handleReturnToBase() {
    const actions = this.config.actions;
    if (!actions || !actions.return_to_base) {
      this.callService('return_to_base');
      return;
    }

    this.callAction(actions.return_to_base);
  }

  callService(service, isRequest = true, options = {}) {
    this.hass.callService('vacuum', service, {
      entity_id: this.config.entity,
      ...options,
    });

    if (isRequest) {
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

    if (!sources) {
      return nothing;
    }

    const selected = sources.indexOf(source);

    return html`
      <ha-button-menu @click="${(e) => e.stopPropagation()}">
        <mmp-icon-button slot="trigger">
          <ha-icon icon="mdi:fan"></ha-icon>
          <span class="icon-title">
            ${localize(`source.${source}`) || source}
          </span>
        </mmp-icon-button>
        ${sources.map(
          (item, index) =>
            html`<mwc-list-item
              ?activated=${selected === index}
              value=${item}
              @click=${(e) => this.handleSpeed(e)}
            >
              ${localize(`source.${item}`) || item}
            </mwc-list-item>`
        )}
      </ha-button-menu>
    `;
  }

  renderMapOrImage(state) {
    if (this.compactView) {
      return nothing;
    }

    if (this.map) {
      return this.hass.states[this.config.map] &&
        this.hass.states[this.config.map].attributes.entity_picture
        ? html`<img
            class="map"
            src="${this.hass.states[this.config.map].attributes
              .entity_picture}&v=${+new Date()}"
          />`
        : nothing;
    }

    if (this.image) {
      return html`<img class="vacuum ${state}" src="${this.image}" />`;
    }

    return nothing;
  }

  renderStats(state) {
    const { stats = {} } = this.config;

    const statsList = stats[state] || stats.default || [];

    return statsList.map(({ entity_id, attribute, unit, subtitle }) => {
      if (!entity_id && !attribute) {
        return nothing;
      }

      const value = entity_id
        ? this.hass.states[entity_id].state
        : get(this.entity.attributes, attribute);

      return html`
        <div class="stats-block">
          <span class="stats-value">${value}</span>
          ${unit}
          <div class="stats-subtitle">${subtitle}</div>
        </div>
      `;
    });
  }

  renderName() {
    const { friendly_name } = this.getAttributes(this.entity);

    if (!this.showName) {
      return nothing;
    }

    return html`
      <div class="vacuum-name">
        ${friendly_name}
      </div>
    `;
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
        <ha-circular-progress
          .active=${this.requestInProgress}
          size="small"
        ></ha-circular-progress>
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
            <paper-button @click="${this.handlePause}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
            <paper-button @click="${this.handleStop}">
              <ha-icon icon="hass:stop"></ha-icon>
              ${localize('common.stop')}
            </paper-button>
            <paper-button @click="${this.handleReturnToBase}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'paused': {
        return html`
          <div class="toolbar">
            <paper-button @click="${this.handleResume}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleReturnToBase}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'returning': {
        return html`
          <div class="toolbar">
            <paper-button @click="${this.handleResume}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handlePause}">
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
          ({ name, service, icon, service_data, link }) => {
            if (link) {
              return html`<ha-icon-button title="${name}"
                ><a rel="noreferrer" href="${link}" target="_blank"><ha-icon icon="${icon}"></ha-icon
              ></ha-icon-button>`;
            } else {
              const execute = () => {
                this.callAction({ service, service_data });
              };
              return html`<ha-icon-button title="${name}" @click="${execute}"
                ><ha-icon icon="${icon}"></ha-icon
              ></ha-icon-button>`;
            }
          }
        );

        const dockButton = html`
          <ha-icon-button
            title="${localize('common.return_to_base')}"
            @click="${this.handleReturnToBase}"
            ><ha-icon icon="hass:home-map-marker"></ha-icon>
          </ha-icon-button>
        `;

        return html`
          <div class="toolbar">
            <ha-icon-button
              title="${localize('common.start')}"
              @click="${this.handleStart}"
              ><ha-icon icon="hass:play"></ha-icon>
            </ha-icon-button>

            <ha-icon-button
              title="${localize('common.locate')}"
              @click="${this.handleLocate}"
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
    const { battery_level, battery_icon } = this.getAttributes(this.entity);

    return html`
      <ha-card>
        <div class="preview" @click="${this.handleMore}" ?more-info="true">
          <div class="header">
            <div class="source">
              ${this.renderSource()}
            </div>
            <div class="battery">
              <span class="icon-title">${battery_level}%</span>
              <ha-icon icon="${battery_icon}"></ha-icon>
            </div>
          </div>

          ${this.renderMapOrImage(state)}

          <div class="metadata">
            ${this.renderName()} ${this.renderStatus()}
          </div>

          <div class="stats">
            ${this.renderStats(state)}
          </div>
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
