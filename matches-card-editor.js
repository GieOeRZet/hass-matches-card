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
          ${this._num("Status", fs.status, (v)=>this._update