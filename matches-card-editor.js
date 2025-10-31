// Matches Card Editor v0.1.006 — pełny edytor, bindowanie do YAML (GUI -> YAML)

const _LitBaseE = window.LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const htmlE = _LitBaseE.prototype.html;
const cssE  = _LitBaseE.prototype.css;

class MatchesCardEditor extends _LitBaseE {
  static get properties() {
    return {
      hass: {},
      _config: {}
    };
  }

  setConfig(config) {
    this._config = {
      name: "90minut Matches",
      show_logos: true,
      full_team_names: true,
      font_size: { date: 0.9, teams: 1.0, score: 1.0, status: 0.8, result_letter: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      columns_pct: { date: 12, league: 10, crest: 12, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config
    };
  }

  // ---- helpers (aktualizacja płaska i zagnieżdżona) ----
  _updateKey(key, value) {
    const cfg = { ...this._config, [key]: value };
    this._config = cfg;
    this._fireChange(cfg);
  }
  _updateNested(path, value) {
    // path np. ["font_size","date"]
    const cfg = JSON.parse(JSON.stringify(this._config || {}));
    let ref = cfg;
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      ref[p] = ref[p] || {};
      ref = ref[p];
    }
    ref[path[path.length - 1]] = value;
    this._config = cfg;
    this._fireChange(cfg);
  }
  _fireChange(cfg) {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg } }));
  }

  // ---- render ----
  render() {
    const c = this._config || {};
    const fs = c.font_size || {};
    const is = c.icon_size || {};
    const cp = c.columns_pct || {};
    const col = c.colors || {};

    return htmlE`
      <div class="wrap">
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            label="Sensor (tylko 90minut_*)"
            .value=${c.entity || ""}
            allow-custom-entity
            @value-changed=${(e) => this._updateKey("entity", e.detail?.value)}
          ></ha-entity-picker>

          <ha-textfield
            label="Nazwa karty"
            .value=${c.name || ""}
            @input=${(e) => this._updateKey("name", e.target.value)}
          ></ha-textfield>
        </div>

        <div class="row switches">
          <ha-switch
            .checked=${c.show_logos ?? true}
            @change=${(e) => this._updateKey("show_logos", e.target.checked)}
          ></ha-switch>
          <span>Pokaż herby</span>

          <ha-switch
            .checked=${c.full_team_names ?? true}
            @change=${(e) => this._updateKey("full_team_names", e.target.checked)}
            style="margin-left:16px"
          ></ha-switch>
          <span>Pełne nazwy drużyn</span>
        </div>

        <h4>Rozmiary czcionek (em)</h4>
        <div class="row grid4">
          ${this._num("Data", fs.date, (v)=>this._updateNested(["font_size","date"], v))}
          ${this._num("Drużyny", fs.teams, (v)=>this._updateNested(["font_size","teams"], v))}
          ${this._num("Wynik", fs.score, (v)=>this._updateNested(["font_size","score"], v))}
          ${this._num("Status", fs.status, (v)=>this._updateNested(["font_size","status"], v))}
          ${this._num("Litera W/P/R", fs.result_letter, (v)=>this._updateNested(["font_size","result_letter"], v))}
        </div>

        <h4>Rozmiary ikon (px)</h4>
        <div class="row grid3">
          ${this._int("Liga", is.league, (v)=>this._updateNested(["icon_size","league"], v))}
          ${this._int("Herb", is.crest, (v)=>this._updateNested(["icon_size","crest"], v))}
          ${this._int("W/P/R", is.result, (v)=>this._updateNested(["icon_size","result"], v))}
        </div>

        <h4>Szerokości kolumn (%)</h4>
        <div class="hint">Ustaw: Data, Liga, Herb, Wynik, W/P/R. Kolumna „Drużyny” = 100% - suma pozostałych.</div>
        <div class="row grid5">
          ${this._int("Data", cp.date, (v)=>this._updateNested(["columns_pct","date"], v))}
          ${this._int("Liga", cp.league, (v)=>this._updateNested(["columns_pct","league"], v))}
          ${this._int("Herb", cp.crest, (v)=>this._updateNested(["columns_pct","crest"], v))}
          ${this._int("Wynik", cp.score, (v)=>this._updateNested(["columns_pct","score"], v))}
          ${this._int("W/P/R", cp.result, (v)=>this._updateNested(["columns_pct","result"], v))}
        </div>

        <h4>Kolory wyników</h4>
        <div class="row grid3">
          ${this._color("Wygrana", col.win || "#3ba55d", (v)=>this._updateNested(["colors","win"], v))}
          ${this._color("Przegrana", col.loss || "#e23b3b", (v)=>this._updateNested(["colors","loss"], v))}
          ${this._color("Remis", col.draw || "#468cd2", (v)=>this._updateNested(["colors","draw"], v))}
        </div>
      </div>
    `;
  }

  // ---- elementy formularza ----
  _num(label, val, handler) {
    return htmlE`
      <ha-textfield
        type="number"
        step="0.1"
        min="0.1"
        label=${label}
        .value=${val ?? ""}
        @input=${(e)=>handler(parseFloat(e.target.value))}
      ></ha-textfield>
    `;
  }
  _int(label, val, handler) {
    return htmlE`
      <ha-textfield
        type="number"
        step="1"
        min="0"
        label=${label}
        .value=${val ?? ""}
        @input=${(e)=>handler(parseInt(e.target.value,10))}
      ></ha-textfield>
    `;
  }
  _color(label, val, handler) {
    return htmlE`
      <div class="color-field">
        <div class="lbl">${label}</div>
        <ha-color-picker
          .value=${val}
          alpha
          @value-changed=${(e)=>handler(e.detail.value)}
        ></ha-color-picker>
      </div>
    `;
  }

  static get styles() {
    return cssE`
      .wrap { padding: 8px 12px 16px; }
      .row { display: grid; grid-gap: 12px; align-items: center; margin: 8px 0; }
      .grid3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
      .grid4 { grid-template-columns: repeat(4, minmax(0,1fr)); }
      .grid5 { grid-template-columns: repeat(5, minmax(0,1fr)); }
      .switches { grid-template-columns: auto auto auto auto; }
      h4 { margin: 12px 0 6px; font-weight: 600; }
      .hint { opacity: 0.7; font-size: 0.9em; margin-bottom: 6px; }
      .color-field { display:flex; align-items:center; gap:12px; }
      .color-field .lbl { width: 120px; }
    `;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);

// Informacja dla HA (lista kart niestandardowych)
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  preview: true,
  description: "Custom match list card with gradient rows, zebra and full GUI editor."
});