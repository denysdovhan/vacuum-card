import { LitElement, html } from 'lit-element';
import { fireEvent } from 'custom-card-helpers';

const options = {
  required: {
    icon: 'tune',
    name: 'Required',
    secondary: 'Required options for this card to function',
    show: true,
  },
  actions: {
    icon: 'gesture-tap-hold',
    name: 'Actions',
    secondary: 'Perform actions based on tapping/clicking',
    show: false,
    options: {
      tap: {
        icon: 'gesture-tap',
        name: 'Tap',
        secondary: 'Set the action to perform on tap',
        show: false,
      },
      hold: {
        icon: 'gesture-tap-hold',
        name: 'Hold',
        secondary: 'Set the action to perform on hold',
        show: false,
      },
      double_tap: {
        icon: 'gesture-double-tap',
        name: 'Double Tap',
        secondary: 'Set the action to perform on double tap',
        show: false,
      },
    },
  },
  appearance: {
    icon: 'palette',
    name: 'Appearance',
    secondary: 'Customize the name, icon, etc',
    show: false,
  },
};

export class VacuumCardEditor extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      toggle: Object,
    };
  }

  setConfig(config) {
    this.config = config;
  }

  get entity() {
    if (this.config) {
      return this.config.entity || '';
    }

    return '';
  }

  get actions() {
    if (this.config) {
      return this.config.actions || [];
    }

    return [];
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    // You can restrict on domain type
    const entities = Object.keys(this.hass.states).filter(eid => eid.substr(0, eid.indexOf('.')) === 'vacuum');

    return html`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${'required'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.required.icon}`}></ha-icon>
            <div class="title">${options.required.name}</div>
          </div>
          <div class="secondary">${options.required.secondary}</div>
        </div>
        ${options.required.show
          ? html`
              <div class="values">
                <paper-dropdown-menu
                  label="Entity (Required)"
                  @value-changed=${this._valueChanged}
                  .configValue=${'entity'}
                >
                  <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._entity)}>
                    ${entities.map(entity => {
                      return html`
                        <paper-item>${entity}</paper-item>
                      `;
                    })}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'actions'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.actions.icon}`}></ha-icon>
            <div class="title">${options.actions.name}</div>
          </div>
          <div class="secondary">${options.actions.secondary}</div>
        </div>
        ${options.actions.show
          ? html`
              <div class="values">
                <div class="option" @click=${this._toggleAction} .option=${'tap'}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${options.actions.options.tap.icon}`}></ha-icon>
                    <div class="title">${options.actions.options.tap.name}</div>
                  </div>
                  <div class="secondary">${options.actions.options.tap.secondary}</div>
                </div>
                ${options.actions.options.tap.show
                  ? html`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `
                  : ''}
                <div class="option" @click=${this._toggleAction} .option=${'hold'}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${options.actions.options.hold.icon}`}></ha-icon>
                    <div class="title">${options.actions.options.hold.name}</div>
                  </div>
                  <div class="secondary">${options.actions.options.hold.secondary}</div>
                </div>
                ${options.actions.options.hold.show
                  ? html`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `
                  : ''}
                <div class="option" @click=${this._toggleAction} .option=${'double_tap'}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${options.actions.options.double_tap.icon}`}></ha-icon>
                    <div class="title">${options.actions.options.double_tap.name}</div>
                  </div>
                  <div class="secondary">${options.actions.options.double_tap.secondary}</div>
                </div>
                ${options.actions.options.double_tap.show
                  ? html`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `
                  : ''}
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'appearance'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.appearance.icon}`}></ha-icon>
            <div class="title">${options.appearance.name}</div>
          </div>
          <div class="secondary">${options.appearance.secondary}</div>
        </div>
        ${options.appearance.show
          ? html`
              <div class="values">
                <paper-input
                  label="Name (Optional)"
                  .value=${this._name}
                  .configValue=${'name'}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <br />
                <ha-switch
                  aria-label=${`Toggle warning ${this._show_warning ? 'off' : 'on'}`}
                  .checked=${this._show_warning !== false}
                  .configValue=${'show_warning'}
                  @change=${this._valueChanged}
                  >Show Warning?</ha-switch
                >
                <ha-switch
                  aria-label=${`Toggle error ${this._show_error ? 'off' : 'on'}`}
                  .checked=${this._show_error !== false}
                  .configValue=${'show_error'}
                  @change=${this._valueChanged}
                  >Show Error?</ha-switch
                >
              </div>
            `
          : ''}
      </div>
    `;
  }

  _toggleAction(ev) {
    this._toggleThing(ev, options.actions.options);
  }

  _toggleOption(ev) {
    this._toggleThing(ev, options);
  }

  _toggleThing(ev, optionList) {
    const show = !optionList[ev.target.option].show;
    for (const [key] of Object.entries(optionList)) {
      optionList[key].show = false;
    }
    optionList[ev.target.option].show = show;
    this._toggle = !this._toggle;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles() {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
      }
      ha-switch {
        padding-bottom: 8px;
      }
    `;
  }
}

customElements.define('vacuum-card-editor', VacuumCard);