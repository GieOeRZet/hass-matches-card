// ============================================================================
//  Matches Card Editor – v0.3.001 (pełny)
//  Pasuje do: Matches Card (90minut) v0.3.001
//  Funkcje:
//   - Pełny zestaw pól YAML (entity, name, show_*, fill_mode, theme_mode,
//     gradient.{alpha,start,end}, colors.{win,draw,loss},
//     font_size.{date,status,teams,score}, icon_size.{league,crest,result},
//     columns_pct.{date,league,crest,score,result})
//   - Zwijane sekcje (<details>) z subtelnym cieniowaniem
//   - Automatyczne wypełnianie wartości domyślnych (spójne z getStubConfig())
//   - Brak importów, gotowe pod HA Lovelace GUI
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    // Utrzymaj referencję na konfigurację i wstrzyknij domyślne wartości,
    // aby edytor ZAWSZE miał komplet pól (w GUI i YAML).
    this._config = config ? JSON.parse(JSON.stringify(config)) : {};
    this._applyDefaults();
    this.render();
  }

  connectedCallback() {
    if (this.isConnected && !this.innerHTML) {
      this._applyDefaults();
      this.render();
    }
  }

  // ---- DOMYŚLNE WARTOŚCI – zgodne z getStubConfig() karty v0.3.001 ----
  _applyDefaults() {
    const d = {
      entity: "",
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient", // gradient | zebra | none
      theme_mode: "auto",    // auto | light | dark
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" }
    };

    const c = (this._config ||= {});
    // Proste scalanie obiektów z domyślnymi
    for (const k of Object.keys(d)) {
      if (c[k] === undefined) {
        c[k] = JSON.parse(JSON.stringify(d[k]));
      } else if (typeof d[k] === "object" && d[k] !== null) {
        for (const sk of Object.keys(d[k])) {
          if (c[k][sk] === undefined) c[k][sk] = d[k][sk];
        }
      }
    }
  }

  // ---- RENDER ----
  render() {
    const c = this._config;

    this.innerHTML = `
      <style>
        .editor { padding: 10px; display: grid; gap: 10px; }

        details.section {
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.15);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          background: var(--card-background-color, #fff);
          overflow: hidden;
        }
        summary {
          cursor: pointer;
          font-weight: 600;
          padding: 10px 12px;
          background: var(--secondary-background-color, #f4f4f4);
          user-select: none;
          list-style: none;
        }
        summary::-webkit-details-marker { display: none; }
        summary:after {
          content: "▸";
          float: right;
          opacity: 0.6;
          transition: transform 0.2s ease;
        }
        details[open] summary:after { transform: rotate(90deg); }

        .section-content {
          padding: 10px 12px 12px;
          background: var(--card-background-color, #fff);
        }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

        label { font-weight: 500; display: block; margin: 4px 0; }
        input[type="text"], input[type="number"], select {
          width: 100%;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid var(--divider-color, #ccc);
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
        }
        input[type="color"] {
          width: 100%;
          height: 34px;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 6px;
          padding: 0;
        }
        .checkbox {
          display: flex; align-items: center; gap: 8px; margin: 2px 0;
        }
        .help {
          font-size: 0.85em;
          opacity: 0.75;
          margin-top: 2px;
        }

        @media (max-width: 520px) {
          .grid2, .grid3 { grid-template-columns: 1fr; }
        }
      </style>

      <div class="editor">

        ${this._section("Podstawowe", `
          <label>Encja (entity)</label>
          <input id="entity" type="text" value="${this._esc(c.entity)}" placeholder="sensor.90minut_gornik_zabrze_matches">

          <label>Nazwa karty</label>
          <input id="name" type="text" value="${this._esc(c.name)}">

          <div class="grid2">
            ${this._checkbox("show_name", c.show_name, "Pokaż nagłówek")}
            ${this._checkbox("show_logos", c.show_logos, "Pokaż logotypy")}
            ${this._checkbox("full_team_names", c.full_team_names, "Pełne nazwy drużyn")}
            ${this._checkbox("show_result_symbols", c.show_result_symbols, "Symbole wyników (W/R/P)")}
          </div>

          <label>Tryb motywu (theme_mode)</label>
          <select id="theme_mode">
            ${this._opt("auto", c.theme_mode)}${this._opt("light", c.theme_mode)}${this._opt("dark", c.theme_mode)}
          </select>

          <label>Tryb wypełnienia (fill_mode)</label>
          <select id="fill_mode">
            ${this._opt("gradient", c.fill_mode)}${this._opt("zebra", c.fill_mode)}${this._opt("none", c.fill_mode)}
          </select>
          <div class="help">Gradient działa z kolorami wyniku; zebra używa kontrastowego tła sekcji parzystych.</div>
        `)}

        ${this._section("Gradient", `
          <div class="grid3">
            ${this._num("gradient.alpha", c.gradient.alpha, "Przezroczystość (0–1)", 0, 1, 0.05)}
            ${this._num("gradient.start", c.gradient.start, "Początek (%)", 0, 100, 1)}
            ${this._num("gradient.end", c.gradient.end, "Koniec (%)", 0, 100, 1)}
          </div>
        `)}

        ${this._section("Kolory wyników", `
          <div class="grid3">
            ${this._color("colors.win", c.colors.win, "Kolor – wygrana")}
            ${this._color("colors.draw", c.colors.draw, "Kolor – remis")}
            ${this._color("colors.loss", c.colors.loss, "Kolor – porażka")}
          </div>
        `)}

        ${this._section("Czcionki (em) i ikony (px)", `
          <div class="grid3">
            ${this._num("font_size.date", c.font_size.date, "Data (em)", 0.4, 3, 0.1)}
            ${this._num("font_size.status", c.font_size.status, "Status (em)", 0.4, 3, 0.1)}
            ${this._num("font_size.teams", c.font_size.teams, "Drużyny (em)", 0.4, 3, 0.1)}
            ${this._num("font_size.score", c.font_size.score, "Wynik (em)", 0.4, 3, 0.1)}
            ${this._num("icon_size.league", c.icon_size.league, "Ikona ligi (px)", 10, 96, 1)}
            ${this._num("icon_size.crest", c.icon_size.crest, "Herb klubu (px)", 10, 96, 1)}
            ${this._num("icon_size.result", c.icon_size.result, "Symbol wyniku (px)", 10, 96, 1)}
          </div>
        `)}

        ${this._section("Układ kolumn (%)", `
          <div class="grid3">
            ${this._num("columns_pct.date", c.columns_pct.date, "Data (%)", 0, 60, 1)}
            ${this._num("columns_pct.league", c.columns_pct.league, "Liga (%)", 0, 60, 1)}
            ${this._num("columns_pct.crest", c.columns_pct.crest, "Herby (%)", 0, 60, 1)}
            ${this._num("columns_pct.score", c.columns_pct.score, "Wynik (%)", 0, 60, 1)}
            ${this._num("columns_pct.result", c.columns_pct.result, "Symbol (%)", 0, 60, 1)}
          </div>
          <div class="help">Uwaga: suma szerokości nie musi równać się 100% – pozostałe pole (drużyny) dopasuje się elastycznie.</div>
        `)}

      </div>
    `;

    // Zwiń sekcje na start
    this.querySelectorAll("details.section").forEach(d => d.open = false);

    // Nasłuch zmian
    this.querySelectorAll("input,select").forEach((el) =>
      el.addEventListener("change", (ev) => this._onInput(ev))
    );
  }

  // ---- POMOCNICZE GENERATORY POL ----
  _checkbox(id, checked, label) {
    return `
      <div class="checkbox">
        <input id="${id}" type="checkbox" ${checked ? "checked" : ""}>
        <span>${label}</span>
      </div>
    `;
  }

  _num(id, value, label, min = null, max = null, step = null) {
    const attrs = [
      min !== null ? `min="${min}"` : "",
      max !== null ? `max="${max}"` : "",
      step !== null ? `step="${step}"` : ""
    ].join(" ");
    return `
      <div>
        <label>${label}</label>
        <input id="${id}" type="number" value="${this._esc(value)}" ${attrs}>
      </div>
    `;
  }

  _color(id, value, label) {
    return `
      <div>
        <label>${label}</label>
        <input id="${id}" type="color" value="${this._esc(value)}">
      </div>
    `;
  }

  _opt(val, current) {
    return `<option value="${val}" ${current === val ? "selected" : ""}>${val}</option>`;
  }

  _section(title, innerHtml) {
    return `
      <details class="section">
        <summary>${title}</summary>
        <div class="section-content">${innerHtml}</div>
      </details>
    `;
  }

  _esc(v) {
    if (v === undefined || v === null) return "";
    return String(v).replace(/"/g, "&quot;");
  }

  // ---- ZMIANA WARTOŚCI → WYŚLIJ 'config-changed' ----
  _onInput(ev) {
    const el = ev.target;
    const key = el.id;
    let val;

    if (el.type === "checkbox") {
      val = el.checked;
    } else if (el.type === "number") {
      const num = parseFloat(el.value);
      val = Number.isNaN(num) ? el.value : num;
    } else {
      val = el.value;
    }

    // Wsparcie ścieżek z kropką, np. "gradient.alpha"
    const cfg = JSON.parse(JSON.stringify(this._config || {}));
    const path = key.split(".");
    if (path.length === 2) {
      cfg[path[0]] = cfg[path[0]] || {};
      cfg[path[0]][path[1]] = val;
    } else {
      cfg[key] = val;
    }

    this._config = cfg;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg } }));
  }
}

if (!customElements.get("matches-card-editor")) {
  customElements.define("matches-card-editor", MatchesCardEditor);
}
