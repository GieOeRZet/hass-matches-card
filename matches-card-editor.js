class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  _update(ev) {
    if (!this._config) return;
    const target = ev.target;
    const newConfig = { ...this._config };

    if (target.configKey) {
      newConfig[target.configKey] = target.checked ?? target.value;
    }

    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }

  render() {
    const c = this._config;
    return `
      <div class="card-config">
        <ha-entity-picker
          label="Encja (sensor)"
          .value="${c.entity || ""}"
          .configKey="entity"
          domain-filter="sensor"
          @value-changed="${this._update}"
        ></ha-entity-picker>

        <paper-input
          label="Nazwa karty"
          .value="${c.name || ""}"
          .configKey="name"
          @value-changed="${this._update}"
        ></paper-input>

        <ha-switch
          .checked="${c.show_logos}"
          .configKey="show_logos"
          @change="${this._update}"
        >Pokaż herby</ha-switch>

        <ha-switch
          .checked="${c.full_team_names}"
          .configKey="full_team_names"
          @change="${this._update}"
        >Pełne nazwy drużyn</ha-switch>
      </div>
    `;
  }

  set hass(hass) {
    this._hass = hass;
    if (this.isConnected) this.innerHTML = this.render();
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);