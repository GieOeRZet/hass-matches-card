// ============================================================================
//  Matches Card Editor – v0.3.001
//  Nowoczesny, rozwijany edytor GUI do matches-card
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient", // gradient | zebra | none
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config,
    };
    this._render();
  }

  set hass(hass) { this._hass = hass; }

  _update(path, value) {
    // prosty setter ścieżkowy, np. "font_size.date"
    const cfg = JSON.parse(JSON.stringify(this._config));
    const parts = path.split(".");
    let obj = cfg;
    while (parts.length > 1) {
      const k = parts.shift();
      if (!(k in obj)) obj[k] = {};
      obj = obj[k];
    }
    obj[parts[0]] = value;
    this._config = cfg;
    this._fireChange();
    this._render();
  }

  _fireChange() {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _entityOptions() {
    if (!this._hass) return "";
    const entities = Object.keys(this._hass.states || {}).filter(id => id.startsWith("sensor."));
    return entities.map(e => `<option value="${e}" ${this._config.entity === e ? "selected" : ""}>${e}</option>`).join("");
  }

  _style() {
    return `
      <style>
        .wrap { padding: 12px 14px; font: 14px/1.4 Inter, system-ui, Arial; }
        .row { display:flex; gap:12px; margin-bottom:10px; align-items:center; }
        .col { flex:1; min-width: 160px; }
        details { border:1px solid rgba(0,0,0,0.12); border-radius:10px; margin:8px 0; overflow:hidden; }
        summary { cursor:pointer; padding:10px 12px; background: var(--card-background-color); font-weight:600; }
        details > div { padding: 12px; background: var(--ha-card-background, var(--card-background-color)); }
        input[type="number"] { width: 100%; box-sizing: border-box; padding:6px 8px; }
        input[type="text"] { width: 100%; box-sizing: border-box; padding:6px 8px; }
        select { width: 100%; box-sizing: border-box; padding:6px 8px; }
        label { display:block; font-size:12px; opacity:0.8; margin-bottom:4px; }
        .grid { display:grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap:12px; }
        .hint { font-size:12px; opacity:0.7; }
        .switch { display:flex; align-items:center; gap:8px; }
      </style>
    `;
  }

  _render() {
    if (!this.isConnected) return;
    this.innerHTML = `
      ${this._style()}
      <div class="wrap">
        <details open>
          <summary>Podstawowe</summary>
          <div class="grid">
            <div>
              <label>Sensor (entity)</label>
              <select onchange="this.closest('matches-card-editor')._update('entity', this.value)">
                <option value="" ${!this._config.entity ? "selected" : ""} disabled>Wybierz sensor…</option>
                ${this._entityOptions()}
              </select>
            </div>
            <div>
              <label>Nazwa karty</label>
              <input type="text" value="${this._config.name ?? ""}" placeholder="90minut Matches"
                oninput="this.closest('matches-card-editor')._update('name', this.value)">
            </div>
            <div class="switch">
              <input id="show_name" type="checkbox" ${this._config.show_name ? "checked" : ""}
                onchange="this.closest('matches-card-editor')._update('show_name', this.checked)">
              <label for="show_name">Pokaż nagłówek</label>
            </div>
          </div>
        </details>

        <details open>
          <summary>Wygląd</summary>
          <div class="grid">
            <div>
              <label>Wypełnienie wierszy</label>
              <select onchange="this.closest('matches-card-editor')._update('fill_mode', this.value)">
                <option value="gradient" ${this._config.fill_mode === "gradient" ? "selected" : ""}>Gradient</option>
                <option value="zebra" ${this._config.fill_mode === "zebra" ? "selected" : ""}>Zebra</option>
                <option value="none" ${this._config.fill_mode === "none" ? "selected" : ""}>Brak (systemowe)</option>
              </select>
              <div class="hint">Gradient/Zebra są wzajemnie wykluczające się.</div>
            </div>
            <div class="switch">
              <input id="show_logos" type="checkbox" ${this._config.show_logos ? "checked" : ""}
                onchange="this.closest('matches-card-editor')._update('show_logos', this.checked)">
              <label for="show_logos">Pokaż herby drużyn</label>
            </div>
            <div class="switch">
              <input id="full_team_names" type="checkbox" ${this._config.full_team_names ? "checked" : ""}
                onchange="this.closest('matches-card-editor')._update('full_team_names', this.checked)">
              <label for="full_team_names">Pełne nazwy drużyn</label>
            </div>
            <div class="switch">
              <input id="show_result_symbols" type="checkbox" ${this._config.show_result_symbols ? "checked" : ""}
                onchange="this.closest('matches-card-editor')._update('show_result_symbols', this.checked)">
              <label for="show_result_symbols">Pokaż symbole W/P/R</label>
            </div>
          </div>
        </details>

        <details ${this._config.fill_mode === "gradient" ? "open" : ""}>
          <summary>Gradient</summary>
          <div class="grid">
            <div>
              <label>Alpha (0–1)</label>
              <input type="number" step="0.05" min="0" max="1" value="${this._config.gradient.alpha}"
                oninput="this.closest('matches-card-editor')._update('gradient.alpha', Number(this.value))">
            </div>
            <div>
              <label>Start (%)</label>
              <input type="number" step="1" min="0" max="100" value="${this._config.gradient.start}"
                oninput="this.closest('matches-card-editor')._update('gradient.start', Number(this.value))">
            </div>
            <div>
              <label>End (%)</label>
              <input type="number" step="1" min="0" max="100" value="${this._config.gradient.end}"
                oninput="this.closest('matches-card-editor')._update('gradient.end', Number(this.value))">
            </div>
          </div>
        </details>

        <details>
          <summary>Kolory wyników</summary>
          <div class="grid">
            <div>
              <label>Wygrana (win)</label>
              <input type="text" value="${this._config.colors.win}"
                oninput="this.closest('matches-card-editor')._update('colors.win', this.value)">
            </div>
            <div>
              <label>Porażka (loss)</label>
              <input type="text" value="${this._config.colors.loss}"
                oninput="this.closest('matches-card-editor')._update('colors.loss', this.value)">
            </div>
            <div>
              <label>Remis (draw)</label>
              <input type="text" value="${this._config.colors.draw}"
                oninput="this.closest('matches-card-editor')._update('colors.draw', this.value)">
            </div>
          </div>
        </details>

        <details>
          <summary>Czcionki</summary>
          <div class="grid">
            <div>
              <label>Data (em)</label>
              <input type="number" step="0.1" min="0.5" max="2.5" value="${this._config.font_size.date}"
                oninput="this.closest('matches-card-editor')._update('font_size.date', Number(this.value))">
            </div>
            <div>
              <label>Status (em)</label>
              <input type="number" step="0.1" min="0.5" max="2.5" value="${this._config.font_size.status}"
                oninput="this.closest('matches-card-editor')._update('font_size.status', Number(this.value))">
            </div>
            <div>
              <label>Drużyny (em)</label>
              <input type="number" step="0.1" min="0.5" max="2.5" value="${this._config.font_size.teams}"
                oninput="this.closest('matches-card-editor')._update('font_size.teams', Number(this.value))">
            </div>
            <div>
              <label>Wynik (em)</label>
              <input type="number" step="0.1" min="0.5" max="2.5" value="${this._config.font_size.score}"
                oninput="this.closest('matches-card-editor')._update('font_size.score', Number(this.value))">
            </div>
          </div>
        </details>

        <details>
          <summary>Rozmiary ikon</summary>
          <div class="grid">
            <div>
              <label>Liga (px)</label>
              <input type="number" step="1" min="8" max="64" value="${this._config.icon_size.league}"
                oninput="this.closest('matches-card-editor')._update('icon_size.league', Number(this.value))">
            </div>
            <div>
              <label>Herb (px)</label>
              <input type="number" step="1" min="8" max="64" value="${this._config.icon_size.crest}"
                oninput="this.closest('matches-card-editor')._update('icon_size.crest', Number(this.value))">
            </div>
            <div>
              <label>Symbol W/P/R (px)</label>
              <input type="number" step="1" min="8" max="64" value="${this._config.icon_size.result}"
                oninput="this.closest('matches-card-editor')._update('icon_size.result', Number(this.value))">
            </div>
          </div>
        </details>

        <details>
          <summary>Szerokości kolumn (%)</summary>
          <div class="grid">
            <div>
              <label>Data</label>
              <input type="number" step="1" min="0" max="40" value="${this._config.columns_pct.date}"
                oninput="this.closest('matches-card-editor')._update('columns_pct.date', Number(this.value))">
            </div>
            <div>
              <label>Liga</label>
              <input type="number" step="1" min="0" max="40" value="${this._config.columns_pct.league}"
                oninput="this.closest('matches-card-editor')._update('columns_pct.league', Number(this.value))">
            </div>
            <div>
              <label>Herby</label>
              <input type="number" step="1" min="0" max="40" value="${this._config.columns_pct.crest}"
                oninput="this.closest('matches-card-editor')._update('columns_pct.crest', Number(this.value))">
            </div>
            <div>
              <label>Wynik</label>
              <input type="number" step="1" min="0" max="40" value="${this._config.columns_pct.score}"
                oninput="this.closest('matches-card-editor')._update('columns_pct.score', Number(this.value))">
            </div>
            <div>
              <label>Symbol W/P/R</label>
              <input type="number" step="1" min="0" max="40" value="${this._config.columns_pct.result}"
                oninput="this.closest('matches-card-editor')._update('columns_pct.result', Number(this.value))">
            </div>
          </div>
          <div class="hint" style="margin-top:8px;">
            Kolumna z nazwami drużyn przyjmuje automatycznie: 100% - suma pozostałych kolumn.
          </div>
        </details>
      </div>
    `;
  }

  get value() { return this._config; }
}

customElements.define("matches-card-editor", MatchesCardEditor);