// ============================================================================
//  Matches Card Editor – v0.3.008
//  - Pełny formularz konfiguracyjny (ha-form)
//  - Naprawione ładowanie ha-form
//  - Rozwijana sekcja zaawansowana
//  - Podgląd demo z gradientem
// ============================================================================

import "@material/mwc-button";
import "@material/mwc-switch";
import "@polymer/paper-input/paper-input.js";

// 🔧 Dynamiczne ładowanie ha-form, jeśli nie jest dostępne
if (!customElements.get("ha-form")) {
  import("../../../homeassistant-frontend/build/ha-form.js").catch((e) => {
    console.warn("[MatchesCardEditor] ha-form not found yet, waiting...");
    setTimeout(() => import("../../../homeassistant-frontend/build/ha-form.js"), 2000);
  });
}

class MatchesCardEditor extends HTMLElement {
  static get properties() {
    return { hass: {}, _config: {}, _showAdvanced: {} };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._showAdvanced = false;
  }

  setConfig(config) {
    this._config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      fill: "gradient",
      show_result_symbol: true,
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  _schema() {
    const schema = [
      {
        name: "entity",
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "name",
        label: "Tytuł karty",
        selector: { text: {} },
      },
      {
        name: "show_name",
        label: "Pokaż tytuł",
        selector: { boolean: {} },
      },
      {
        name: "show_logos",
        label: "Pokaż logotypy drużyn",
        selector: { boolean: {} },
      },
      {
        name: "fill",
        label: "Styl wypełnienia wierszy",
        selector: {
          select: {
            options: [
              { label: "Gradient", value: "gradient" },
              { label: "Zebra", value: "zebra" },
              { label: "Brak", value: "none" },
            ],
          },
        },
      },
      {
        name: "show_result_symbol",
        label: "Ikony wyników (W/D/L)",
        selector: { boolean: {} },
      },
    ];

    if (this._showAdvanced) {
      schema.push(
        { name: "gradient.alpha", label: "Przezroczystość gradientu (0–1)", selector: { number: { min: 0, max: 1, step: 0.1 } } },
        { name: "gradient.start", label: "Start gradientu (%)", selector: { number: { min: 0, max: 100 } } },
        { name: "gradient.end", label: "Koniec gradientu (%)", selector: { number: { min: 0, max: 100 } } },
        { name: "colors.win", label: "Kolor zwycięstwa", selector: { color: {} } },
        { name: "colors.loss", label: "Kolor porażki", selector: { color: {} } },
        { name: "colors.draw", label: "Kolor remisu", selector: { color: {} } },
        { name: "icon_size.league", label: "Rozmiar ikony ligi", selector: { number: { min: 10, max: 60 } } },
        { name: "icon_size.crest", label: "Rozmiar herbu", selector: { number: { min: 10, max: 60 } } },
        { name: "icon_size.result", label: "Rozmiar symbolu wyniku", selector: { number: { min: 10, max: 60 } } }
      );
    }

    return schema;
  }

  render() {
    if (!this._hass) return;

    const style = `
      <style>
        ha-card {
          display: block;
          padding: 12px;
        }
        .buttons {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .demo {
          border-radius: 8px;
          padding: 8px;
          margin-top: 12px;
          background: linear-gradient(to right, rgba(0,0,0,0) 35%, rgba(59,165,93,0.5) 100%);
        }
        .demo span {
          font-weight: bold;
          font-size: 1em;
          color: white;
        }
      </style>
    `;

    const demo = `
      <div class="demo">
        <span>Górnik Zabrze</span> &nbsp; <span>2 - 1</span> &nbsp; <span>Ruch Chorzów</span>
      </div>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <ha-card header="Ustawienia Matches Card">
        <div class="buttons">
          <mwc-button @click="${() => this._onToggleAdvanced()}">
            ${this._showAdvanced ? "Ukryj zaawansowane" : "Pokaż zaawansowane"}
          </mwc-button>
          <mwc-button @click="${() => this._onResetDefaults()}">Przywróć domyślne</mwc-button>
        </div>
        <ha-form
          .hass=${this._hass}
          .data=${this._config}
          .schema=${this._schema()}
          @value-changed=${(ev) => this._valueChanged(ev)}
        ></ha-form>
        <h3>Podgląd (demo)</h3>
        ${demo}
      </ha-card>
    `;
  }

  _onToggleAdvanced() {
    this._showAdvanced = !this._showAdvanced;
    this.render();
  }

  _onResetDefaults() {
    this.setConfig({});
    this.render();
    this.dispatchEvent(new Event("config-changed", { bubbles: true, composed: true }));
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    const newConfig = ev.detail.value;
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
console.info("[MatchesCardEditor] v0.3.008 loaded ✅");
