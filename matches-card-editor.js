class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
  }

  set hass(hass) {
    this._hass = hass;
  }

  _updateConfig(changes) {
    this._config = { ...this._config, ...changes };
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: this._config } })
    );
  }

  render() {
    if (!this._hass) return;
    const c = this._config;

    return `
      <div class="card-config">
        <ha-entity-picker
          label="Encja (sensor)"
          .hass="${this._hass}"
          .value="${c.entity || ""}"
          include-domains='["sensor"]'
          @value-changed="${(e) => this._updateConfig({ entity: e.detail.value })}">
        </ha-entity-picker>

        <ha-textfield
          label="Tytuł karty"
          .value="${c.name || ""}"
          @input="${(e) => this._updateConfig({ name: e.target.value })}">
        </ha-textfield>

        <ha-switch
          .checked="${c.show_logos ?? true}"
          @change="${(e) => this._updateConfig({ show_logos: e.target.checked })}">
          Pokaż herby drużyn
        </ha-switch>

        <ha-switch
          .checked="${c.hover_enabled ?? false}"
          @change="${(e) => this._updateConfig({ hover_enabled: e.target.checked })}">
          Włącz efekt podświetlenia (hover)
        </ha-switch>

        <ha-textfield
          label="Kolor cienia (hover)"
          .value="${c.hover_shadow_color || 'rgba(0,0,0,0.2)'}"
          @input="${(e) => this._updateConfig({ hover_shadow_color: e.target.value })}">
        </ha-textfield>

        <ha-select
          label="Wyrównanie nazw drużyn"
          .value="${c.alignment || 'left'}"
          @selected="${(e) => this._updateConfig({ alignment: e.target.value })}">
          <mwc-list-item value="left">Lewo</mwc-list-item>
          <mwc-list-item value="center">Środek</mwc-list-item>
          <mwc-list-item value="right">Prawo</mwc-list-item>
        </ha-select>

        <ha-number-input
          label="Rozmiar czcionki (px)"
          .value="${c.font_size || 14}"
          min="10"
          max="30"
          step="1"
          @value-changed="${(e) => this._updateConfig({ font_size: Number(e.detail.value) })}">
        </ha-number-input>

        <h4>Szerokości kolumn (%)</h4>
        <ha-number-input label="Data" .value="${c.column_widths?.date || 12}" min="5" max="30"
          @value-changed="${(e) => this._updateColumn('date', e.detail.value)}"></ha-number-input>
        <ha-number-input label="Liga" .value="${c.column_widths?.league || 8}" min="5" max="30"
          @value-changed="${(e) => this._updateColumn('league', e.detail.value)}"></ha-number-input>
        <ha-number-input label="Herb" .value="${c.column_widths?.logo || 12}" min="5" max="30"
          @value-changed="${(e) => this._updateColumn('logo', e.detail.value)}"></ha-number-input>
        <ha-number-input label="Wynik" .value="${c.column_widths?.score || 10}" min="5" max="30"
          @value-changed="${(e) => this._updateColumn('score', e.detail.value)}"></ha-number-input>
        <ha-number-input label="Ikona W/P/R" .value="${c.column_widths?.result || 8}" min="5" max="30"
          @value-changed="${(e) => this._updateColumn('result', e.detail.value)}"></ha-number-input>
      </div>
    `;
  }

  _updateColumn(col, value) {
    const widths = { ...this._config.column_widths, [col]: Number(value) };
    this._updateConfig({ column_widths: widths });
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
