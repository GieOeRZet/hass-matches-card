// ============================================================================
//  Matches Card Editor – v0.3.100 Stable Rebuild
//  Autor: GieOeRZet
//  Repo:  https://github.com/GieOeRZet/matches-card
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._flat = {};
  }

  _defaults() {
    return {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient",
      theme_mode: "auto",
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
    };
  }

  setConfig(config) {
    this._config = this._mergeDeep(this._defaults(), config || {});
    this._flat = this._flatten(this._config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._forms) this._forms.forEach((f) => (f.hass = hass));
  }

  _render() {
    if (!this._root) {
      this._root = document.createElement("div");
      this._root.style.maxWidth = "520px";
      this._root.style.margin = "0 auto";
      this._root.style.padding = "10px";
      this.appendChild(this._root);
    }

    this._root.innerHTML = "";
    this._forms = [];

    const css = document.createElement("style");
    css.textContent = `
      .section {
        margin-bottom: 16px;
        border-radius: 10px;
        padding: 10px 14px;
        background: var(--card-background-color);
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      }
      .section h4 {
        margin: 0 0 8px 0;
        font-size: 1em;
        font-weight: 600;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        padding-bottom: 4px;
      }
      ha-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
      }
      ha-form ha-control-number {
        min-width: 100px;
      }
    `;
    this._root.appendChild(css);

    // === Podstawowe ===
    const sBasic = this._createSection("Podstawowe");
    const schemaBasic = [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_logos", selector: { boolean: {} } },
      { name: "full_team_names", selector: { boolean: {} } },
      { name: "show_result_symbols", selector: { boolean: {} } },
    ];
    sBasic.appendChild(this._makeForm(schemaBasic));

    // === Wygląd ===
    const sLook = this._createSection("Wygląd");
    const schemaLook = [
      { name: "fill_mode", selector: { select: { options: ["gradient", "zebra", "none"] } } },
      { name: "theme_mode", selector: { select: { options: ["auto", "light", "dark"] } } },
    ];
    sLook.appendChild(this._makeForm(schemaLook));

    // === Kolory wyników ===
    const sColors = this._createSection("Kolory wyników");
    const schemaColors = [
      { name: "colors.win", label: "Wygrana", selector: { color: {} } },
      { name: "colors.draw", label: "Remis", selector: { color: {} } },
      { name: "colors.loss", label: "Porażka", selector: { color: {} } },
    ];
    sColors.appendChild(this._makeForm(schemaColors));

    // === Czcionki ===
    const sFonts = this._createSection("Czcionki (em)");
    const schemaFonts = [
      { name: "font_size.date", label: "Data", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.status", label: "Status", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.teams", label: "Zespoły", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.score", label: "Wynik", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
    ];
    sFonts.appendChild(this._makeForm(schemaFonts));

    // === Ikony ===
    const sIcons = this._createSection("Ikony (px)");
    const schemaIcons = [
      { name: "icon_size.league", label: "Liga", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
      { name: "icon_size.crest", label: "Herb", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
      { name: "icon_size.result", label: "Symbol", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
    ];
    sIcons.appendChild(this._makeForm(schemaIcons));

    // === Układ kolumn ===
    const sCols = this._createSection("Układ kolumn (%)");
    const schemaCols = [
      { name: "columns_pct.date", label: "Data", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.league", label: "Liga", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.crest", label: "Herby", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.score", label: "Wynik", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.result", label: "Symbol", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
    ];
    sCols.appendChild(this._makeForm(schemaCols));
  }

  _createSection(title) {
    const sec = document.createElement("div");
    sec.classList.add("section");
    const h = document.createElement("h4");
    h.textContent = title;
    sec.appendChild(h);
    this._root.appendChild(sec);
    return sec;
  }

  _makeForm(schema) {
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._flat;
    form.schema = schema;
    form.addEventListener("value-changed", (ev) => {
      const partialFlat = ev.detail.value || {};
      Object.assign(this._flat, partialFlat);
      const nested = this._unflatten(this._flat);
      this._config = this._mergeDeep(this._config, nested);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    });
    this._forms.push(form);
    return form;
  }

  _flatten(obj, prefix = "", res = {}) {
    Object.entries(obj || {}).forEach(([k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) this._flatten(v, key, res);
      else res[key] = v;
    });
    return res;
  }

  _unflatten(flat) {
    const result = {};
    Object.entries(flat || {}).forEach(([path, value]) => {
      const parts = path.split(".");
      let cur = result;
      while (parts.length > 1) {
        const p = parts.shift();
        if (!(p in cur) || typeof cur[p] !== "object") cur[p] = {};
        cur = cur[p];
      }
      cur[parts[0]] = value;
    });
    return result;
  }

  _mergeDeep(target, source) {
    const out = Array.isArray(target) ? [...target] : { ...(target || {}) };
    Object.entries(source || {}).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value))
        out[key] = this._mergeDeep(out[key] || {}, value);
      else out[key] = value;
    });
    return out;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);