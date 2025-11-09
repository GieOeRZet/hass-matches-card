// ============================================================================
//  Matches Card Editor – v0.3.503
//  Author: GieOeRZet
//  - Dynamic fill modes: gradient / zebra / clear
//  - Full HA color pickers (RGB wheel)
//  - Debounced value updates (no jumping)
//  - Auto PL/EN translation
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
      light_mode: false,
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      zebra_color: "",
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
      this._root.style.padding = "8px";
      this.appendChild(this._root);
    }
    this._root.innerHTML = "";
    this._forms = [];

    const lang = (this._hass && this._hass.language) || "en";
    const LANG = {
      en: {
        basic: "Basic",
        appearance: "Appearance",
        fill_mode: "Fill mode",
        theme_mode: "Theme",
        gradient: "Gradient",
        zebra: "Zebra",
        clear: "Clear",
        alpha: "Transparency",
        start: "Start (%)",
        end: "End (%)",
        zebra_color: "Zebra color",
        win_color: "Win color",
        draw_color: "Draw color",
        loss_color: "Loss color",
        font_sizes: "Font sizes (em)",
        icon_sizes: "Icon sizes (px)",
        column_widths: "Column widths (%)",
        light_mode: "Light mode (no header, no padding)",
        restore_defaults: "Restore defaults",
      },
      pl: {
        basic: "Podstawowe",
        appearance: "Wygląd",
        fill_mode: "Tryb wypełnienia",
        theme_mode: "Motyw",
        gradient: "Gradient",
        zebra: "Zebra",
        clear: "Czysty",
        alpha: "Przezroczystość",
        start: "Początek (%)",
        end: "Koniec (%)",
        zebra_color: "Kolor tła zebry",
        win_color: "Kolor wygranej",
        draw_color: "Kolor remisu",
        loss_color: "Kolor porażki",
        font_sizes: "Wielkości czcionek (em)",
        icon_sizes: "Rozmiary ikon (px)",
        column_widths: "Szerokości kolumn (%)",
        light_mode: "Tryb lekki (bez nagłówka i marginesów)",
        restore_defaults: "Przywróć domyślne",
      },
    };
    const t = (key) => LANG[lang]?.[key] || LANG.en[key];

    // === STYLE ===
    const css = document.createElement("style");
    css.textContent = `
      .section {
        border-radius: 8px;
        margin: 8px 0;
        padding: 8px 12px;
        background: var(--secondary-background-color);
      }
      h3 {
        margin: 4px 0 6px;
        font-weight: 600;
      }
      mwc-button { margin-top: 8px; }
    `;
    this._root.appendChild(css);

    // === BASIC ===
    this._addSection(t("basic"), [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_logos", selector: { boolean: {} } },
      { name: "full_team_names", selector: { boolean: {} } },
      { name: "show_result_symbols", selector: { boolean: {} } },
    ]);

    // === APPEARANCE ===
    this._addSection(t("appearance"), [
      { name: "fill_mode", selector: { select: { options: ["gradient", "zebra", "clear"] } } },
      { name: "theme_mode", selector: { select: { options: ["auto", "light", "dark"] } } },
      { name: "light_mode", selector: { boolean: {} }, label: t("light_mode") },
    ]);

    // === FILL-MODE SPECIFIC ===
    if (this._flat["fill_mode"] === "gradient") {
      this._addSection(t("gradient"), [
        { name: "gradient.alpha", label: t("alpha"), selector: { number: { mode: "box", min: 0, max: 1, step: 0.1 } } },
        { name: "gradient.start", label: t("start"), selector: { number: { mode: "box", min: 0, max: 100, step: 1 } } },
        { name: "gradient.end", label: t("end"), selector: { number: { mode: "box", min: 0, max: 100, step: 1 } } },
      ]);
    } else if (this._flat["fill_mode"] === "zebra") {
      this._addSection(t("zebra"), [
        { name: "zebra_color", label: t("zebra_color"), selector: { color: { type: "rgb" } } },
      ]);
    }

    // === COLORS ===
    this._addSection("Colors", [
      { name: "colors.win", label: t("win_color"), selector: { color: { type: "rgb" } } },
      { name: "colors.draw", label: t("draw_color"), selector: { color: { type: "rgb" } } },
      { name: "colors.loss", label: t("loss_color"), selector: { color: { type: "rgb" } } },
    ]);

    // === FONTS ===
    this._addSection(t("font_sizes"), [
      { name: "font_size.date", label: "Date", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.status", label: "Status", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.teams", label: "Teams", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
      { name: "font_size.score", label: "Score", selector: { number: { mode: "box", min: 0.5, max: 3, step: 0.1 } } },
    ]);

    // === ICONS ===
    this._addSection(t("icon_sizes"), [
      { name: "icon_size.league", label: "League", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
      { name: "icon_size.crest", label: "Crest", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
      { name: "icon_size.result", label: "Result", selector: { number: { mode: "box", min: 8, max: 128, step: 1 } } },
    ]);

    // === COLUMNS ===
    this._addSection(t("column_widths"), [
      { name: "columns_pct.date", label: "Date", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.league", label: "League", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.crest", label: "Crests", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.score", label: "Score", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
      { name: "columns_pct.result", label: "Symbol", selector: { number: { mode: "box", min: 0, max: 50, step: 1 } } },
    ]);

    // === RESET BUTTON ===
    const btn = document.createElement("mwc-button");
    btn.label = t("restore_defaults");
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

  _addSection(title, schema) {
    const wrap = document.createElement("div");
    wrap.classList.add("section");
    const h = document.createElement("h3");
    h.innerText = title;
    wrap.appendChild(h);

    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._flat;
    form.schema = schema;

    // Debounced handler
    form.addEventListener("value-changed", (ev) => {
      const partialFlat = ev.detail.value || {};
      Object.assign(this._flat, partialFlat);
      const nested = this._unflatten(this._flat);
      this._config = this._mergeDeep(this._config, nested);

      if (this._debounce) clearTimeout(this._debounce);
      this._debounce = setTimeout(() => {
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
        if (Object.prototype.hasOwnProperty.call(partialFlat, "fill_mode")) this._render();
      }, 300);
    });

    this._forms.push(form);
    wrap.appendChild(form);
    this._root.appendChild(wrap);
  }

  // === UTILITIES ===
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
