import { LitElement, html, css } from 'lit-element';
import { fireEvent } from 'custom-card-helpers';
import localize from './localize';

export class VacuumCardEditor extends LitElement {
  static get properties() {
    return {
      hass: Object,
      _config: Object,
      _toggle: Boolean,
    };
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

  get _show_name() {
    if (this._config) {
      return this._config.show_name || true;
    }

    return '';
  }

  get _show_status() {
    if (this._config) {
      return this._config.show_status || true;
    }

    return '';
  }

  get _show_toolbar() {
    if (this._config) {
      return this._config.show_toolbar || true;
    }

    return true;
  }

  get _compact_view() {
    if (this._config) {
      return this._config.compact_view || false;
    }

    return false;
  }

  get _show_startbutton() {
    if (typeof this._config.show_startbutton == 'boolean') {
      return this._config.show_startbutton;
    }

    return true;
  }

  get _show_locatebutton() {
    if (typeof this._config.show_locatebutton == 'boolean') {
      return this._config.show_locatebutton;
    }

    return true;
  }

  getEntitiesByType(type) {
    return Object.keys(this.hass.states).filter(
      (eid) => eid.substr(0, eid.indexOf('.')) === type
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
          label="${localize('editor.entity')}"
          @value-changed=${this._valueChanged}
          .configValue=${'entity'}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${vacuumEntities.indexOf(this._entity)}
          >
            ${vacuumEntities.map((entity) => {
              return html` <paper-item>${entity}</paper-item> `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu
          label="${localize('editor.entity')}"
          @value-changed=${this._valueChanged}
          .configValue=${'map'}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${cameraEntities.indexOf(this._map)}
          >
            ${cameraEntities.map((entity) => {
              return html` <paper-item>${entity}</paper-item> `;
            })}
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-input
          label="${localize('editor.image')}"
          .value=${this._image}
          .configValue=${'image'}
          @value-changed=${this._valueChanged}
        ></paper-input>

        <p class="option">
          <ha-switch
            aria-label=${localize(
              this._compact_view
                ? 'editor.compact_view_aria_label_off'
                : 'editor.compact_view_aria_label_on'
            )}
            .checked=${this._compact_view !== false}
            .configValue=${'compact_view'}
            @change=${this._valueChanged}
          >
          </ha-switch>
          ${localize('editor.compact_view')}
        </p>

        <p class="option">
          <ha-switch
            aria-label=${localize(
              this._show_name
                ? 'editor.show_name_aria_label_off'
                : 'editor.show_name_aria_label_on'
            )}
            .checked=${this._show_name !== false}
            .configValue=${'show_name'}
            @change=${this._valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_name')}
        </p>

        <p class="option">
          <ha-switch
            aria-label=${localize(
              this._show_status
                ? 'editor.show_status_aria_label_off'
                : 'editor.show_status_aria_label_on'
            )}
            .checked=${this._show_status !== false}
            .configValue=${'show_status'}
            @change=${this._valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_status')}
        </p>

        <p class="option">
          <ha-switch
            aria-label=${localize(
              this._show_name
                ? 'editor.show_toolbar_aria_label_off'
                : 'editor.show_toolbar_aria_label_on'
            )}
            .checked=${this._show_toolbar !== false}
            .configValue=${'show_toolbar'}
            @change=${this._valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_toolbar')}
        </p>

        <p class="option">
          <ha-switch
            aria-label=${localize(
              this._show_startbutton
                ? 'editor.show_startbutton_aria_label_off'
                : 'editor.show_startbutton_aria_label_on'
            )}
            .checked=${this._show_startbutton !== false}
            .configValue=${'show_startbutton'}
            @change=${this._valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_startbutton')}
        </p>

        <p class="option">
          <ha-switch
            aria-label=${localize(
              this._show_locatebutton
                ? 'editor.show_locatebutton_aria_label_off'
                : 'editor.show_locatebutton_aria_label_on'
            )}
            .checked=${this._show_locatebutton !== false}
            .configValue=${'show_locatebutton'}
            @change=${this._valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_locatebutton')}
        </p>

        <strong>
          ${localize('editor.code_only_note')}
        </strong>
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
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
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

      .option {
        display: flex;
        align-items: center;
      }

      .option ha-switch {
        margin-right: 10px;
      }
    `;
  }
}

customElements.define('vacuum-card-editor', VacuumCardEditor);
