// ============================================================================
//  Matches Card Editor – v0.9.40
//  Autor: GieOeRZet
//  Opis: Edytor SmartAccordion (PL/EN), sekcje domyślnie zwinięte,
//         numeryczne pola (bez suwaków), pełna integracja z GUI edytorem.
// ============================================================================

import { LitElement, html, css } from "lit";

class MatchesCardEditor extends LitElement {
  static get properties() {
    return { _config: {} };
  }

  setConfig(config) {
    this._config = config || {};
  }

  // proste tłumaczenia inline (GUI używa języka HA)
  _t(key) {
    const lang = (document.documentElement.lang || "en").startsWith("pl") ? "pl" : "en";
    const d = {
      pl: {
        sections: { basic: "Podstawowe", appearance: "Wygląd", gradient: "Gradient", columns: "Układ kolumn (%)", sizes: "Rozmiary (em/px)", colors: "Kolory wyników" },
        labels: {
          entity: "Encja (sensor.*)", name: "Nazwa karty",
          show_name: "Pokaż nagłówek", show_logos: "Pokaż herby", full_team_names: "Pełne nazwy drużyn",
          show_result_symbols: "Symbole wyników (W/R/P)",
          fill_mode: "Tryb wypełnienia", theme_mode: "Tryb motywu",
          grad_alpha: "Przezroczystość (0–1)", grad_start: "Start (%)", grad_end: "Koniec (%)",
          col_date: "Data", col_league: "Liga", col_crest: "Herby", col_score: "Wynik", col_result: "Symbol",
          fs_date: "Data", fs_status: "Status", fs_teams: "Drużyny", fs_score: "Wynik",
          is_league: "Liga (px)", is_crest: "Herby (px)", is_result: "Symbol (px)",
          color_win: "Kolor – wygrana", color_draw: "Kolor – remis", color_loss: "Kolor – porażka"
        },
        options: { fill: { gradient: "Gradient", zebra: "Zebra", none: "Brak" }, theme: { auto: "Automatyczny", light: "Jasny", dark: "Ciemny" } }
      },
      en: {
        sections: { basic: "Basic", appearance: "Appearance", gradient: "Gradient", columns: "Column layout (%)", sizes: "Sizes (em/px)", colors: "Result colors" },
        labels: {
          entity: "Entity (sensor.*)", name: "Card name",
          show_name: "Show header", show_logos: "Show crests", full_team_names: "Full team names",
          show_result_symbols: "Result symbols (W/D/L)",
          fill_mode: "Fill mode", theme_mode: "Theme mode",
          grad_alpha: "Opacity (0–1)", grad_start: "Start (%)", grad_end: "End (%)",
          col_date: "Date", col_league: "League", col_crest: "Crests", col_score: "Score", col_result: "Symbol",
          fs_date: "Date", fs_status: "Status", fs_teams: "Teams", fs_score: "Score",
          is_league: "League (px)", is_crest: "Crests (px)", is_result: "Symbol (px)",
          color_win: "Color – win", color_draw: "Color – draw", color_loss: "Color – loss"
        },
        options: { fill: { gradient: "Gradient", zebra: "Zebra", none: "None" }, theme: { auto: "Auto", light: "Light", dark: "Dark" } }
      }
    };
    return key.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : null), d[lang]) || key;
  }

  _get(path) {
    return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), this._config);
  }
  _set(path, value) {
    const segs = path.split(".");
    let obj = this._config;
    while (segs.length > 1) {
      const k = segs.shift();
      if (!obj[k] || typeof obj[k] !== "object") obj[k] = {};
      obj = obj[k];
    }
    obj[segs[0]] = value;
  }

  _onInput(e) {
    const path = e.target.dataset.path;
    let val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.type === "number") {
      const n = Number(val);
      if (!Number.isNaN(n)) val = n;
    }
    this._set(path, val);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _toggle(e) {
    e.currentTarget.parentElement.classList.toggle("open");
  }

  _section(title, icon, inner) {
    return html`
      <div class="section">
        <div class="header" @click=${this._toggle}><span class="icon">${icon}</span>${title}</div>
        <div class="content">${inner}</div>
      </div>
    `;
  }

  _input(path, label, type = "text", step = null) {
    const val = this._get(path);
    return html`
      <label>${label}
        <input data-path="${path}" type="${type}" .value=${val ?? ""} ${step ? `step="${step}"` : ""} @input=${this._onInput} />
      </label>
    `;
  }

  _checkbox(path, label) {
    const val = !!this._get(path);
    return html`
      <label class="row">
        <input type="checkbox" data-path="${path}" ?checked=${val} @change=${this._onInput} />
        <span>${label}</span>
      </label>
    `;
  }

  _select(path, label, options) {
    const val = this._get(path);
    return html`
      <label>${label}
        <select data-path="${path}" @change=${this._onInput}>
          ${Object.entries(options).map(([k, v]) => html`<option value=${k} ?selected=${val === k}>${v}</option>`)}
        </select>
      </label>
    `;
  }

  render() {
    if (!this._config) return html``;
    return html`
      <div class="editor">
        ${this._section(
          this._t("sections.basic"),
          "⚙️",
          html`
            ${this._input("entity", this._t("labels.entity"))}
            ${this._input("name", this._t("labels.name"))}
            <div class="grid">
              ${this._checkbox("show_name", this._t("labels.show_name"))}
              ${this._checkbox("show_logos", this._t("labels.show_logos"))}
              ${this._checkbox("full_team_names", this._t("labels.full_team_names"))}
              ${this._checkbox("show_result_symbols", this._t("labels.show_result_symbols"))}
            </div>
          `
        )}

        ${this._section(
          this._t("sections.appearance"),
          "🎨",
          html`
            ${this._select("fill_mode", this._t("labels.fill_mode"), this._t("options.fill"))}
            ${this._select("theme_mode", this._t("labels.theme_mode"), this._t("options.theme"))}
          `
        )}

        ${this._section(
          this._t("sections.gradient"),
          "🌈",
          html`
            <div class="grid">
              ${this._input("gradient.alpha", this._t("labels.grad_alpha"), "number", "0.05")}
              ${this._input("gradient.start", this._t("labels.grad_start"), "number", "1")}
              ${this._input("gradient.end", this._t("labels.grad_end"), "number", "1")}
            </div>
          `
        )}

        ${this._section(
          this._t("sections.columns"),
          "📐",
          html`
            <div class="grid">
              ${this._input("columns_pct.date", this._t("labels.col_date"), "number", "1")}
              ${this._input("columns_pct.league", this._t("labels.col_league"), "number", "1")}
              ${this._input("columns_pct.crest", this._t("labels.col_crest"), "number", "1")}
              ${this._input("columns_pct.score", this._t("labels.col_score"), "number", "1")}
              ${this._input("columns_pct.result", this._t("labels.col_result"), "number", "1")}
            </div>
          `
        )}

        ${this._section(
          this._t("sections.sizes"),
          "📏",
          html`
            <div class="grid">
              ${this._input("font_size.date", this._t("labels.fs_date"), "number", "0.1")}
              ${this._input("font_size.status", this._t("labels.fs_status"), "number", "0.1")}
              ${this._input("font_size.teams", this._t("labels.fs_teams"), "number", "0.1")}
              ${this._input("font_size.score", this._t("labels.fs_score"), "number", "0.1")}
              ${this._input("icon_size.league", this._t("labels.is_league"), "number", "1")}
              ${this._input("icon_size.crest", this._t("labels.is_crest"), "number", "1")}
              ${this._input("icon_size.result", this._t("labels.is_result"), "number", "1")}
            </div>
          `
        )}

        ${this._section(
          this._t("sections.colors"),
          "🎯",
          html`
            <div class="grid">
              ${this._input("colors.win", this._t("labels.color_win"))}
              ${this._input("colors.draw", this._t("labels.color_draw"))}
              ${this._input("colors.loss", this._t("labels.color_loss"))}
            </div>
          `
        )}
      </div>
    `;
  }

  static get styles() {
    return css`
      .section {
        background: var(--ha-card-background, rgba(255, 255, 255, 0.04));
        margin: 8px 0;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      .header {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 10px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .header:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      .icon {
        margin-right: 8px;
        font-size: 1.1em;
      }
      .content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.25s ease, padding 0.25s ease;
        padding: 0 10px;
      }
      .section.open .content {
        max-height: 1000px;
        padding: 10px;
      }
      label {
        display: block;
        margin: 8px 0;
      }
      input,
      select {
        width: 100%;
        padding: 6px;
        border-radius: 6px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }
      .row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      @media (max-width: 520px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);