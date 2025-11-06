class MatchesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._flat = {};
    this._forms = [];
    this._renderTimer = null;
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
      colors: { win: "#3ba55d", draw: "#468cd2", loss: "#e23b3b" }
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
      this._root.style.maxWidth = "580px";
      this._root.style.margin = "0 auto";
      this._root.style.padding = "8px";
      this.appendChild(this._root);
    }
    this._root.innerHTML = "";
    this._forms = [];

    const css = document.createElement("style");
    css.textContent = `
      h4{margin:12px 0 4px;padding-bottom:2px;border-bottom:1px solid var(--divider-color);
        color:var(--primary-text-color);font-weight:600;font-size:.95em}
      ha-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));
        gap:6px 8px;margin-bottom:8px}
      input[type="color"]{width:100%;height:32px;border-radius:6px;border:none;cursor:pointer;}
      input[type="number"]{width:100%;height:30px;padding:2px 4px;border-radius:6px;
        border:1px solid var(--divider-color);background:var(--card-background-color);
        color:var(--primary-text-color);}
      mwc-button{float:right;margin-top:12px}
    `;
    this._root.appendChild(css);

    const sec = (title, schema) => {
      this._root.appendChild(this._header(title));
      this._root.appendChild(this._makeForm(schema));
    };

    sec("🧩 Podstawowe", [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_logos", selector: { boolean: {} } },
      { name: "full_team_names", selector: { boolean: {} } },
      { name: "show_result_symbols", selector: { boolean: {} } },
    ]);

    sec("🎨 Wygląd", [
      { name: "fill_mode", selector: { select: { options: ["gradient", "zebra", "none"] } } },
      { name: "theme_mode", selector: { select: { options: ["auto", "light", "dark"] } } },
    ]);

    if (this._flat["fill_mode"] === "gradient") {
      sec("🌈 Gradient", [
        { name: "gradient.alpha", label: "Przezroczystość", selector: { number: { min: 0, max: 1, step: 0.05 } } },
        { name: "gradient.start", label: "Start (%)", selector: { number: { min: 0, max: 100, step: 1 } } },
        { name: "gradient.end", label: "Koniec (%)", selector: { number: { min: 0, max: 100, step: 1 } } },
      ]);
    }

    // natywne pickery kolorów
    this._root.appendChild(this._header("🟥 Kolory wyników"));
    ["win", "draw", "loss"].forEach((key) => {
      const label =
        key === "win" ? "Wygrana (W)" :
        key === "draw" ? "Remis (R)" :
        "Porażka (P)";
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.justifyContent = "space-between";
      wrap.style.marginBottom = "8px";
      const lbl = document.createElement("label");
      lbl.textContent = label;
      lbl.style.flex = "1";
      const input = document.createElement("input");
      input.type = "color";
      input.value = this._flat[`colors.${key}`] || "#000000";
      input.style.flex = "0 0 60px";
      input.addEventListener("input", (ev) => {
        this._flat[`colors.${key}`] = ev.target.value;
        const nested = this._unflatten(this._flat);
        this._config = this._mergeDeep(this._config, nested);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
      });
      wrap.append(lbl, input);
      this._root.appendChild(wrap);
    });

    sec("🔠 Czcionki (em)", [
      { name: "font_size.date", label: "Data", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.status", label: "Status", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.teams", label: "Zespoły", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.score", label: "Wynik", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
    ]);

    sec("🧿 Ikony (px)", [
      { name: "icon_size.league", label: "Liga", selector: { number: { min: 8, max: 128, step: 1 } } },
      { name: "icon_size.crest", label: "Herb", selector: { number: { min: 8, max: 128, step: 1 } } },
      { name: "icon_size.result", label: "Symbol", selector: { number: { min: 8, max: 128, step: 1 } } },
    ]);

    sec("📐 Układ kolumn (%)", [
      { name: "columns_pct.date", label: "Data", selector: { number: { min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.league", label: "Liga", selector: { number: { min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.crest", label: "Herby", selector: { number: { min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.score", label: "Wynik", selector: { number: { min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.result", label: "Symbol", selector: { number: { min: 0, max: 50, step: 1 } } },
    ]);

    const btn = document.createElement("mwc-button");
    btn.label = "🔄 Przywróć domyślne";
    btn.addEventListener("click", () => {
      const def = this._defaults();
      if (this._config.entity) def.entity = this._config.entity;
      this._config = this._mergeDeep({}, def);
      this._flat = this._flatten(this._config);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
      this._render();
    });
    this._root.appendChild(btn);
  }

  _header(text) {
    const h = document.createElement("h4");
    h.textContent = text;
    return h;
  }

  _makeForm(schema) {
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._flat;
    form.schema = schema;
    form.addEventListener("value-changed", (ev) => {
      const partial = ev.detail.value || {};
      Object.assign(this._flat, partial);
      const nested = this._unflatten(this._flat);
      this._config = this._mergeDeep(this._config, nested);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));

      // 🔹 Opóźnione odświeżenie, żeby nie zrywać focusa
      clearTimeout(this._renderTimer);
      this._renderTimer = setTimeout(() => {
        if (Object.keys(partial).some((k) => k.startsWith("columns_pct."))) {
          this._render();
        }
      }, 400);
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
      if (value && typeof value === "object" && !Array.isArray(value)) out[key] = this._mergeDeep(out[key] || {}, value);
      else out[key] = value;
    });
    return out;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);