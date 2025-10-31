/**********************************************************************
 * Matches Card - GUI Editor v1.1
 * Opis:
 *  Pełny edytor graficzny dla karty Matches Card.
 *  Umożliwia zmianę encji, nazw, czcionek, szerokości, kolorów itp.
 **********************************************************************/

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="card-config">

        <!-- === GŁÓWNE USTAWIENIA === -->
        <h3>Ustawienia główne</h3>
        <ha-entity-picker
          label="Sensor z meczami"
          .value=${this._config.entity || ""}
          allow-custom-entity
          domain-filter="sensor"
          @value-changed=${(e) => this._updateConfig("entity", e.detail.value)}>
        </ha-entity-picker>

        <ha-textfield
          label="Nazwa karty"
          .value=${this._config.name || ""}
          @input=${(e) => this._updateConfig("name", e.target.value)}>
        </ha-textfield>

        <div class="switches">
          <ha-switch
            .checked=${this._config.show_logos ?? true}
            @change=${(e) => this._updateConfig("show_logos", e.target.checked)}>
          </ha-switch><label>Pokaż herby</label>

          <ha-switch
            .checked=${this._config.full_team_names ?? true}
            @change=${(e) => this._updateConfig("full_team_names", e.target.checked)}>
          </ha-switch><label>Pełne nazwy</label>
        </div>

        <!-- === SZEROKOŚCI KOLUMN === -->
        <h3>Szerokości kolumn (%)</h3>
        ${["date", "league", "crest", "score", "result"].map((k) => `
          <ha-textfield
            label="${k.toUpperCase()}"
            type="number"
            min="0"
            max="40"
            .value=${this._config.columns_pct?.[k] ?? ""}
            @input=${(e) => this._updateNested("columns_pct", k, Number(e.target.value))}>
          </ha-textfield>`).join("")}

        <!-- === CZCIONKI === -->
        <h3>Rozmiary czcionek (em)</h3>
        ${["date", "teams", "score", "status", "result_letter"].map((k) => `
          <ha-textfield
            label="${k}"
            type="number"
            step="0.1"
            .value=${this._config.font_size?.[k] ?? ""}
            @input=${(e) => this._updateNested("font_size", k, Number(e.target.value))}>
          </ha-textfield>`).join("")}

        <!-- === KOLORY === -->
        <h3>Kolory wyników</h3>
        ${["win", "loss", "draw"].map((k) => `
          <ha-color-picker
            label="${k.toUpperCase()}"
            .value=${this._config.colors?.[k] ?? ""}
            @color-changed=${(e) => this._updateNested("colors", k, e.detail.value)}>
          </ha-color-picker>`).join("")}

      </div>
    `;
  }

  _updateConfig(prop, value) {
    if (!this._config) return;
    this._config = { ...this._config, [prop]: value };
    this._fireConfigChanged();
  }

  _updateNested(section, key, value) {
    this._config[section] = { ...this._config[section], [key]: value };
    this._fireConfigChanged();
  }

  _fireConfigChanged() {
    const event = new CustomEvent("config-changed", { detail: { config: this._config } });
    this.dispatchEvent(event);
  }

  set hass(hass) {}
}

customElements.define("matches-card-editor", MatchesCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Karta wyników meczów w stylu Sofascore (z GUI)",
});