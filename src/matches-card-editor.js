// ===================================================================
// Matches Card Editor – v0.3.035 (enhanced)
// - brak migania/odświeżania całego edytora przy zmianach
// - reset wartości do domyślnych (przycisk "Reset")
// - slider przezroczystości (alfa) dla tła
// - mini podglądy kolorów (jak w theme editor)
// ===================================================================

import { html, css, LitElement } from "lit";

const DEFAULTS = {
  title: "Matches",
  show_logos: true,
  show_league: true,
  max_rows: 12,

  bg_color: "#1e1e1e",
  bg_alpha: 0.95, // 0..1
  text_color: "#ffffff",
  accent_color: "#03a9f4",

  name_col_width: 60,
  score_col_width: 15,
  meta_col_width: 15,
  logo_col_width: 10,
};

class MatchesCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  setConfig(config) {
    // kopiujemy na wewnętrzny stan, by nie wywoływać rerenderów z zewnątrz
    this.config = { ...DEFAULTS, ...(config || {}) };
  }

  // -------- helpers ----------
  _emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      })
    );
  }

  _onText = (e) => {
    const key = e.currentTarget?.dataset?.key;
    if (!key) return;
    const val = e.currentTarget.value;
    if (this.config[key] === val) return;
    this.config = { ...this.config, [key]: val };
    this._emit();
  };

  _onNumber = (e) => {
    const key = e.currentTarget?.dataset?.key;
    if (!key) return;
    const num = Number(e.currentTarget.value);
    if (Number.isNaN(num) || this.config[key] === num) return;
    this.config = { ...this.config, [key]: num };
    this._emit();
  };

  _onSwitch = (e) => {
    const key = e.currentTarget?.dataset?.key;
    if (!key) return;
    const val = !!e.currentTarget.checked;
    if (this.config[key] === val) return;
    this.config = { ...this.config, [key]: val };
    this._emit();
  };

  _onColor = (e) => {
    const key = e.currentTarget?.dataset?.key;
    if (!key) return;
    const val = e.currentTarget.value; // HEX
    if (this.config[key] === val) return;
    this.config = { ...this.config, [key]: val };
    this._emit();
  };

  _onAlpha = (e) => {
    // slider 0..100 -> 0..1
    const pct = Number(e.currentTarget.value);
    const a = Math.max(0, Math.min(100, pct)) / 100;
    if (this.config.bg_alpha === a) return;
    this.config = { ...this.config, bg_alpha: a };
    this._emit();
    // nie tracimy focusa, brak re-render erzotycznego
  };

  _reset = () => {
    // zachowujemy ewentualne entity / matches użytkownika, resetujemy tylko UI/kolory/układ
    const keep = {
      matches: this.config.matches,
      entity: this.config.entity,
    };
    this.config = { ...DEFAULTS, ...keep };
    this._emit();
  };

  // mini podgląd kwadracika koloru z uwzględnieniem alfy
  _previewStyle(hex, alpha = 1) {
    const safeHex = typeof hex === "string" && hex.startsWith("#") ? hex : "#1e1e1e";
    // na podgląd – używamy rgba-overlay, by było widać alfę na checkerze:
    const rgba = this._hexToRgba(safeHex, alpha);
    return `background: linear-gradient(45deg,#bbb 25%, transparent 25%), 
                         linear-gradient(-45deg,#bbb 25%, transparent 25%),
                         linear-gradient(45deg, transparent 75%, #bbb 75%),
                         linear-gradient(-45deg, transparent 75%, #bbb 75%),
                         ${rgba};
            background-size:10px 10px,10px 10px,10px 10px,10px 10px,100% 100%;
            background-position:0 0,0 5px,5px -5px,-5px 0,0 0;`;
  }

  _hexToRgba(hex, a = 1) {
    let s = hex?.replace("#", "") || "1e1e1e";
    if (s.length === 3) s = [...s].map((c) => c + c).join("");
    const n = parseInt(s, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const alpha = Math.max(0, Math.min(1, a));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // -------- render ----------
  render() {
    if (!this.config) return html``;
    const c = this.config;

    return html`
      <div class="form">
        <div class="head">
          <div class="title">Matches Card – konfiguracja</div>
          <mwc-button dense outlined @click=${this._reset}>Reset</mwc-button>
        </div>

        <ha-textfield
          label="Tytuł"
          .value=${c.title || ""}
          data-key="title"
          @input=${this._onText}
        ></ha-textfield>

        <div class="row2">
          <div class="field">
            <div class="label">Pokaż loga</div>
            <ha-switch
              .checked=${c.show_logos ?? true}
              data-key="show_logos"
              @change=${this._onSwitch}
            ></ha-switch>
          </div>
          <div class="field">
            <div class="label">Pokaż ligę</div>
            <ha-switch
              .checked=${c.show_league ?? true}
              data-key="show_league"
              @change=${this._onSwitch}
            ></ha-switch>
          </div>
          <div class="field">
            <div class="label">Maks. wierszy</div>
            <ha-number-input
              min="1" max="50" step="1"
              .value=${Number(c.max_rows ?? DEFAULTS.max_rows)}
              data-key="max_rows"
              @input=${this._onNumber}
            ></ha-number-input>
          </div>
        </div>

        <div class="section">Kolory</div>

        <div class="row3">
          <div class="field col">
            <div class="label">Tło (HEX)</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(c.bg_color, c.bg_alpha)}></div>
              <input type="color" .value=${c.bg_color || DEFAULTS.bg_color} data-key="bg_color" @input=${this._onColor} />
              <input type="text" .value=${c.bg_color || ""} data-key="bg_color" @input=${this._onText} placeholder="#1e1e1e" />
            </div>
            <div class="alpha">
              <span>Przezroczystość: ${(Math.round((c.bg_alpha ?? DEFAULTS.bg_alpha) * 100))}%</span>
              <input type="range" min="0" max="100" .value=${Math.round((c.bg_alpha ?? DEFAULTS.bg_alpha) * 100)} @input=${this._onAlpha} />
            </div>
          </div>

          <div class="field col">
            <div class="label">Tekst</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(c.text_color, 1)}></div>
              <input type="color" .value=${c.text_color || DEFAULTS.text_color} data-key="text_color" @input=${this._onColor} />
              <input type="text" .value=${c.text_color || ""} data-key="text_color" @input=${this._onText} placeholder="#ffffff" />
            </div>
          </div>

          <div class="field col">
            <div class="label">Akcent</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(c.accent_color, 1)}></div>
              <input type="color" .value=${c.accent_color || DEFAULTS.accent_color} data-key="accent_color" @input=${this._onColor} />
              <input type="text" .value=${c.accent_color || ""} data-key="accent_color" @input=${this._onText} placeholder="#03a9f4" />
            </div>
          </div>
        </div>

        <div class="section">Szerokości kolumn (%)</div>
        <div class="row4">
          <div class="mini">
            <div class="mini-label">Logo</div>
            <ha-number-input min="5" max="30" step="1" .value=${Number(c.logo_col_width ?? 10)} data-key="logo_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Nazwa</div>
            <ha-number-input min="20" max="80" step="1" .value=${Number(c.name_col_width ?? 60)} data-key="name_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Wynik</div>
            <ha-number-input min="5" max="40" step="1" .value=${Number(c.score_col_width ?? 15)} data-key="score_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Meta</div>
            <ha-number-input min="5" max="40" step="1" .value=${Number(c.meta_col_width ?? 15)} data-key="meta_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .title {
        font-weight: 700;
      }
      .section {
        margin-top: 8px;
        font-weight: 600;
        opacity: .9;
      }
      .row2, .row3, .row4 {
        display: grid;
        gap: 12px;
      }
      .row2 { grid-template-columns: repeat(3, 1fr); }
      .row3 { grid-template-columns: repeat(3, 1fr); }
      .row4 { grid-template-columns: repeat(4, 1fr); }

      .field { display: flex; flex-direction: column; gap: 8px; }
      .label { font-weight: 600; opacity: .85; }

      .inline {
        display: grid;
        grid-template-columns: 24px 46px 1fr;
        gap: 8px;
        align-items: center;
      }

      .swatch {
        width: 24px; height: 24px; border-radius: 6px;
        border: 1px solid rgba(0,0,0,.2);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.15);
      }

      .alpha {
        display: flex; align-items: center; gap: 10px;
      }
      .alpha input[type="range"] { width: 100%; }

      .mini { display: flex; flex-direction: column; gap: 6px; }
      .mini-label { font-size: .9em; opacity: .8; }

      ha-textfield, ha-number-input, ha-select { width: 100%; }
      mwc-button[outlined] { --mdc-theme-primary: var(--primary-color); }
    `;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);