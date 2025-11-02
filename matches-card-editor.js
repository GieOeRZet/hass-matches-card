// ============================================================================
//  Matches Card Editor – v0.3.002-UI
//  - Warunkowe pola gradientu
//  - Sekcja "Zaawansowane" (domyślnie zwinięta)
//  - Tooltipy (computeHelper)
//  - Walidacja i komunikaty
//  - Reset do domyślnych wartości (z zachowaniem entity)
//  - Mini-preview (pierwszy mecz z encji)
// ============================================================================

const DEFAULTS = {
  name: "90minut Matches",
  show_name: true,
  show_logos: true,
  fill: "gradient", // gradient | zebra | none
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

// Prosty "is defined" helper dla komponentów HA (np. ha-expansion-panel)
const isDefined = (tag) => !!customElements.get(tag);

// Pobierz helpery HA (opcjonalnie)
const getHelpers = async () => {
  if (window.loadCardHelpers) {
    try { return await window.loadCardHelpers(); } catch (_) {}
  }
  return undefined;
};

class MatchesCardEditor extends HTMLElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _error: {},
      _showAdvanced: {},
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._error = "";
    this._showAdvanced = false; // Zaawansowane – domyślnie zwinięte
    this._helpers = undefined;
    getHelpers().then(h => (this._helpers = h));
  }

  setConfig(config) {
    // Po stronie edytora przechowujemy config płytko,
    // ale zadbajmy o istnienie pod-struktur:
    const c = {
      ...DEFAULTS,
      ...config,
      font_size: { ...DEFAULTS.font_size, ...(config?.font_size || {}) },
      icon_size: { ...DEFAULTS.icon_size, ...(config?.icon_size || {}) },
      gradient: { ...DEFAULTS.gradient, ...(config?.gradient || {}) },
      colors: { ...DEFAULTS.colors, ...(config?.colors || {}) },
    };
    this._config = c;
    this._error = "";
    this._render();
  }

  get value() {
    return this._config;
  }

  connectedCallback() {
    this._render();
  }

  // ============ UI schema ============
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
            mode: "dropdown",
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

  _schemaAdvanced() {
    const s = [
      {
        type: "grid",
        name: "Rozmiary czcionek",
        schema: [
          {
            name: "font_size.date",
            selector: { number: { min: 0.5, max: 3, step: 0.1, unit_of_measurement: "em" } },
          },
          {
            name: "font_size.status",
            selector: { number: { min: 0.5, max: 3, step: 0.1, unit_of_measurement: "em" } },
          },
          {
            name: "font_size.teams",
            selector: { number: { min: 0.5, max: 3, step: 0.1, unit_of_measurement: "em" } },
          },
          {
            name: "font_size.score",
            selector: { number: { min: 0.5, max: 3, step: 0.1, unit_of_measurement: "em" } },
          },
        ],
      },
      {
        type: "grid",
        name: "Rozmiary ikon",
        schema: [
          { name: "icon_size.league", selector: { number: { min: 10, max: 80, step: 1, unit_of_measurement: "px" } } },
          { name: "icon_size.crest", selector: { number: { min: 10, max: 80, step: 1, unit_of_measurement: "px" } } },
          { name: "icon_size.result", selector: { number: { min: 10, max: 80, step: 1, unit_of_measurement: "px" } } },
        ],
      },
    ];

    // Warunkowy blok gradientu
    if ((this._config?.fill || DEFAULTS.fill) === "gradient") {
      s.push({
        type: "grid",
        name: "Gradient",
        schema: [
          { name: "gradient.alpha", selector: { number: { min: 0, max: 1, step: 0.05 } } },
          { name: "gradient.start", selector: { number: { min: 0, max: 100, step: 1, unit_of_measurement: "%" } } },
          { name: "gradient.end", selector: { number: { min: 0, max: 100, step: 1, unit_of_measurement: "%" } } },
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
      "font_size.status": "Czcionka: status (czas/KONIEC)",
      "font_size.teams": "Czcionka: drużyny",
      "font_size.score": "Czcionka: wynik",

      "icon_size.league": "Ikona ligi (px)",
      "icon_size.crest": "Herb (px)",
      "icon_size.result": "Kółko wyniku (px)",

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
      case "entity":
        return "Wybierz encję (sensor) zawierającą atrybut 'matches' – tablicę meczów.";
      case "fill":
        return "Gradient – barwne tło wg wyniku; Zebra – co drugi wiersz lekko szary; Brak – bez wypełnienia.";
      case "show_result_symbol":
        return "Wyświetla kółko z literą W/R/P (Win/Remis/Porażka).";
      case "font_size.teams":
        return "Używaj wartości ~0.8–1.2em dla spójności z pozostałymi.";
      case "gradient.alpha":
        return "0 = przezroczyste, 1 = pełny kolor.";
      case "gradient.start":
      case "gradient.end":
        return "Zakres 0–100 (%). Start musi być mniejszy niż Koniec.";
      case "icon_size.result":
        return "Średnica kółka ze skrótem wyniku.";
      default:
        return undefined;
    }
  }

  // ============ Walidacja ============
  _validate(cfg) {
    // Gradient: start < end
    if ((cfg.fill || DEFAULTS.fill) === "gradient") {
      const start = Number(cfg?.gradient?.start ?? DEFAULTS.gradient.start);
      const end = Number(cfg?.gradient?.end ?? DEFAULTS.gradient.end);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return "Gradient: wartości start/end muszą być liczbami.";
      }
      if (start >= end) {
        return "Gradient: 'Start' musi być mniejszy niż 'Koniec'.";
      }
      const alpha = Number(cfg?.gradient?.alpha ?? DEFAULTS.gradient.alpha);
      if (alpha < 0 || alpha > 1) {
        return "Gradient: 'Przezroczystość' (alpha) musi być w zakresie 0–1.";
      }
    }

    // Rozmiary ikon
    const league = Number(cfg?.icon_size?.league ?? DEFAULTS.icon_size.league);
    const crest = Number(cfg?.icon_size?.crest ?? DEFAULTS.icon_size.crest);
    const result = Number(cfg?.icon_size?.result ?? DEFAULTS.icon_size.result);
    for (const [label, v] of [
      ["Ikona ligi", league],
      ["Herb", crest],
      ["Kółko wyniku", result],
    ]) {
      if (!Number.isFinite(v) || v < 8 || v > 200) {
        return `${label}: podaj wartość 8–200 px.`;
      }
    }

    // Czcionki
    const fs = cfg?.font_size || DEFAULTS.font_size;
    for (const [k, v] of Object.entries(fs)) {
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0 || n > 4) {
        return `Rozmiar czcionki '${k}': podaj wartość 0–4 (em).`;
      }
    }

    // Kolory – prosta kontrola niepustych
    const colors = cfg?.colors || DEFAULTS.colors;
    for (const [k, hex] of Object.entries(colors)) {
      if (typeof hex !== "string" || hex.trim() === "") {
        return `Kolor '${k}' nie może być pusty.`;
      }
    }

    return ""; // brak błędów
  }

  // ============ Obsługa zmian ============
  async _onValueChanged(ev) {
    if (!ev?.detail) return;
    const newConfig = ev.detail.value;

    // Zadbaj o struktury zagnieżdżone (ha-form zwraca płaski obiekt z notacją "a.b")
    const merged = this._inflateDots(newConfig);

    // Walidacja
    const err = this._validate(merged);
    this._error = err;
    this._config = merged;

    // Emituj zdarzenie dopiero, gdy brak błędów
    if (!err) {
      fireEvent(this, "config-changed", { config: this._config });
    }

    this._render(); // odśwież UI (np. warunkowe sekcje + preview)
  }

  _inflateDots(obj) {
    // Zamienia klucze z kropkami na obiekty zagnieżdżone:
    // { "font_size.teams": 1.0 } -> { font_size: { teams: 1.0 } }
    const base = JSON.parse(JSON.stringify(this._config || {}));

    const setByPath = (root, path, value) => {
      const parts = path.split(".");
      let node = root;
      while (parts.length > 1) {
        const p = parts.shift();
        if (typeof node[p] !== "object" || node[p] === null) node[p] = {};
        node = node[p];
      }
      node[parts[0]] = value;
    };

    for (const [k, v] of Object.entries(obj)) {
      if (k.includes(".")) {
        setByPath(base, k, v);
      } else {
        base[k] = v;
      }
    }

    return base;
  }

  _onToggleAdvanced() {
    this._showAdvanced = !this._showAdvanced;
    this._render();
  }

  _onResetDefaults() {
    // Zachowaj entity użytkownika
    const preservedEntity = this._config?.entity;
    const next = JSON.parse(JSON.stringify(DEFAULTS));
    if (preservedEntity) next.entity = preservedEntity;

    this._config = next;
    this._error = "";

    fireEvent(this, "config-changed", { config: this._config });
    this._render();
  }

  // ============ Mini preview ============
  _renderPreview() {
    const hass = this.hass;
    const cfg = this._config || {};
    if (!hass || !cfg?.entity || !hass.states?.[cfg.entity]) {
      return `
        <div class="preview placeholder">
          <div class="ph-title">Podgląd</div>
          <div class="ph-note">Wybierz encję (sensor) z atrybutem <code>matches</code>, aby zobaczyć pierwszy mecz.</div>
        </div>
      `;
    }

    const st = hass.states[cfg.entity];
    const matches = st?.attributes?.matches || [];
    if (!Array.isArray(matches) || matches.length === 0) {
      return `
        <div class="preview placeholder">
          <div class="ph-title">Podgląd</div>
          <div class="ph-note">Brak danych: atrybut <code>matches</code> jest pusty.</div>
        </div>
      `;
    }

    const m = matches[0];

    const date = m.date ? new Date(String(m.date).replace(" ", "T")) : null;
    const dateStr = date
      ? date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" })
      : "-";
    const timeStr = m.finished
      ? "KONIEC"
      : date
      ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
      : "";

    const [homeScore, awayScore] = (m.score || "-").split("-");

    const resultColor = (cfg.colors && m.result && cfg.colors[m.result]) || "rgba(0,0,0,0)";
    const gradientEnabled = (cfg.fill || DEFAULTS.fill) === "gradient";
    const gradientStart = Number(cfg?.gradient?.start ?? DEFAULTS.gradient.start);
    const gradientAlpha = Number(cfg?.gradient?.alpha ?? DEFAULTS.gradient.alpha);

    const fillStyle = gradientEnabled
      ? `background:linear-gradient(to right,rgba(0,0,0,0) ${gradientStart}%, ${resultColor}${gradientAlpha} 100%);`
      : (cfg.fill === "zebra" ? `background:rgba(240,240,240,0.4);` : "");

    const fs = cfg.font_size || DEFAULTS.font_size;
    const is = cfg.icon_size || DEFAULTS.icon_size;

    const leagueIcon =
      m.league === "L"
        ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png"
        : m.league === "PP"
        ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png"
        : null;

    const homeBold = m.result === "win" ? "bold" : m.result === "loss" ? "dim" : "";
    const awayBold = m.result === "loss" ? "bold" : m.result === "win" ? "dim" : "";

    const logoHome = m.logo_home ? `<img src="${m.logo_home}" height="${is.crest}" class="crest"/>` : "";
    const logoAway = m.logo_away ? `<img src="${m.logo_away}" height="${is.crest}" class="crest"/>` : "";

    return `
      <div class="preview">
        <div class="preview-row" style="${fillStyle}">
          <div class="col col-date">
            <div class="date" style="font-size:${fs.date}em">${dateStr}</div>
            <div class="status" style="font-size:${fs.status}em">${timeStr}</div>
          </div>
          <div class="col col-league">
            ${
              leagueIcon
                ? `<img src="${leagueIcon}" height="${is.league}" class="league"/>`
                : (m.league || "-")
            }
          </div>
          ${
            cfg.show_logos
              ? `<div class="col col-logos">
                  ${logoHome}<br/>${logoAway}
                 </div>`
              : ``
          }
          <div class="col col-teams">
            <div class="team ${homeBold}" style="font-size:${fs.teams}em">${m.home || "-"}</div>
            <div class="team ${awayBold}" style="font-size:${fs.teams}em">${m.away || "-"}</div>
          </div>
          <div class="col col-score" style="font-size:${fs.score}em">
            <div class="sc ${homeBold}">${homeScore ?? "-"}</div>
            <div class="sc ${awayBold}">${awayScore ?? "-"}</div>
          </div>
          <div class="col col-symbol">
            ${
              cfg.show_result_symbol && m.result
                ? `<div class="result" style="width:${is.result}px;height:${is.result}px;background:${resultColor}">${(m.result||'')[0]?.toUpperCase()||''}</div>`
                : ``
            }
          </div>
        </div>
      </div>
    `;
  }

  // ============ Render ============
  _render() {
    if (!this.shadowRoot) return;

    const hasHaForm = isDefined("ha-form");
    const hasExpansion = isDefined("ha-expansion-panel");

    const style = `
      <style>
        :host { display:block; }
        .row { display:flex; gap:12px; align-items:center; }
        ha-form { margin-top: 8px; }
        .buttons { display:flex; gap:8px; margin-top:12px; }
        .preview { margin-top: 16px; border: 1px solid rgba(0,0,0,0.12); border-radius: 10px; overflow:hidden; }
        .preview .preview-row { display:grid; grid-template-columns: 90px 70px ${this._config?.show_logos ? "70px" : "0px"} 1fr 60px 60px; align-items:center; padding:6px 10px; }
        .preview .col { text-align:center; }
        .preview .col-teams { text-align:left; }
        .preview .date { font-weight:600; }
        .preview .team.bold { font-weight:700; }
        .preview .team.dim { opacity:0.8; }
        .preview img.crest { background:white; border-radius:6px; padding:2px; }
        .preview .result {
          border-radius:50%;
          color:white; display:flex; align-items:center; justify-content:center;
          font-weight:700; margin:0 auto;
        }
        .preview.placeholder { padding:12px; }
        .ph-title { font-weight:700; margin-bottom:4px; }
        .error { margin-top: 10px; }
        .adv-toggle { margin-top: 14px; }
        .adv-wrapper { margin-top: 8px; }
        details summary { cursor: pointer; list-style: none; font-weight: 600; padding: 6px 8px; border-radius: 8px; background: rgba(0,0,0,0.06); }
        details[open] summary { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        details .inside { border: 1px solid rgba(0,0,0,0.12); border-top: none; padding: 10px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
        .headline { font-weight: 700; margin-top: 14px; }
      </style>
    `;

    const basicSchema = this._schemaBasic();
    const advSchema = this._schemaAdvanced();

    const haFormBasic = hasHaForm
      ? `<ha-form
            .hass="${"[[hass]]"}"
            .data='${JSON.stringify(this._flattenDots(this._config))}'
            .schema='${JSON.stringify(basicSchema)}'
            .computeLabel='__computeLabel'
            .computeHelper='__computeHelper'
            @value-changed='__onValueChanged'>
         </ha-form>`
      : `<div>Ładowanie edytora…</div>`;

    const haFormAdvanced = hasHaForm
      ? `<ha-form
            .hass="${"[[hass]]"}"
            .data='${JSON.stringify(this._flattenDots(this._config))}'
            .schema='${JSON.stringify(advSchema)}'
            .computeLabel='__computeLabel'
            .computeHelper='__computeHelper'
            @value-changed='__onValueChanged'>
         </ha-form>`
      : ``;

    // Fallback na <details> jeśli nie ma ha-expansion-panel
    const advancedBlock = hasExpansion
      ? `
        <ha-expansion-panel .expanded=${this._showAdvanced}>
          <div slot="header">Ustawienia zaawansowane</div>
          <div class="adv-wrapper">${haFormAdvanced}</div>
        </ha-expansion-panel>
      `
      : `
        <details ${this._showAdvanced ? "open" : ""} class="adv-toggle" @toggle='__onToggleAdvanced'>
          <summary>Ustawienia zaawansowane</summary>
          <div class="inside">
            ${haFormAdvanced}
          </div>
        </details>
      `;

    const errorBlock = this._error
      ? `<ha-alert class="error" alert-type="error">${this._error}</ha-alert>`
      : ``;

    const preview = this._renderPreview();

    // Wstrzyknięcie i podpięcie realnych referencji do funkcji/obiektów
    this.shadowRoot.innerHTML = `
      ${style}
      <div class="headline">Podstawowe</div>
      ${haFormBasic}
      ${errorBlock}

      <div class="buttons">
        <mwc-button raised label="Przywróć domyślne" @click='__onResetDefaults'></mwc-button>
        <mwc-button outlined label="${this._showAdvanced ? "Ukryj zaawansowane" : "Pokaż zaawansowane"}" @click='__onToggleAdvanced'></mwc-button>
      </div>

      ${advancedBlock}

      <div class="headline">Podgląd (na żywo) – pierwszy mecz</div>
      ${preview}
    `;

    // Podłącz dynamiczne referencje wymagane przez ha-form
    const root = this.shadowRoot;

    // computeLabel
    root.__computeLabel = (schema) => this._computeLabel(schema);
    root.__computeHelper = (schema) => this._computeHelper(schema);

    // value-changed
    root.__onValueChanged = (ev) => this._onValueChanged(ev);

    // buttons
    const resetBtn = root.querySelector('mwc-button[raised]');
    if (resetBtn) resetBtn.addEventListener('click', () => this._onResetDefaults());
    const toggleBtn = root.querySelector('mwc-button[outlined]');
    if (toggleBtn) toggleBtn.addEventListener('click', () => this._onToggleAdvanced());

    // Fallback dla <details> toggle (już podpięty atrybutem, ale Safari edge-cases)
    const detailsEl = root.querySelector('details.adv-toggle');
    if (detailsEl) detailsEl.addEventListener("toggle", () => {
      this._showAdvanced = detailsEl.open;
    });
  }

  _flattenDots(obj) {
    // Przekształca obiekt zagnieżdżony na płaski z kropkami:
    // { font_size: { teams: 1.0 } } -> { "font_size.teams": 1.0 }
    const out = {};
    const step = (path, val) => {
      if (val && typeof val === "object" && !Array.isArray(val)) {
        for (const [k, v] of Object.entries(val)) {
          step(path ? `${path}.${k}` : k, v);
        }
      } else {
        out[path] = val;
      }
    };
    step("", obj);
    return out;
  }

  // HA ustawia te właściwości przez property setters
  set hass(h) {
    this._hass = h;
    this._render();
  }
  get hass() {
    return this._hass;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
