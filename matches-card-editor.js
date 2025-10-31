/*********************************************************************
 *  MATCHES CARD EDITOR
 *  GUI edytor dla Matches Card (v0.2_b)
 *********************************************************************/

const LitElement = customElements.get("hui-text-element")?.prototype.__proto__.__proto__.constructor;
const html = LitElement.prototype.html;

class MatchesCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  setConfig(config) {
    this._config = config;
  }

  get value() {
    return this._config;
  }

  render() {
    if (!this._config) return html``;
    return html`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor (tylko 90minut)"
          .hass=${this.hass}
          .value=${this._config.entity}
          .configValue=${"entity"}
          domain-filter="sensor"
          @value-changed=${this._valueChanged}
          allow-custom-entity
        ></ha-entity-picker>

        <paper-input
          label="Nazwa karty"
          .value=${this._config.name || ""}
          .configValue=${"name"}
          @value-changed=${this._valueChanged}
        ></paper-input>

        <ha-switch
          .checked=${this._config.show_logos ?? true}
          .configValue=${"show_logos"}
          @change=${this._valueChanged}
        >Pokaż herby</ha-switch>

        <ha-switch
          .checked=${this._config.full_team_names ?? true}
          .configValue=${"full_team_names"}
          @change=${this._valueChanged}
        >Pełne nazwy drużyn</ha-switch>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const value = target.checked ?? target.value;
    const key = target.configValue;
    if (this._config[key] === value) return;
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);