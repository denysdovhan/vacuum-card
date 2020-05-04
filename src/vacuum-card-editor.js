import { LitElement, html, css } from 'lit-element';
import { fireEvent } from 'custom-card-helpers';

export class VacuumCardEditor extends LitElement {
  static get properties() {
    return {
      hass: Object,
      _config: Object,
      _toggle: Boolean
    }
  }

  setConfig(config) {    
    this._config = config;

    if (!this._config.entity) {
      this._config.entity = this.getEntitiesByType('vacuum')[0] || '';
      fireEvent(this, 'config-changed', { config: this._config });
    }
  }

  get _entity() {
    if (this._config) {
      return this._config.entity || '';
    }

    return '';
  }

  get _map() {
    if (this._config) {
      return this._config.map || '';
    }

    return '';
  }

  get _image() {
    if (this._config) {
      return this._config.image || '';
    }

    return '';
  }

  getEntitiesByType(type) {
    return Object.keys(this.hass.states).filter(
      eid => eid.substr(0, eid.indexOf('.')) === type
    );
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    const vacuumEntities = this.getEntitiesByType('vacuum');
    const cameraEntities = this.getEntitiesByType('camera');

    return html`
      <div class="card-config">
        <paper-dropdown-menu
          label="Entity (Required)"
          @value-changed=${this._valueChanged}
          .configValue=${'entity'}
        >
          <paper-listbox slot="dropdown-content" .selected=${vacuumEntities.indexOf(this._entity)}>
            ${vacuumEntities.map(entity => {
              return html`
                <paper-item>${entity}</paper-item>
              `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu
          label="Map Camera (Optional)"
          @value-changed=${this._valueChanged}
          .configValue=${'map'}
        >
          <paper-listbox slot="dropdown-content" .selected=${cameraEntities.indexOf(this._map)}>
            ${cameraEntities.map(entity => {
              return html`
                <paper-item>${entity}</paper-item>
              `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-input
          label="Image (Optional)"
          .value=${this._image}
          .configValue=${'image'}
          @value-changed=${this._valueChanged}
        ></paper-input>

        <p>Note: Setting actions are available exclusively using Code Editor.</p>
      </div>
    `;
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
      .card-config paper-dropdown-menu {
        width: 100%;
      }
    `;
  }
}

customElements.define('vacuum-card-editor', VacuumCardEditor);