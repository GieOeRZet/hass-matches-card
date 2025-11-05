// ============================================================================
//  Matches Card Editor – v0.3.001 SmartSectionsPro
//  - Sekcje tematyczne, dynamiczne pokazywanie gradientu
//  - Wszystkie liczby jako inputy (mode: "box")
//  - Reset do domyślnych wartości
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._flat = {};
  }

  // Domyślna konfiguracja (spójna z kartą)
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

  // ---------- RENDER ----------
  _render() {
    if (!this._root) {
      this._root = document.createElement("div");
      this._root.style.padding = "8px";
      this.appendChild(this._root);
    }
    this._root.innerHTML = "";

    const section = (title) => {
      const wrap = document.createElement("div");
      wrap.style.margin = "12px 0";
      wrap.style.border = "1px solid var(--divider-color, rgba(0,0,0,0.12))";
      wrap.style.borderRadius = "8px";
      const head = document.createElement("div");
      head.textContent = title;
      head.style.fontWeight = "600";
      head.style.padding = "10px 12px";
      head.style.background = "var(--card-background-color)";
      head.style.borderBottom = "1px solid var(--divider-color, rgba(0,0,0,0.12))";
      wrap.appendChild(head);
      const body = document.createElement("div");
      body.style.padding = "8px 12px";
      wrap.appendChild(body);
      this._root.appendChild(wrap);
      return body;
    };

    this._forms = [];

    // --- Sekcja: Podstawowe ---
    const sBasic = section("Podstawowe");
    const schemaBasic = [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} }, description: "Pokazuj nagłówek karty" },
      { name: "show_logos", selector: { boolean: {} }, description: "Pokazuj herby drużyn" },
      { name: "full_team_names", selector: { boolean: {} }, description: "Pełne nazwy drużyn" },
      { name: "show_result_symbols", selector: { boolean: {} }, description: "Symbol W/R/P" },
    ];
    sBasic.appendChild(this._makeForm(schemaBasic));

    // --- Sekcja: Wygląd i tryb ---
    const sLook = section("Wygląd");
    const schemaLook = [
      { name: "fill_mode", selector: { select: { options: ["gradient", "zebra", "none"] } } },
      { name: "theme_mode", selector: { select: { options: ["auto", "light", "dark"] } }, description: "Podgląd jasny/ciemny (lekki wpływ na kontrasty)" },
    ];
    sLook.appendChild(this._makeForm(schemaLook));

    // --- Sekcja: Gradient (pokazuj tylko gdy fill_mode=gradient) ---
    if (this._flat["fill_mode"] === "gradient") {
      const sGrad = section("Gradient");
      const schemaGrad = [
        { name: "gradient.alpha", label: "Przezroczystość (0–1)", selector: { number: { mode: "box", min: 0, max: 1, step: 0.1 } } },
        { name: "gradient.start", label: "Start (%)",              selector: { number: { mode: "box", min: 0, max: 100, step: 1 } } },
        { name: "gradient.end",   label: "Koniec (%)",             selector: { number: { mode: "box", min: 0, max: 100, step: 1 } } },
      ];
      sGrad.appendChild(this._makeForm(schemaGrad));
    }

    // --- Sekcja: Kolory wyników ---
    const sColors = section("Kolory wyników");
    const schemaColors = [
      { name: "colors.win",  label: "Wygrana", selector: { color: {} } },
      { name: "colors.draw", label: "Remis",   selector: { color: {} } },
      { name: "colors.loss", label: "Porażka", selector: { color: {} } },
    ];
    sColors.appendChild(this._makeForm(schemaColors));

    // --- Sekcja: Rozmiary czcionek ---
    const sFonts = section("Rozmiary czcionek (em)");
    const schemaFonts = [
      { name: "font_size.date",   label: "Data",   selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.status", label: "Status", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.teams",  label: "Zespoły",selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.score",  label: "Wynik",  selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
    ];
    sFonts.appendChild(this._makeForm(schemaFonts));

    // --- Sekcja: Rozmiary ikon ---
    const sIcons = section("Rozmiary ikon (px)");
    const schemaIcons = [
      { name: "icon_size.league", label: "Liga",   selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
      { name: "icon_size.crest",  label: "Herb",   selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
      { name: "icon_size.result", label: "Symbol", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
    ];
    sIcons.appendChild(this._makeForm(schemaIcons));

    // --- Sekcja: Układ kolumn ---
    const sCols = section("Układ kolumn (%)");
    const schemaCols = [
      { name: "columns_pct.date",   label: "Data",   selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.league", label: "Liga",   selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.crest",  label: "Herby",  selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.score",  label: "Wynik",  selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.result", label: "Symbol", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
    ];
    sCols.appendChild(this._makeForm(schemaCols));

    // --- Reset ---
    const resetWrap = document.createElement("div");
    resetWrap.style.textAlign = "right";
    resetWrap.style.marginTop = "8px";
    const btn = document.createElement("mwc-button");
    btn.label = "🔄 Przywróć domyślne";
    btn.addEventListener("click", () => {
      const def = this._defaults();
      // zachowaj entity z bieżącej konfiguracji
      if (this._config.entity) def.entity = this._config.entity;
      this._config = this._mergeDeep({}, def);
      this._flat = this._flatten(this._config);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
      this._render();
    });
    this._root.appendChild(resetWrap);
    resetWrap.appendChild(btn);
  }

  _makeForm(schema) {
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._flat;   // spłaszczone dane (klucze z kropkami)
    form.schema = schema;
    form.addEventListener("value-changed", (ev) => {
      // ha-form zwraca całą płaską mapę (dla tego formularza)
      const partialFlat = ev.detail.value || {};
      // uaktualnij _flat tylko o zmienione klucze
      Object.assign(this._flat, partialFlat);
      // odbuduj strukturę zagnieżdżoną
      const nested = this._unflatten(this._flat);
      // scal z istniejącą konfiguracją (aby nie gubić pól)
      this._config = this._mergeDeep(this._config, nested);
      // emituj do karty
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));

      // jeżeli zmieniono fill_mode, prze-renderuj sekcje (pokaz/ukryj gradient)
      if (Object.prototype.hasOwnProperty.call(partialFlat, "fill_mode")) {
        this._render();
      }
    });
    this._forms.push(form);
    return form;
  }

  get value() {
    return this._config;
  }

  // ---------- UTIL: flatten / unflatten / merge ----------
  _flatten(obj, prefix = "", res = {}) {
    Object.entries(obj || {}).forEach(([k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) {
        this._flatten(v, key, res);
      } else {
        res[key] = v;
      }
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
      if (value && typeof value === "object" && !Array.isArray(value)) {
        out[key] = this._mergeDeep(out[key] || {}, value);
      } else {
        out[key] = value;
      }
    });
    return out;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
