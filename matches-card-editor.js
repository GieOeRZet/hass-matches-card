// ============================================================================
//  Matches Card Editor – v0.3.006-UI
//  - Sekcja „Zaawansowane” (rozwijana)
//  - Warunkowe pola gradientu
//  - Tooltipy (computeHelper)
//  - Walidacja
//  - Reset do domyślnych wartości
//  - Mini podgląd (pierwszy mecz z encji)
// ============================================================================

// 🔹 importujemy komponenty HA i Material Web Components
import "@material/mwc-button";
import "@material/mwc-switch";
import "@material/mwc-formfield";
import "@polymer/paper-input/paper-input.js";


const DEFAULTS = {
  name: "90minut Matches",
  show_name: true,
  show_logos: true,
  fill: "gradient",
  show_result_symbol: true,
  font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
  icon_size: { league: 26, crest: 24, result: 26 },
  gradient: { alpha: 0.5, start: 35, end: 100 },
  colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
};

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

class MatchesCardEditor extends HTMLElement {
  static get properties() {
    return { hass: {}, _config: {}, _error: {}, _showAdvanced: {} };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._error = "";
    this._showAdvanced = false;
  }

  setConfig(config) {
    this._config = {
      ...DEFAULTS,
      ...config,
      font_size: { ...DEFAULTS.font_size, ...(config?.font_size || {}) },
      icon_size: { ...DEFAULTS.icon_size, ...(config?.icon_size || {}) },
      gradient: { ...DEFAULTS.gradient, ...(config?.gradient || {}) },
      colors: { ...DEFAULTS.colors, ...(config?.colors || {}) },
    };
    this._render();
  }

  // ---------- Schemat podstawowy ----------
  _schemaBasic() {
    return [
      { name: "entity", selector: { entity: { domain: "sensor" } } },
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      { name: "show_logos", selector: { boolean: {} } },
      {
        name: "fill",
        selector: {
          select: {
            options: [
              { value: "gradient", label: "Gradient" },
              { value: "zebra", label: "Zebra" },
              { value: "none", label: "Brak" },
            ],
          },
        },
      },
      { name: "show_result_symbol", selector: { boolean: {} } },
    ];
  }

  // ---------- Schemat zaawansowany ----------
  _schemaAdvanced() {
    const s = [
      {
        type: "grid",
        name: "Rozmiary czcionek",
        schema: [
          { name: "font_size.date", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
          { name: "font_size.status", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
          { name: "font_size.teams", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
          { name: "font_size.score", selector: { number: { min: 0.5, max: 3, step: 0.1 } } },
        ],
      },
      {
        type: "grid",
        name: "Rozmiary ikon",
        schema: [
          { name: "icon_size.league", selector: { number: { min: 10, max: 80, step: 1 } } },
          { name: "icon_size.crest", selector: { number: { min: 10, max: 80, step: 1 } } },
          { name: "icon_size.result", selector: { number: { min: 10, max: 80, step: 1 } } },
        ],
      },
    ];

    if ((this._config?.fill || DEFAULTS.fill) === "gradient") {
      s.push({
        type: "grid",
        name: "Gradient",
        schema: [
          { name: "gradient.alpha", selector: { number: { min: 0, max: 1, step: 0.05 } } },
          { name: "gradient.start", selector: { number: { min: 0, max: 100, step: 1 } } },
          { name: "gradient.end", selector: { number: { min: 0, max: 100, step: 1 } } },
        ],
      });
    }

    s.push({
      type: "grid",
      name: "Kolory wyników",
      schema: [
        { name: "colors.win", selector: { color: {} } },
        { name: "colors.draw", selector: { color: {} } },
        { name: "colors.loss", selector: { color: {} } },
      ],
    });
    return s;
  }

  _computeLabel(schema) {
    const map = {
      entity: "Encja z meczami",
      name: "Nazwa karty",
      show_name: "Pokaż nagłówek",
      show_logos: "Pokaż herby drużyn",
      fill: "Styl wypełnienia",
      show_result_symbol: "Pokaż symbol wyniku",
      "font_size.date": "Czcionka: data",
      "font_size.status": "Czcionka: status",
      "font_size.teams": "Czcionka: drużyny",
      "font_size.score": "Czcionka: wynik",
      "icon_size.league": "Ikona ligi",
      "icon_size.crest": "Herb",
      "icon_size.result": "Kółko wyniku",
      "gradient.alpha": "Przezroczystość (0–1)",
      "gradient.start": "Start (%)",
      "gradient.end": "Koniec (%)",
      "colors.win": "Kolor zwycięstwa",
      "colors.draw": "Kolor remisu",
      "colors.loss": "Kolor porażki",
    };
    return map[schema.name] || schema.name;
  }

  _computeHelper(schema) {
    switch (schema.name) {
      case "fill":
        return "Gradient – barwne tło wg wyniku; Zebra – co drugi wiersz szary; Brak – bez wypełnienia.";
      case "gradient.alpha":
        return "0 = przezroczyste, 1 = pełny kolor.";
      case "gradient.start":
      case "gradient.end":
        return "Zakres 0–100 (%). Start musi być mniejszy niż Koniec.";
      default:
        return undefined;
    }
  }

  // ---------- Walidacja ----------
  _validate(cfg) {
    if ((cfg.fill || DEFAULTS.fill) === "gradient") {
      const s = Number(cfg?.gradient?.start ?? 0);
      const e = Number(cfg?.gradient?.end ?? 100);
      if (s >= e) return "Gradient: Start musi być mniejszy niż Koniec.";
    }
    return "";
  }

  _inflateDots(obj) {
    const base = JSON.parse(JSON.stringify(this._config || {}));
    const setByPath = (root, path, val) => {
      const parts = path.split(".");
      let node = root;
      while (parts.length > 1) {
        const p = parts.shift();
        if (typeof node[p] !== "object" || node[p] === null) node[p] = {};
        node = node[p];
      }
      node[parts[0]] = val;
    };
    for (const [k, v] of Object.entries(obj)) {
      if (k.includes(".")) setByPath(base, k, v);
      else base[k] = v;
    }
    return base;
  }

  _flattenDots(obj) {
    const out = {};
    const step = (path, val) => {
      if (val && typeof val === "object" && !Array.isArray(val))
        for (const [k, v] of Object.entries(val))
          step(path ? `${path}.${k}` : k, v);
      else out[path] = val;
    };
    step("", obj);
    return out;
  }

  _onValueChanged(ev) {
    const merged = this._inflateDots(ev.detail.value);
    const err = this._validate(merged);
    this._config = merged;
    this._error = err;
    if (!err) fireEvent(this, "config-changed", { config: this._config });
    this._render();
  }

  _onResetDefaults() {
    const ent = this._config?.entity;
    this._config = { ...DEFAULTS };
    if (ent) this._config.entity = ent;
    fireEvent(this, "config-changed", { config: this._config });
    this._render();
  }

  _onToggleAdvanced() {
    this._showAdvanced = !this._showAdvanced;
    this._render();
  }

  _renderPreview() {
    const hass = this.hass;
    const cfg = this._config;
    if (!hass || !cfg?.entity || !hass.states?.[cfg.entity])
      return `<div style="padding:8px;border:1px dashed var(--divider-color)">Brak danych podglądu</div>`;

    const m = hass.states[cfg.entity].attributes.matches?.[0];
    if (!m) return `<div style="padding:8px;border:1px dashed var(--divider-color)">Brak danych</div>`;

    const color = cfg.colors[m.result] || "#888";
    const fill =
      cfg.fill === "gradient"
        ? `background:linear-gradient(to right,rgba(0,0,0,0) ${cfg.gradient.start}%,${color}${cfg.gradient.alpha} 100%)`
        : cfg.fill === "zebra"
        ? "background:rgba(240,240,240,0.4)"
        : "";

    return `<div style="margin-top:6px;padding:8px;border-radius:8px;${fill}">
      <b>${m.home}</b> ${m.score || ""} <b>${m.away}</b>
      <small>(${m.date || ""})</small>
    </div>`;
  }

  _render() {
    if (!this.shadowRoot) return;
    const style = `
      <style>
        :host{display:block;}
        .btns{display:flex;gap:8px;margin-top:10px;}
        .error{color:var(--error-color);margin-top:4px;}
        details summary{cursor:pointer;font-weight:600;padding:4px 8px;background:rgba(0,0,0,0.05);border-radius:6px;}
        details[open] summary{border-bottom-left-radius:0;border-bottom-right-radius:0;}
        details .inside{border:1px solid rgba(0,0,0,0.12);border-top:none;padding:8px;border-bottom-left-radius:6px;border-bottom-right-radius:6px;}
      </style>`;

    const data = this._flattenDots(this._config);
    const err = this._error ? `<div class="error">${this._error}</div>` : "";

    this.shadowRoot.innerHTML = `
      ${style}
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schemaBasic()}
        .computeLabel=${(s) => this._computeLabel(s)}
        .computeHelper=${(s) => this._computeHelper(s)}
        @value-changed=${(e) => this._onValueChanged(e)}>
      </ha-form>
      ${err}
      <div class="btns">
        <mwc-button raised @click=${() => this._onResetDefaults()}>Przywróć domyślne</mwc-button>
        <mwc-button outlined @click=${() => this._onToggleAdvanced()}>${
          this._showAdvanced ? "Ukryj zaawansowane" : "Pokaż zaawansowane"
        }</mwc-button>
      </div>
      <details ${this._showAdvanced ? "open" : ""}>
        <summary>Ustawienia zaawansowane</summary>
        <div class="inside">
          <ha-form
            .hass=${this.hass}
            .data=${data}
            .schema=${this._schemaAdvanced()}
            .computeLabel=${(s) => this._computeLabel(s)}
            .computeHelper=${(s) => this._computeHelper(s)}
            @value-changed=${(e) => this._onValueChanged(e)}>
          </ha-form>
        </div>
      </details>
      ${this._renderPreview()}
    `;
  }

  set hass(h) {
    this._hass = h;
    this._render();
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
