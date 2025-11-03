// SPDX-License-Identifier: MIT
// Matches Card – 90minut
// v0.3.2.002 (HA 2025.10+ compatible)

import { LitElement, html, css, nothing } from "lit";

const VERSION = "0.3.2.002";
const CARD_TAG = "matches-card";
const EDITOR_TAG = "matches-card-editor";

console.info(
  `%c[MatchesCard] v${VERSION} loaded`,
  "color:#3ba55d;font-weight:bold;"
);

const DEFAULTS = {
  entity: "",
  fill_type: "gradient", // "none" | "gradient" | "zebra" | "solid"
  solid_color: "rgba(0,0,0,0.0)",
  gradient_angle: 135,
  gradient_start: "rgba(0, 120, 255, 0.18)",
  gradient_stop1: 30, // %
  gradient_mid: "rgba(120, 0, 255, 0.10)",
  gradient_stop2: 65, // %
  gradient_end: "rgba(255, 0, 120, 0.18)",
  zebra_size: 26, // px (pas)
  zebra_gap: 26,  // px (przerwa)
  zebra_color: "rgba(0,0,0,0.06)",
  border_radius: 14,
  card_padding: 14,
  show_badge: true,
  title: "",
  font_family: "",   // np. "Inter, Roboto, sans-serif"
  font_size: 1.0,    // mnożnik
};

class MatchesCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _updatePending: { state: true },
    };
  }

  static getConfigElement() {
    return (async () => {
      if (!customElements.get(EDITOR_TAG)) {
        await import("./matches-card-editor.js");
      }
      return document.createElement(EDITOR_TAG);
    })();
  }

  static getStubConfig() {
    return {
      entity: "sensor.90minut_gornik_zabrze_matches",
      title: "Najbliższe mecze",
    };
  }

  // ====== Card metadata for the Lovelace card picker ======
  static get cardType() {
    return CARD_TAG;
  }
  static get cardName() {
    return "Matches Card (90minut)";
  }
  static get description() {
    return "Karta wyników/terminarza 90minut – z tłem gradient/zebra (RGBA).";
  }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...config };
    if (!this._config.entity) {
      // pozwalamy zapisać, ale pokażemy czytelny fallback w render()
    }
    this._updatePending = false;
  }

  // ≈ debounced odświeżanie – frontend HA 2025.x potrafi spamować set hass()
  set hass(hass) {
    this._hass = hass;
    if (this._updatePending) return;
    this._updatePending = true;
    requestAnimationFrame(() => {
      this._updatePending = false;
      this.requestUpdate();
    });
  }

  getCardSize() {
    return 3;
  }

  _computeBackgroundStyle(cfg) {
    const radius = `${Number(cfg.border_radius) ?? DEFAULTS.border_radius}px`;
    const pad = `${Number(cfg.card_padding) ?? DEFAULTS.card_padding}px`;

    let background = "transparent";

    switch (cfg.fill_type) {
      case "solid":
        background = cfg.solid_color || DEFAULTS.solid_color;
        break;

      case "zebra": {
        const size = Math.max(2, Number(cfg.zebra_size) || DEFAULTS.zebra_size);
        const gap = Math.max(2, Number(cfg.zebra_gap) || DEFAULTS.zebra_gap);
        const col = cfg.zebra_color || DEFAULTS.zebra_color;
        // delikatne, nowoczesne paski pod kątem
        background = `repeating-linear-gradient(45deg, ${col}, ${col} ${size}px, transparent ${size}px, transparent ${size + gap}px)`;
        break;
      }

      case "gradient":
      default: {
        const ang = Number(cfg.gradient_angle) || DEFAULTS.gradient_angle;
        const start = cfg.gradient_start || DEFAULTS.gradient_start;
        const mid = cfg.gradient_mid || DEFAULTS.gradient_mid;
        const end = cfg.gradient_end || DEFAULTS.gradient_end;
        const s1 = Math.min(100, Math.max(0, Number(cfg.gradient_stop1) ?? DEFAULTS.gradient_stop1));
        const s2 = Math.min(100, Math.max(0, Number(cfg.gradient_stop2) ?? DEFAULTS.gradient_stop2));
        background = `linear-gradient(${ang}deg, ${start} 0%, ${mid} ${s1}%, ${end} ${s2}%)`;
        break;
      }
    }

    const fontScale = Number(this._config.font_size) || 1.0;
    const fontFamily = this._config.font_family?.trim();

    return `
      --matches-font-scale: ${fontScale};
      border-radius:${radius};
      padding:${pad};
      background:${background};
      color: var(--primary-text-color);
      font-size: calc(var(--paper-font-body1_-_font-size, 14px) * var(--matches-font-scale));
      ${fontFamily ? `font-family: ${fontFamily};` : ""}
    `;
  }

  _state() {
    if (!this._hass || !this._config?.entity) return null;
    return this._hass.states[this._config.entity] ?? null;
  }

  render() {
    const cfg = this._config || DEFAULTS;
    const stateObj = this._state();

    // Fallback gdy nie ma encji lub brak stanu
    if (!cfg.entity || !stateObj) {
      return html`
        <ha-card style=${this._computeBackgroundStyle(cfg)}>
          <div style="display:flex;align-items:center;gap:10px;">
            <ha-icon icon="mdi:alert-circle-outline" style="color:var(--error-color);"></ha-icon>
            <div>
              <div style="font-weight:600;">Brak danych</div>
              <div style="opacity:.7">Nie znaleziono encji: <code>${cfg.entity || "—"}</code></div>
            </div>
          </div>
        </ha-card>
      `;
    }

    // Przyjmijmy, że sensor zwraca JSON w atrybucie `matches` (lista) lub tekst.
    const attrs = stateObj.attributes || {};
    const matches = Array.isArray(attrs.matches) ? attrs.matches : [];

    return html`
      <ha-card style=${this._computeBackgroundStyle(cfg)}>
        ${cfg.title
          ? html`<div class="title">${cfg.title}</div>`
          : nothing}

        ${cfg.show_badge
          ? html`<div class="badge">
              <ha-icon icon="mdi:soccer"></ha-icon>
              <span>${stateObj.state}</span>
            </div>`
          : nothing}

        ${matches.length
          ? html`
              <div class="list">
                ${matches.slice(0, 5).map((m) => this._renderItem(m))}
              </div>
            `
          : html`<div class="empty">Brak nadchodzących meczów.</div>`}
      </ha-card>
    `;
  }

  _renderItem(m) {
    // m: {date, home, away, league, venue, score, ...}
    const d = m?.date ?? "";
    const league = m?.league ?? "";
    const home = m?.home ?? "—";
    const away = m?.away ?? "—";
    const score = m?.score ?? "";
    const venue = m?.venue ?? "";

    return html`
      <div class="row">
        <div class="left">
          <div class="teams">
            <span class="home">${home}</span>
            <span class="vs">vs</span>
            <span class="away">${away}</span>
          </div>
          <div class="meta">
            ${d ? html`<span>${d}</span>` : nothing}
            ${league ? html`<span>• ${league}</span>` : nothing}
            ${venue ? html`<span>• ${venue}</span>` : nothing}
          </div>
        </div>
        <div class="right">
          ${score ? html`<span class="score">${score}</span>` : html`<span class="arrow">›</span>`}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; }
      ha-card {
        box-sizing: border-box;
        background: var(--card-background-color, #1c1c1e);
      }
      .title {
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 8px;
        letter-spacing: .2px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 999px;
        background: var(--badge-background-color, rgba(125,125,125,0.15));
        font-size: 0.875em;
        margin-bottom: 10px;
      }
      .list { display: grid; gap: 10px; }
      .row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 10px 12px;
        border-radius: 12px;
        background: color-mix(in oklab, var(--card-background-color) 82%, transparent);
        backdrop-filter: saturate(120%) blur(2px);
      }
      .row:hover { transform: translateY(-1px); transition: transform .15s ease; }
      .teams {
        display: flex; flex-wrap: wrap; gap: 8px;
        align-items: baseline; font-weight: 600;
      }
      .vs { opacity: .65; font-weight: 500; }
      .meta {
        opacity: .8; display: flex; flex-wrap: wrap; gap: 8px; font-size: .9em; margin-top: 4px;
      }
      .score { font-weight: 800; letter-spacing: .3px; }
      .arrow { opacity: .5; font-size: 22px; line-height: 1; }
    `;
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, MatchesCard);
}
