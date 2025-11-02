// ============================================================================
//  Matches Card Editor – v0.3.007
//  ✅ Fix: Błąd ha-form.ts:118 (undefined.map)
//  ✅ Fix: gradient.* / colors.* flatten schema
//  ✅ Preview: pokazuje przykładowy mecz z gradientem
// ============================================================================

console.info("%c [MatchesCardEditor] v0.3.007 loaded", "color: #03a9f4; font-weight: bold;");

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
    this._config = JSON.parse(JSON.stringify(config || {}));
    this._updatePreview();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // =========================================================================
  // SCHEMAT – podstawowe + zaawansowane pola
  // =========================================================================
  _schemaBasic() {
    return [
      { name: "entity", selector: { entity: { domain: "sensor" } } },
      { name: "fill", selector: { select: { options: ["gradient", "zebra", "none"] } } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_logos", selector: { boolean: {} } },
      { name: "show_result_symbol", selector: { boolean: {} } },
    ];
  }

  _schemaAdvanced() {
    return [
      // Gradient
      { name: "gradient.start", selector: { number: { min: 0, max: 100, step: 1 } } },
      { name: "gradient.end", selector: { number: { min: 0, max: 100, step: 1 } } },
      { name: "gradient.alpha", selector: { number: { min: 0, max: 1, step: 0.05 } } },

      // Kolory
      { name: "colors.win", selector: { color: {} } },
      { name: "colors.draw", selector: { color: {} } },
      { name: "colors.loss", selector: { color: {} } },

      // Czcionki
      { name: "font_size.date", selector: { number: { min: 0.5, max: 2, step: 0.1 } } },
      { name: "font_size.status", selector: { number: { min: 0.5, max: 2, step: 0.1 } } },
      { name: "font_size.teams", selector: { number: { min: 0.5, max: 2, step: 0.1 } } },
      { name: "font_size.score", selector: { number: { min: 0.5, max: 2, step: 0.1 } } },

      // Ikony
      { name: "icon_size.league", selector: { number: { min: 10, max: 40, step: 1 } } },
      { name: "icon_size.crest", selector: { number: { min: 10, max: 40, step: 1 } } },
      { name: "icon_size.result", selector: { number: { min: 10, max: 40, step: 1 } } },
    ];
  }

  // =========================================================================
  // Render
  // =========================================================================
  _render() {
    if (!this._hass) return;

    const schema = [...this._schemaBasic(), ...(this._showAdvanced ? this._schemaAdvanced() : [])];

    const html = `
      <ha-card header="Ustawienia Matches Card">
        <div class="form">
          <ha-form
            .hass="${this._hass}"
            .data="${this._flattenDots(this._config)}"
            .schema="${schema}"
            @value-changed="${(ev) => this._valueChanged(ev)}"
          ></ha-form>
        </div>

        <mwc-button @click="${() => this._toggleAdvanced()}">
          ${this._showAdvanced ? "Ukryj" : "Pokaż"} zaawansowane
        </mwc-button>

        <div id="preview"></div>
      </ha-card>
    `;

    this.shadowRoot.innerHTML = html;
    this._updatePreview();
  }

  // =========================================================================
  // Podgląd mini
  // =========================================================================
  _updatePreview() {
    const container = this.shadowRoot?.querySelector("#preview");
    if (!container) return;

    container.innerHTML = `
      <ha-card header="Podgląd (demo)">
        <table style="width:100%;border-collapse:collapse;font-family:sans-serif;">
          <tr style="background:linear-gradient(to right,rgba(0,0,0,0) ${this._config.gradient?.start ?? 20}%,
             rgba(59,165,93,${this._config.gradient?.alpha ?? 0.5}) ${this._config.gradient?.end ?? 100}%);">
            <td style="padding:6px;">Górnik Zabrze</td>
            <td>2 - 1</td>
            <td>Ruch Chorzów</td>
          </tr>
        </table>
      </ha-card>
    `;
  }

  // =========================================================================
  // Eventy i pomocnicze
  // =========================================================================
  _valueChanged(ev) {
    ev.stopPropagation();
    const value = ev.detail.value;
    this._config = this._expandDots(value);
    this._updatePreview();
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _toggleAdvanced() {
    this._showAdvanced = !this._showAdvanced;
    this._render();
  }

  // =========================================================================
  // Helpery: flatten/expand
  // =========================================================================
  _flattenDots(obj, prefix = "") {
    const res = {};
    for (const [k, v] of Object.entries(obj || {})) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(res, this._flattenDots(v, key));
      else res[key] = v;
    }
    return res;
  }

  _expandDots(obj) {
    const res = {};
    for (const [key, value] of Object.entries(obj || {})) {
      const parts = key.split(".");
      parts.reduce((acc, part, idx) => {
        if (idx === parts.length - 1) acc[part] = value;
        else acc[part] = acc[part] || {};
        return acc[part];
      }, res);
    }
    return res;
  }

  get value() {
    return this._config;
  }

  focus() {}
}

customElements.define("matches-card-editor", MatchesCardEditor);
