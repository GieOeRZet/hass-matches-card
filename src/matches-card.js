// ===================================================================
// Matches Card – v0.3.035 (flat layout, no accordion)
// - dynamiczne kolory (tło z alfa, kolor tekstu, akcent)
// - brak migania: żadnych kosztownych operacji w render()
// - kompatybilne z edytorem 0.3.035+
// ===================================================================

import { html, css, LitElement, nothing } from "lit";
import "./matches-card-editor.js";

// Pomocnicze: HEX -> {r,g,b}
const hexToRgb = (hex) => {
  if (!hex || typeof hex !== "string") return { r: 31, g: 31, b: 31 };
  let s = hex.trim().replace("#", "");
  if (s.length === 3) s = [...s].map((c) => c + c).join("");
  const n = parseInt(s, 16);
  if (Number.isNaN(n)) return { r: 31, g: 31, b: 31 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

// z konfigu: bg_color (HEX) + bg_alpha (0..1) -> rgba()
const rgba = (hex, a = 1) => {
  const { r, g, b } = hexToRgb(hex);
  const alpha = typeof a === "number" ? Math.min(1, Math.max(0, a)) : 1;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const DEFAULTS = {
  title: "Matches",
  show_logos: true,
  show_league: true,
  max_rows: 12,

  // kolory
  bg_color: "#1e1e1e",
  bg_alpha: 0.95, // 0..1
  text_color: "#ffffff",
  accent_color: "#03a9f4",

  // układ
  name_col_width: 60,
  score_col_width: 15,
  meta_col_width: 15,
  logo_col_width: 10,

  // dane demo (stub)
  matches: [
    {
      team_home: "Górnik Zabrze",
      team_away: "Ruch Chorzów",
      result: "2:1",
      date: "2025-11-09 18:00",
      league: "Ekstraklasa",
      live: false,
    },
  ],
};

class MatchesCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { attribute: false },
    };
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return { ...DEFAULTS };
  }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...(config || {}) };
  }

  getCardSize() {
    const rows = Math.min(
      (this._config?.matches?.length || 1),
      this._config?.max_rows || DEFAULTS.max_rows
    );
    return 1 + Math.max(1, Math.floor(rows * 0.7));
  }

  // ---------- RENDER ----------
  render() {
    if (!this._config) return nothing;

    const c = this._config;
    const bg = rgba(c.bg_color, c.bg_alpha);
    const fg = c.text_color || DEFAULTS.text_color;
    const acc = c.accent_color || DEFAULTS.accent_color;

    const cols = [
      c.show_logos ? `${c.logo_col_width || DEFAULTS.logo_col_width}%` : null,
      `${c.name_col_width || DEFAULTS.name_col_width}%`,
      `${c.score_col_width || DEFAULTS.score_col_width}%`,
      `${c.meta_col_width || DEFAULTS.meta_col_width}%`,
    ]
      .filter(Boolean)
      .join(" ");

    const rows = Array.isArray(c.matches) ? c.matches : [];

    return html`
      <ha-card style=${`--mc-bg:${bg};--mc-fg:${fg};--mc-accent:${acc};`}>
        ${this._renderHeader(c)}
        <div class="table">
          ${rows.length === 0
            ? html`<div class="empty">No matches</div>`
            : rows.slice(0, c.max_rows).map((m, i) => this._renderRow(m, i, cols))}
        </div>
      </ha-card>
    `;
  }

  _renderHeader(c) {
    return html`
      <div class="header">
        <div class="title">${c.title || DEFAULTS.title}</div>
      </div>
    `;
  }

  _renderRow(m, idx, gridTemplate) {
    const isLive =
      (m.status || "").toString().toUpperCase().includes("LIVE") || m.live === true;

    const home = m.team_home || m.home || "";
    const away = m.team_away || m.away || "";
    const score =
      m.result ??
      (m.home_score != null && m.away_score != null
        ? `${m.home_score}–${m.away_score}`
        : "-");

    const when = m.date || m.when || "";

    return html`
      <div
        class="row ${isLive ? "live" : ""}"
        style=${`grid-template-columns:${gridTemplate};`}
      >
        ${this._config.show_logos
          ? html`<div class="cell logos">
              <div class="logo-blob"></div>
              <div class="logo-blob"></div>
            </div>`
          : nothing}

        <div class="cell teams" title="${home} vs ${away}">
          ${isLive ? html`<span class="live-dot"></span>` : nothing}
          <span class="team">${home}</span>
          <span class="vs">vs</span>
          <span class="team">${away}</span>
        </div>

        <div class="cell score">${score}</div>
        <div class="cell meta">${when}${this._config.show_league && m.league ? ` • ${m.league}` : ""}</div>
      </div>
    `;
  }

  // ---------- STYLES ----------
  static get styles() {
    return css`
      :host {
        --mc-bg: #1e1e1e;
        --mc-fg: #ffffff;
        --mc-accent: #03a9f4;
      }
      ha-card {
        background: var(--mc-bg);
        color: var(--mc-fg);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
      }
      .title {
        font-weight: 700;
      }
      .table {
        display: grid;
        gap: 8px;
        padding: 10px 12px 12px;
      }
      .empty {
        opacity: 0.7;
        text-align: center;
        padding: 12px 8px;
      }
      .row {
        display: grid;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 10px;
      }
      .row.live {
        outline: 2px solid var(--mc-accent);
      }
      .cell {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 8px;
      }
      .logos {
        gap: 6px;
      }
      .logo-blob {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.18);
      }
      .teams .team {
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .teams .vs {
        opacity: 0.6;
        margin: 0 6px;
      }
      .score {
        justify-content: center;
        font-weight: 800;
      }
      .meta {
        justify-content: flex-end;
        opacity: 0.85;
        font-variant-numeric: tabular-nums;
      }
      .live-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mc-accent);
        margin-right: 6px;
        animation: pulse 1.2s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0.7; }
      }
    `;
  }
}

customElements.define("matches-card", MatchesCard);