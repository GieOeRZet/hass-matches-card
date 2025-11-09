import { LitElement, html, css } from "lit";

const defaultConfig = {
  title: "Matches",
  show_logos: true,
  show_league: true,
  max_rows: 12,
  bg_color: "#1e1e1e",
  bg_alpha: 0.95,
  text_color: "#ffffff",
  accent_color: "#03a9f4",
  name_col_width: 60,
  score_col_width: 15,
  meta_col_width: 15,
  logo_col_width: 10
};

class MatchesCardEditor extends LitElement {
  static properties = {
    hass: {},
    config: {}
  };

  setConfig(config) {
    this.config = { ...defaultConfig, ...config };
  }

  // 🔹 emitowanie zmiany do HA
  _emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true
      })
    );
  }

  // 🔹 aktualizacja pól
  _onInput(e) {
    const key = e.target.dataset.key;
    if (!key) return;
    let val = e.target.value;

    if (e.target.type === "number") val = Number(val);
    if (e.target.type === "range") val = Number(val) / 100;
    if (e.target.type === "checkbox") val = e.target.checked;

    if (this.config[key] !== val) {
      this.config = { ...this.config, [key]: val };
      this._emit();
      this.requestUpdate();
    }
  }

  // 🔹 reset konfiguracji
  _reset() {
    const preserve = {
      matches: this.config.matches,
      entity: this.config.entity
    };
    this.config = { ...defaultConfig, ...preserve };
    this._emit();
  }

  // 🔹 podgląd koloru w tle kratkowanym
  _previewStyle(color, alpha = 1) {
    const rgba = this._hexToRgba(color, alpha);
    return `
      background:
        linear-gradient(45deg, #bbb 25%, transparent 25%),
        linear-gradient(-45deg, #bbb 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #bbb 75%),
        linear-gradient(-45deg, transparent 75%, #bbb 75%),
        ${rgba};
      background-size: 10px 10px;
      background-position: 0 0, 0 5px, 5px -5px, -5px 0;
    `;
  }

  _hexToRgba(hex, alpha = 1) {
    let c = hex?.replace("#", "") || "1e1e1e";
    if (c.length === 3) c = [...c].map((x) => x + x).join("");
    const i = parseInt(c, 16);
    return `rgba(${(i >> 16) & 255}, ${(i >> 8) & 255}, ${i & 255}, ${alpha})`;
  }

  render() {
    if (!this.config) return html``;
    const c = this.config;

    return html`
      <div class="form">
        <div class="head">
          <div class="title">⚽ Matches Card — konfiguracja</div>
          <mwc-button dense outlined @click=${this._reset}>Reset</mwc-button>
        </div>

        <ha-textfield
          label="Tytuł"
          .value=${c.title || ""}
          data-key="title"
          @input=${this._onInput}
        ></ha-textfield>

        <div class="row2">
          <div class="field">
            <div class="label">Pokaż loga</div>
            <ha-switch
              .checked=${c.show_logos ?? true}
              data-key="show_logos"
              @change=${this._onInput}
            ></ha-switch>
          </div>

          <div class="field">
            <div class="label">Pokaż ligę</div>
            <ha-switch
              .checked=${c.show_league ?? true}
              data-key="show_league"
              @change=${this._onInput}
            ></ha-switch>
          </div>

          <div class="field">
            <div class="label">Maks. wierszy</div>
            <ha-number-input
              min="1" max="50" step="1"
              .value=${c.max_rows}
              data-key="max_rows"
              @input=${this._onInput}
            ></ha-number-input>
          </div>
        </div>

        <div class="section">🎨 Kolory i tło</div>
        <div class="row3">
          <div class="field col">
            <div class="label">Tło (HEX)</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(c.bg_color, c.bg_alpha)}></div>
              <input type="color" .value=${c.bg_color} data-key="bg_color" @input=${this._onInput}/>
              <input type="text" .value=${c.bg_color} data-key="bg_color" @input=${this._onInput}/>
            </div>
            <div class="alpha">
              <span>Przezroczystość: ${(c.bg_alpha * 100).toFixed(0)}%</span>
              <input type="range" min="0" max="100" .value=${Math.round(c.bg_alpha * 100)} data-key="bg_alpha" @input=${this._onInput}/>
            </div>
          </div>

          <div class="field col">
            <div class="label">Tekst</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(c.text_color, 1)}></div>
              <input type="color" .value=${c.text_color} data-key="text_color" @input=${this._onInput}/>
              <input type="text" .value=${c.text_color} data-key="text_color" @input=${this._onInput}/>
            </div>
          </div>

          <div class="field col">
            <div class="label">Akcent</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(c.accent_color, 1)}></div>
              <input type="color" .value=${c.accent_color} data-key="accent_color" @input=${this._onInput}/>
              <input type="text" .value=${c.accent_color} data-key="accent_color" @input=${this._onInput}/>
            </div>
          </div>
        </div>

        <div class="section">📏 Szerokości kolumn (%)</div>
        <div class="row4">
          ${[
            ["logo_col_width", "Logo", 5, 30],
            ["name_col_width", "Nazwa", 20, 80],
            ["score_col_width", "Wynik", 5, 40],
            ["meta_col_width", "Meta", 5, 40]
          ].map(([key, label, min, max]) => html`
            <div class="mini">
              <div class="mini-label">${label}</div>
              <ha-number-input
                min="${min}" max="${max}" step="1"
                .value=${c[key]}
                data-key="${key}"
                @input=${this._onInput}
              ></ha-number-input>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  static styles = css`
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-weight: 700;
      font-size: 1.1em;
    }
    .section {
      margin-top: 8px;
      font-weight: 600;
      opacity: 0.9;
    }
    .row2, .row3, .row4 {
      display: grid;
      gap: 12px;
    }
    .row2 { grid-template-columns: repeat(3, 1fr); }
    .row3 { grid-template-columns: repeat(3, 1fr); }
    .row4 { grid-template-columns: repeat(4, 1fr); }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .inline {
      display: grid;
      grid-template-columns: 24px 46px 1fr;
      gap: 8px;
      align-items: center;
    }
    .swatch {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,0.25);
    }
    .alpha {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .mini-label {
      font-size: 0.9em;
      opacity: 0.85;
    }
    mwc-button[outlined] {
      --mdc-theme-primary: var(--primary-color);
    }
  `;
}

customElements.define("matches-card-editor", MatchesCardEditor);