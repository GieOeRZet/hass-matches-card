class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
  }

  set hass(hass) {
    this.hass = hass;
  }

  _updateConfig(changes) {
    const newConfig = { ...this._config, ...changes };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }

  render() {
    const c = this._config;
    return window.litHtml`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor"
          .value=${c.entity}
          .hass=${this.hass}
          @value-changed=${(e) => this._updateConfig({ entity: e.detail.value })}
          allow-custom-entity
        ></ha-entity-picker>
        <ha-textfield
          label="Nazwa karty"
          .value=${c.name || ""}
          @input=${(e) => this._updateConfig({ name: e.target.value })}
        ></ha-textfield>

        <ha-switch
          .checked=${c.show_logos ?? true}
          @change=${(e) => this._updateConfig({ show_logos: e.target.checked })}
        >Pokaż herby</ha-switch>

        <ha-switch
          .checked=${c.full_team_names ?? true}
          @change=${(e) => this._updateConfig({ full_team_names: e.target.checked })}
        >Pełne nazwy</ha-switch>

        <ha-formfield label="Kolor Wygranej">
          <ha-color-picker
            .value=${c.colors?.win || "#3ba55d"}
            @value-changed=${(e) =>
              this._updateConfig({ colors: { ...c.colors, win: e.detail.value } })}
          ></ha-color-picker>
        </ha-formfield>

        <ha-formfield label="Kolor Przegranej">
          <ha-color-picker
            .value=${c.colors?.loss || "#e23b3b"}
            @value-changed=${(e) =>
              this._updateConfig({ colors: { ...c.colors, loss: e.detail.value } })}
          ></ha-color-picker>
        </ha-formfield>

        <ha-formfield label="Kolor Remisu">
          <ha-color-picker
            .value=${c.colors?.draw || "#468cd2"}
            @value-changed=${(e) =>
              this._updateConfig({ colors: { ...c.colors, draw: e.detail.value } })}
          ></ha-color-picker>
        </ha-formfield>

        <ha-textfield
          label="Rozmiar czcionki drużyn"
          type="number"
          .value=${c.font_size?.teams || 1}
          @input=${(e) =>
            this._updateConfig({ font_size: { ...c.font_size, teams: parseFloat(e.target.value) } })}
        ></ha-textfield>

        <ha-textfield
          label="Szerokość kolumny daty (%)"
          type="number"
          .value=${c.columns_pct?.date || 10}
          @input=${(e) =>
            this._updateConfig({
              columns_pct: { ...c.columns_pct, date: parseFloat(e.target.value) },
            })}
        ></ha-textfield>
      </div>
    `;
  }

  get value() {
    return this._config;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Custom matches table card with GUI editor",
});