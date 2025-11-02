// ============================================================================
//  Matches Card Editor – v0.3.008b
//  - Naprawa błędu .bind(undefined)
//  - Usunięty tryb demo
//  - Pełna kompatybilność z matches-card.js v0.3.008
//  - Automatyczne ładowanie przez HACS (resource entry)
// ============================================================================

import "@material/mwc-button";
import "@material/mwc-switch";
import "@material/mwc-formfield";
import "@polymer/paper-input/paper-input.js";

class MatchesCardEditor extends HTMLElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _showAdvanced: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._showAdvanced = false;
  }

  setConfig(config) {
    this._config = config || {};
    this._render();
  }

  _render() {
    if (!this.shadowRoot) return;

    const style = `
      <style>
        :host { display: block; font-family: var(--paper-font-body1_-_font-family); }
        .card-config { padding: 12px 16px; }
        .section { margin-top: 16px; }
        .section h3 { margin: 8px 0; font-size: 1em; opacity: 0.8; }
        ha-form { display: block; margin-top: 8px; }
      </style>`;

    const schema = [
      { name: "entity", label: "Encja (sensor.90minut...)", selector: { entity: {} } },
      { name: "fill", label: "Tryb wypełnienia", selector: { select: {
        options: ["gradient", "zebra", "none"] } } },
      { name: "show_logos", label: "Pokaż loga drużyn", selector: { boolean: {} } },
      { name: "show_result_symbol", label: "Pokaż symbol wyniku", selector: { boolean: {} } },
      { name: "gradient.alpha", label: "Przezroczystość gradientu (0–1)", selector: { number: { min: 0, max: 1, step: 0.1 } } },
      { name: "gradient.start", label: "Początek gradientu (%)", selector: { number: { min: 0, max: 100, step: 1 } } },
      { name: "gradient.end", label: "Koniec gradientu (%)", selector: { number: { min: 0, max: 100, step: 1 } } },
    ];

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="card-config">
        <ha-form .hass="${this.hass}" .schema="${schema}" .data="${this._config}"></ha-form>
        <div class="section">
          <mwc-button @click="${() => this._toggleAdvanced()}">
            ${this._showAdvanced ? "Ukryj zaawansowane" : "Pokaż zaawansowane"}
          </mwc-button>
          ${this._showAdvanced ? this._renderAdvanced() : ""}
        </div>
        <div style="margin-top:12px;">
          <mwc-button outlined @click="${() => this._resetDefaults()}">Przywróć domyślne</mwc-button>
        </div>
      </div>
    `;

    // 🔧 ha-form musi być dostępny zanim podpinamy event
    setTimeout(() => {
      const haForm = this.shadowRoot.querySelector("ha-form");
      if (haForm && this._config) {
        haForm.addEventListener("value-changed", (ev) => this._valueChanged(ev));
      }
    }, 100);
  }

  _renderAdvanced() {
    return `
      <div class="section">
        <h3>Kolory wyników</h3>
        <ha-form
          .hass="${this.hass}"
          .schema="${[
            { name: 'colors.win', label: 'Wygrana', selector: { color_rgb: {} } },
            { name: 'colors.draw', label: 'Remis', selector: { color_rgb: {} } },
            { name: 'colors.loss', label: 'Porażka', selector: { color_rgb: {} } },
          ]}"
          .data="${this._config}"
        ></ha-form>
      </div>
    `;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    const target = ev.detail.value || {};
    this._config = { ...this._config, ...target };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _toggleAdvanced() {
    this._showAdvanced = !this._showAdvanced;
    this._render();
  }

  _resetDefaults() {
    this._config = {
      fill: "gradient",
      gradient: { alpha: 0.5, start: 30, end: 100 },
      show_logos: true,
      show_result_symbol: true,
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
    };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this.shadowRoot) this._render();
  }

  get hass() {
    return this._hass;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
console.info("%c [MatchesCardEditor] v0.3.008b loaded", "color: #7ac943; font-weight: bold;");
