// ============================================================================
//  Matches Card (90minut) – GUI Editor v0.3.001
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  _updateConfig(changes) {
    this._config = { ...this._config, ...changes };
    const e = new Event("config-changed", { bubbles: true, composed: true });
    e.detail = { config: this._config };
    this.dispatchEvent(e);
  }

  render() {
    if (!this._config) return;
    const cfg = this._config;

    return html`
      <ha-form
        .schema=${[
          { name: "entity", label: "Encja", selector: { entity: { domain: "sensor" } } },
          { name: "name", label: "Nazwa karty", selector: { text: {} } },
          { name: "show_name", label: "Pokaż nazwę karty", selector: { boolean: {} } },
          { name: "show_logos", label: "Pokaż herby drużyn", selector: { boolean: {} } },
          { name: "full_team_names", label: "Pełne nazwy drużyn", selector: { boolean: {} } },
          { name: "show_symbols", label: "W/P/R symbole", selector: { boolean: {} } },
          {
            name: "fill",
            label: "Wypełnienie",
            selector: { select: { options: ["system", "zebra", "gradient"] } },
          },
          {
            name: "gradient.start",
            label: "Start gradientu (%)",
            selector: { number: { min: 0, max: 100, step: 1 } },
          },
          {
            name: "gradient.alpha",
            label: "Przezroczystość gradientu (0–1)",
            selector: { number: { min: 0, max: 1, step: 0.05 } },
          }
        ]}
        .data=${cfg}
        @value-changed=${(e) => this._updateConfig(e.detail.value)}
      ></ha-form>
    `;
  }

  set hass(hass) {
    this._hass = hass;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);