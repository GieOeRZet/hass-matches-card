// Matches Card v0.3.040 – logo fallback, wygląd jak v0.2.011

import { LitElement, html, css, nothing } from "lit";

const DEFAULTS = {
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
  logo_col_width: 10,
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

// 🧩 Funkcja sprawdzająca lokalne logo z fallbackiem do GitHuba
function getLogoSrc(team) {
  if (!team) return "";
  const slug = team.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const local = `/hacsfiles/matches-card/logo/${slug}.png`;
  const remote = `https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/${slug}.png`;

  // Spróbuj załadować lokalne logo
  const img = new Image();
  img.src = local;
  img.onerror = () => (img.src = remote);
  return img.src;
}

function rgba(hex, alpha = 1) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = [...c].map((x) => x + x).join("");
  const n = parseInt(c, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

customElements.define(
  "matches-card",
  class MatchesCard extends LitElement {
    static get properties() {
      return { hass: {}, _config: { attribute: false } };
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
        this._config?.matches?.length || 1,
        this._config?.max_rows || DEFAULTS.max_rows
      );
      return 1 + Math.max(1, Math.floor(0.7 * rows));
    }

    render() {
      if (!this._config) return nothing;
      const c = this._config;
      const bg = rgba(c.bg_color, c.bg_alpha);
      const fg = c.text_color || DEFAULTS.text_color;
      const accent = c.accent_color || DEFAULTS.accent_color;
      const grid = [
        c.show_logos ? `${c.logo_col_width || DEFAULTS.logo_col_width}%` : null,
        `${c.name_col_width || DEFAULTS.name_col_width}%`,
        `${c.score_col_width || DEFAULTS.score_col_width}%`,
        `${c.meta_col_width || DEFAULTS.meta_col_width}%`,
      ]
        .filter(Boolean)
        .join(" ");
      const matches = Array.isArray(c.matches) ? c.matches : [];

      return html`
        <ha-card style=${`--mc-bg:${bg};--mc-fg:${fg};--mc-accent:${accent};`}>
          <div class="header">
            <div class="title">${c.title || DEFAULTS.title}</div>
          </div>
          <div class="table">
            ${matches.length === 0
              ? html`<div class="empty">Brak meczów</div>`
              : matches
                  .slice(0, c.max_rows)
                  .map((m, i) => this._renderRow(m, i, grid))}
          </div>
        </ha-card>
      `;
    }

    _renderRow(m, i, grid) {
      const live =
        (m.status || "").toString().toUpperCase().includes("LIVE") ||
        m.live === true;
      const home = m.team_home || m.home || "";
      const away = m.team_away || m.away || "";
      const res =
        m.result ??
        (m.home_score != null && m.away_score != null
          ? `${m.home_score}:${m.away_score}`
          : "-");
      const date = m.date || m.when || "";
      const league = m.league || "";

      const homeLogo = this._config.show_logos ? getLogoSrc(home) : "";
      const awayLogo = this._config.show_logos ? getLogoSrc(away) : "";

      return html`
        <div class="row ${live ? "live" : ""}" style="grid-template-columns:${grid};">
          ${this._config.show_logos
            ? html`
                <div class="cell logos">
                  ${homeLogo
                    ? html`<img src="${homeLogo}" alt="${home}" />`
                    : html`<div class="fallback">${league}</div>`}
                  ${awayLogo
                    ? html`<img src="${awayLogo}" alt="${away}" />`
                    : html`<div class="fallback">${league}</div>`}
                </div>
              `
            : nothing}

          <div class="cell teams" title="${home} vs ${away}">
            ${live ? html`<span class="live-dot"></span>` : nothing}
            <span class="team">${home}</span>
            <span class="vs">vs</span>
            <span class="team">${away}</span>
          </div>

          <div class="cell score">${res}</div>
          <div class="cell meta">${date}${this._config.show_league && league ? ` • ${league}` : ""}</div>
        </div>
      `;
    }

    static get styles() {
      return css`
        :host {
          --mc-bg: #1e1e1e;
          --mc-fg: #fff;
          --mc-accent: #03a9f4;
        }
        ha-card {
          background: var(--mc-bg);
          color: var(--mc-fg);
          border-radius: 16px;
          overflow: hidden;
        }
        .header {
          padding: 10px 14px;
          font-weight: 700;
        }
        .table {
          display: grid;
          gap: 8px;
          padding: 10px 14px 14px;
        }
        .row {
          display: grid;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
        }
        .row.live {
          outline: 2px solid var(--mc-accent);
        }
        .cell {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .logos img {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          object-fit: contain;
          background: rgba(255, 255, 255, 0.12);
          padding: 2px;
        }
        .fallback {
          font-size: 0.75em;
          opacity: 0.7;
          font-weight: 600;
        }
        .teams .team {
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vs {
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
);