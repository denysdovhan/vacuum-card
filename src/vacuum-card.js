import { LitElement, html } from 'lit-element';
import { hasConfigOrEntityChanged, fireEvent } from 'custom-card-helpers';
import './vacuum-card-editor';
import localize from './localize';
import styles from './styles';
import defaultImage from './vacuum.png';

class VacuumCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      mapUrl: String,
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
    return 2;
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  updated(changedProps) {
    if (this.map) {
      const url =
        this.map.attributes.entity_picture + `&t=${new Date().getTime()}`;
      const img = new Image();
      img.onload = () => {
        this.mapUrl = url;
      };
      img.src = url;
    }

    if (
      changedProps.get('hass') &&
      changedProps.get('hass').states[this.config.entity].state !==
        this.hass.states[this.config.entity].state
    ) {
      this.requestInProgress = false;
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
    this.callService('set_fan_speed', { fan_speed });
  }

  callService(service, options = {}) {
    this.hass.callService('vacuum', service, {
      entity_id: this.config.entity,
      ...options,
    });
    this.requestInProgress = true;
    this.requestUpdate();
  }

  getAttributes(entity) {
    const {
      status,
      fan_speed,
      fan_speed_list,
      battery_level,
      battery_icon,
      friendly_name,
      valetudo_state,
    } = entity.attributes;

    const valetudoStatus = valetudo_state ? valetudo_state.name : '';

    return {
      status: status || valetudoStatus,
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
      return html``;
    }

    const selected = sources.indexOf(source);

    return html` <paper-menu-button
      slot="dropdown-trigger"
      .horizontalAlign=${'right'}
      .verticalAlign=${'top'}
      .verticalOffset=${40}
      .noAnimations=${true}
      @click="${(e) => e.stopPropagation()}"
    >
      <paper-button class="source-menu__button" slot="dropdown-trigger">
        <span class="source-menu__source" show=${true}>
          ${source}
        </span>
        <ha-icon icon="mdi:fan"></ha-icon>
      </paper-button>
      <paper-listbox
        slot="dropdown-content"
        selected=${selected}
        @click="${(e) => this.handleSpeed(e)}"
      >
        ${sources.map(
          (item) => html`<paper-item value=${item}>${item}</paper-item>`
        )}
      </paper-listbox>
    </paper-menu-button>`;
  }

  renderMapOrImage(state) {
    if (this.compactView) {
      return html``;
    }

    if (this.map) {
      return html` <img class="map" src="${this.mapUrl}" /> `;
    }

    if (this.image) {
      return html` <img class="vacuum ${state}" src="${this.image}" /> `;
    }

    return html``;
  }

  renderStats(state) {
    const { stats = {} } = this.config;

    const statsList = stats[state] || stats.default || [];

    return statsList.map(({ attribute, unit, subtitle }) => {
      return html`
        <div class="stats-block">
          <span class="stats-hours">${this.entity.attributes[attribute]}</span>
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

  renderToolbar(state) {
    if (!this.showToolbar) {
      return html``;
    }

    switch (state) {
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
          return html`<paper-icon-button
            icon="${icon}"
            title="${name}"
            @click="${execute}"
          ></paper-icon-button>`;
        });

        const dockButton = html`
          <paper-icon-button
            icon="hass:home-map-marker"
            title="${localize('common.return_to_base')}"
            class="toolbar-icon"
            @click="${() => this.callService('return_to_base')}"
          >
          </paper-icon-button>
        `;

        return html`
          <div class="toolbar">
            <paper-icon-button
              icon="hass:play"
              title="${localize('common.start')}"
              class="toolbar-icon"
              @click="${() => this.callService('start')}"
            >
            </paper-icon-button>

            <paper-icon-button
              icon="mdi:crosshairs-gps"
              title="${localize('common.locate')}"
              class="toolbar-split"
              @click="${() => this.callService('locate')}"
            >
            </paper-icon-button>

            ${state === 'idle' ? dockButton : ''}
            <div class="fill-gap"></div>
            ${buttons}
          </div>
        `;
      }
    }
  }

  render() {
    const { state } = this.entity;
    const { status, battery_level, battery_icon } = this.getAttributes(
      this.entity
    );
    const localizedStatus = localize(`status.${status}`) || status;

    return html`
      <ha-card>
        <div
          class="preview"
          @click="${() => this.handleMore()}"
          ?more-info="true"
        >
          <div class="header">
            <div class="status">
              <span class="status-text" alt=${localizedStatus}>
                ${localizedStatus}
              </span>
              <paper-spinner ?active=${this.requestInProgress}></paper-spinner>
            </div>
            <div class="source">
              ${this.renderSource()}
            </div>
            <div class="battery">
              ${battery_level}% <ha-icon icon="${battery_icon}"></ha-icon>
            </div>
          </div>

          ${this.renderMapOrImage(state)} ${this.renderName()}

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
