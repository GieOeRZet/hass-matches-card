// ============================================================================
//  Matches Card Editor – v0.3.501
//  Author: GieOeRZet
//  Features:
//   - Auto translation (PL/EN) based on HA language
//   - Dynamic visibility for Gradient/Zebra sections
//   - Compact layout (grid)
//   - No scroll jumps on numeric inputs
//   - Color pickers for result & zebra colors
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._flat = {};
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config || {}));
    this._flat = this._flatten(this._config);
    this._render();
  }

  // --- Language dictionary ---
  _t(key) {
    const lang = (this._hass && this._hass.language) || "en";
    const dict = {
      en: {
        basic: "Basic",
        appearance: "Appearance",
        fill_mode: "Fill mode",
        gradient: "Gradient",
        zebra: "Zebra",
        clear: "Clear",
        light_mode: "Light mode (no header)",
        result_colors: "Result colors",
        win_color: "Win color",
        draw_color: "Draw color",
        loss_color: "Loss color",
        zebra_color: "Zebra color",
        alpha: "Transparency",
        start: "Start (%)",
        end: "End (%)",
        font_sizes: "Font sizes (em)",
        icon_sizes: "Icon sizes (px)",
        column_widths: "Column widths (%)",
        restore_defaults: "Restore defaults",
      },
      pl: {
        basic: "Podstawowe",
        appearance: "Wygląd",
        fill_mode: "Tryb wypełnienia",
        gradient: "Gradient",
        zebra: "Zebra",
        clear: "Czysty",
        light_mode: "Tryb lekki (bez nagłówka)",
        result_colors: "Kolory wyników",
        win_color: "Kolor wygranej",
        draw_color: "Kolor remisu",
        loss_color: "Kolor porażki",
        zebra_color: "Kolor tła zebry",
        alpha: "Przezroczystość",
        start: "Początek (%)",
        end: "Koniec (%)",
        font_sizes: "Wielkości czcionek (em)",
        icon_sizes: "Rozmiary ikon (px)",
        column_widths: "Szerokości kolumn (%)",
        restore_defaults: "Przywróć domyślne",
      },
    };
    return dict[lang]?.[key] || dict.en[key];
  }

  _render() {
    if (!this._root) {
      this._root = document.createElement("div");
      this._root.style.maxWidth = "540px";
      this._root.style.margin = "0 auto";
      this.appendChild(this._root);
    }
    this._root.innerHTML = "";

    const style = document.createElement("style");
    style.textContent = `
      .section { margin: 10px 0; padding: 8px 10px; background: var(--secondary-background-color); border-radius: 8px; }
      h3 { margin: 4px 0 8px 0; font-size: 1.0em; font-weight: 600; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; }
      label { display: block; font-size: 0.85em; opacity: 0.8; margin-bottom: 2px; }
      input[type="number"], input[type="text"], select { width: 100%; padding: 4px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); }
      input[type="color"] { width: 100%; height: 32px; border: none; border-radius: 4px; }
      ha-switch { margin-top: 6px; }
      button { margin-top: 10px; padding: 6px 10px; border-radius: 6px; }
    `;
    this._root.appendChild(style);

    // ============ BASIC SECTION ============
    const sBasic = this._section(this._t("basic"));
    sBasic.appendChild(this._haForm([
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_logos", selector: { boolean: {} } },
      { name: "full_team_names", selector: { boolean: {} } },
      { name: "show_result_symbols", selector: { boolean: {} } },
    ]));

    // ============ APPEARANCE ============
    const sLook = this._section(this._t("appearance"));
    sLook.appendChild(this._haForm([
      { name: "fill_mode", selector: { select: { options: ["gradient", "zebra", "clear"] } } },
      { name: "theme_mode", selector: { select: { options: ["auto", "light", "dark"] } } },
      { name: "light_mode", selector: { boolean: {} } },
    ]));

    // ============ RESULT COLORS ============
    const sColors = this._section(this._t("result_colors"));
    const colorGrid = document.createElement("div");
    colorGrid.classList.add("grid");
    colorGrid.innerHTML = this._colorPicker("colors.win", this._t("win_color")) +
                          this._colorPicker("colors.draw", this._t("draw_color")) +
                          this._colorPicker("colors.loss", this._t("loss_color"));
    sColors.appendChild(colorGrid);

    // ============ GRADIENT ============
    const sGrad = this._section(this._t("gradient"), "gradient-section");
    const gradGrid = document.createElement("div");
    gradGrid.classList.add("grid");
    gradGrid.innerHTML =
      this._numberInput("gradient.alpha", this._t("alpha"), 0, 1, 0.1) +
      this._numberInput("gradient.start", this._t("start"), 0, 100, 1) +
      this._numberInput("gradient.end", this._t("end"), 0, 100, 1);
    sGrad.appendChild(gradGrid);

    // ============ ZEBRA ============
    const sZebra = this._section(this._t("zebra"), "zebra-section");
    const zebraGrid = document.createElement("div");
    zebraGrid.classList.add("grid");
    zebraGrid.innerHTML = this._colorPicker("zebra_color", this._t("zebra_color"));
    sZebra.appendChild(zebraGrid);

    // ============ FONTS ============
    const sFonts = this._section(this._t("font_sizes"));
    const fontGrid = document.createElement("div");
    fontGrid.classList.add("grid");
    fontGrid.innerHTML =
      this._numberInput("font_size.date", "Date", 0.5, 3, 0.1) +
      this._numberInput("font_size.status", "Status", 0.5, 3, 0.1) +
      this._numberInput("font_size.teams", "Teams", 0.5, 3, 0.1) +
      this._numberInput("font_size.score", "Score", 0.5, 3, 0.1);
    sFonts.appendChild(fontGrid);

    // ============ ICONS ============
    const sIcons = this._section(this._t("icon_sizes"));
    const iconGrid = document.createElement("div");
    iconGrid.classList.add("grid");
    iconGrid.innerHTML =
      this._numberInput("icon_size.league", "League", 8, 128, 1) +
      this._numberInput("icon_size.crest", "Crest", 8, 128, 1) +
      this._numberInput("icon_size.result", "Result", 8, 128, 1);
    sIcons.appendChild(iconGrid);

    // ============ COLUMNS ============
    const sCols = this._section(this._t("column_widths"));
    const colGrid = document.createElement("div");
    colGrid.classList.add("grid");
    colGrid.innerHTML =
      this._numberInput("columns_pct.date", "Date", 0, 50, 1) +
      this._numberInput("columns_pct.league", "League", 0, 50, 1) +
      this._numberInput("columns_pct.crest", "Crests", 0, 50, 1) +
      this._numberInput("columns_pct.score", "Score", 0, 50, 1) +
      this._numberInput("columns_pct.result", "Result", 0, 50, 1);
    sCols.appendChild(colGrid);

    // ============ APPEND ============
    this._root.append(sBasic, sLook, sColors, sGrad, sZebra, sFonts, sIcons, sCols);
    this._toggleSections();

    // Restore defaults button
    const btn = document.createElement("button");
    btn.textContent = this._t("restore_defaults");
    btn.addEventListener("click", () => {
      const def = MatchesCard.getStubConfig();
      if (this._config.entity) def.entity = this._config.entity;
      this._config = def;
      this._flat = this._flatten(def);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: def } }));
      this._render();
    });
    this._root.appendChild(btn);
  }

  _toggleSections() {
    const fill = this._flat["fill_mode"];
    const grad = this._root.querySelector(".gradient-section");
    const zebra = this._root.querySelector(".zebra-section");
    if (grad) grad.style.display = fill === "gradient" ? "block" : "none";
    if (zebra) zebra.style.display = fill === "zebra" ? "block" : "none";
  }

  _haForm(schema) {
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form.data = this._flat;
    form.schema = schema;
    form.addEventListener("value-changed", (ev) => {
      Object.assign(this._flat, ev.detail.value || {});
      this._config = this._unflatten(this._flat);
      this._toggleSections();
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    });
    return form;
  }

  _section(title, cls = "") {
    const div = document.createElement("div");
    div.classList.add("section");
    if (cls) div.classList.add(cls);
    const h3 = document.createElement("h3");
    h3.textContent = title;
    div.appendChild(h3);
    return div;
  }

  _colorPicker(path, label) {
    const val = this._flat[path] || "#000000";
    return `
      <div>
        <label>${label}</label>
        <input type="color" value="${val}" data-path="${path}">
      </div>
    `;
  }

  _numberInput(path, label, min, max, step) {
    const val = this._flat[path] ?? 0;
    return `
      <div>
        <label>${label}</label>
        <input type="number" min="${min}" max="${max}" step="${step}" value="${val}" data-path="${path}">
      </div>
    `;
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

  connectedCallback() {
    this.addEventListener("input", (ev) => {
      const path = ev.target.dataset.path;
      if (!path) return;
      const val = ev.target.type === "number"
        ? parseFloat(ev.target.value)
        : ev.target.value;
      this._flat[path] = val;
      this._config = this._unflatten(this._flat);
      this._toggleSections();
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    });
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
