import { LitElement, html } from 'lit-element';
import { hasConfigOrEntityChanged, fireEvent } from 'custom-card-helpers';
import get from 'lodash.get';
import './vacuum-card-editor';
import localize from './localize';
import styles from './styles';
import defaultImage from './vacuum.png';

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

  getAttributes(entity) {
    const {
      status,
      state,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
      detected_pad = null,
      tank_level = 0,
    } = entity.attributes;

    return {
      status: status || state || entity.state,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
      detected_pad,
      tank_level,
    };
  }

  renderMopSetting(source) {
    const [mopBehavior, amount] = source.split('-').map((x) => x.trim());
    const sprayAmount = {
      '1': 'Low',
      '2': 'Med',
      '3': 'High',
    }[amount];

    const behavior = mopBehavior;
    const spray = sprayAmount;

    return `${localize(`source.${behavior}}`) || behavior} - ${
      localize(`source.${spray}`) || spray
    }`;
  }

  renderSource() {
    const {
      fan_speed: source,
      fan_speed_list: sources,
      detected_pad: pad,
      tank_level: level,
    } = this.getAttributes(this.entity);

    if (!sources) {
      return html``;
    }

    const selected = sources.indexOf(source);

		let icon = 'fan';

    // In case this is actually a mop, check the pad type. If the water is empty, change the icon to alert.
		if (pad) {
			icon = pad.toLowerCase().indexOf('dry') < 0 ? 'water' : 'water-off';
			if (level === 0) icon = 'water-remove-outline';
			if (pad.toLowerCase() === 'invalid') icon = 'alert-circle';
		}

    const mopSetting = pad ? this.renderMopSetting(source) : null;

    return html`
      <paper-menu-button
        slot="dropdown-trigger"
        .horizontalAlign=${'right'}
        .verticalAlign=${'top'}
        .verticalOffset=${40}
        .noAnimations=${true}
        @click="${(e) => e.stopPropagation()}"
      >
        <paper-button slot="dropdown-trigger">
          <ha-icon icon="mdi:${`${icon}`}"></ha-icon>
          <span show=${true}>
            ${mopSetting
              ? `${mopSetting}`
              : localize(`source.${source}`) || `${source}`}
          </span>
        </paper-button>
        <paper-listbox
          slot="dropdown-content"
          selected=${selected}
          @click="${(e) => this.handleSpeed(e)}"
        >
          ${sources.map(
            (item) =>
              html`<paper-item value=${item}
                >${mopSetting
                  ? `${this.renderMopSetting(item)}`
                  : localize(`source.${item}`) || item}</paper-item
              >`
          )}
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  renderMapOrImage(state) {
    if (this.compactView) {
      return html``;
    }

    if (this.map) {
      return this.hass.states[this.config.map] &&
        this.hass.states[this.config.map].attributes.entity_picture
        ? html`<img
            class="map"
            src="${this.hass.states[this.config.map].attributes
              .entity_picture}&v=${+new Date()}"
          />`
        : html``;
    }

    if (this.image) {
      return html`<img class="vacuum ${state}" src="${this.image}" />`;
    }

    return html``;
  }

  renderStats(state) {
    const { stats = {} } = this.config;

    const statsList = stats[state] || stats.default || [];

    return statsList.map(({ entity_id, attribute, unit, subtitle }) => {
      if (!entity_id && !attribute) {
        return html``;
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
      return html``;
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
      return html``;
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
      return html``;
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
            <paper-button @click="${() => this.callService('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
            <paper-button @click="${() => this.callService('stop')}">
              <ha-icon icon="hass:stop"></ha-icon>
              ${localize('common.stop')}
            </paper-button>
            <paper-button @click="${() => this.callService('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'paused': {
        return html`
          <div class="toolbar">
            <paper-button @click="${() => this.callService('start')}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${() => this.callService('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
      }

      case 'returning': {
        return html`
          <div class="toolbar">
            <paper-button @click="${() => this.callService('start')}">
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${() => this.callService('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
          </div>
        `;
      }
      case 'docked':
      case 'idle':
      default: {
        const { actions = [] } = this.config;

        const buttons = actions.map(({ name, service, icon, service_data }) => {
          const execute = () => {
            const [domain, name] = service.split('.');
            this.hass.callService(domain, name, service_data);
          };
          return html`<ha-icon-button
            icon="${icon}"
            title="${name}"
            @click="${execute}"
          ></ha-icon-button>`;
        });

        const dockButton = html`
          <ha-icon-button
            icon="hass:home-map-marker"
            title="${localize('common.return_to_base')}"
            @click="${() => this.callService('return_to_base')}"
          >
          </ha-icon-button>
        `;

        return html`
          <div class="toolbar">
            <ha-icon-button
              icon="hass:play"
              title="${localize('common.start')}"
              @click="${() => this.callService('start')}"
            >
            </ha-icon-button>

            <ha-icon-button
              icon="mdi:map-marker"
              title="${localize('common.locate')}"
              @click="${() => this.callService('locate', false)}"
            >
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
        <div
          class="preview"
          @click="${() => this.handleMore()}"
          ?more-info="true"
        >
          <div class="header">
            <div class="source">
              ${this.renderSource()}
            </div>
            <div class="battery">
              ${battery_level}% <ha-icon icon="${battery_icon}"></ha-icon>
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
