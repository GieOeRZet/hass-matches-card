// ============================================================================
//  Matches Card (90minut) - główny plik karty
//  Wersja: 0.3.004
//  Autor: GieOeRZet
//  Repozytorium: https://github.com/GieOeRZet/matches-card
//  Opis:
//  Karta pokazująca mecze z sensora 90minut, z obsługą ligi, wyników,
//  gradientu, zebry, ikon W/P/R, konfigurowalnych czcionek i opcji w GUI.
// ============================================================================

class MatchesCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "sensor.matches_today",
      name: "90minut - Mecze dziś",
      fill: "system",
      show_symbols: true,
      show_logos: true,
      full_team_names: true,
      gradient_start: 35,
      gradient_alpha: 0.5,
      font_size_date: 0.9,
      font_size_status: 0.8,
      font_size_teams: 1.0,
      font_size_score: 1.0,
      icon_size_league: 26,
      icon_size_crest: 24,
      icon_size_result: 26,
    };
  }

  setConfig(config) {
    if (!config.entity)
      throw new Error("Musisz wybrać encję sensora z danymi meczów!");

    this._config = config;
    this._entity = config.entity;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._entity) this.render();
  }

  render() {
    if (!this._hass) return;
    const entity = this._hass.states[this._entity];
    if (!entity) return;

    const matches = entity.attributes.matches || [];
    const c = this._config;

    if (!this.shadowRoot) this.attachShadow({ mode: "open" });

    const zebra = c.fill === "zebra";
    const gradient = c.fill === "gradient";
    const system = c.fill === "system" || !c.fill;

    const style = `
      <style>
        :host {
          display: block;
          font-family: var(--ha-card-font-family, 'Roboto');
          --color-bg: var(--card-background-color);
          --color-fg: var(--primary-text-color);
        }

        ha-card {
          padding: 0.6em 0.8em;
          background: var(--color-bg);
          color: var(--color-fg);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }

        tr {
          transition: background 0.2s ease;
        }

        ${
          zebra
            ? `tr:nth-child(even) { background: rgba(255,255,255,0.04); }`
            : ""
        }

        ${
          gradient
            ? `tr::after {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: linear-gradient(
                to right,
                rgba(255,255,255,0) ${c.gradient_start || 35}%,
                rgba(255,255,255,${c.gradient_alpha || 0.5}) 100%
              );
            }`
            : ""
        }

        tr:hover {
          background: rgba(255,255,255,0.07);
        }

        td {
          padding: 0.5em 0.3em;
          text-align: center;
          vertical-align: middle;
          position: relative;
        }

        .team-name {
          text-align: left;
          font-weight: 500;
          font-size: ${c.font_size_teams || 1.0}em;
        }

        .score {
          font-weight: bold;
          font-size: ${c.font_size_score || 1.0}em;
        }

        .date {
          font-size: ${c.font_size_date || 0.9}em;
          text-align: center;
        }

        .status {
          font-size: ${c.font_size_status || 0.8}em;
        }

        .crest {
          height: ${c.icon_size_crest || 24}px;
          width: auto;
          border-radius: 4px;
          background: white;
          padding: 2px;
        }

        .league {
          height: ${c.icon_size_league || 26}px;
          width: auto;
          display: block;
          margin: auto;
        }

        .result-symbol {
          font-weight: bold;
          color: var(--primary-color);
          font-size: ${c.icon_size_result || 26}px;
        }

        tr + tr td {
          border-top: 1px solid rgba(255,255,255,0.08);
        }
      </style>
    `;

    const rows = matches
      .map((m) => {
        const date = this._formatDate(m.date);
        const status = m.finished
          ? "KONIEC"
          : (m.time || "").replace(":", ".");
        const teamHome = c.full_team_names
          ? m.home
          : m.home.split(" ")[0];
        const teamAway = c.full_team_names
          ? m.away
          : m.away.split(" ")[0];

        const winner =
          m.score_home > m.score_away
            ? "home"
            : m.score_home < m.score_away
            ? "away"
            : "draw";

        const score = m.finished
          ? `${m.score_home} : ${m.score_away}`
          : "";

        const leagueIcon =
          m.league === "L"
            ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png"
            : m.league === "PP"
            ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png"
            : "";

        return `
          <tr>
            <td class="date">
              <div>${date}</div>
              <div class="status">${status}</div>
            </td>
            <td>
              ${
                leagueIcon
                  ? `<img class="league" src="${leagueIcon}" alt="league">`
                  : `<div>${m.league || "-"}</div>`
              }
            </td>
            <td>
              ${
                c.show_logos
                  ? `<img class="crest" src="${m.home_logo}" alt="${teamHome}">`
                  : ""
              }
              <div class="team-name" style="opacity:${
                winner === "away" ? 0.8 : 1
              };font-weight:${winner === "home" ? "bold" : "normal"};">
                ${teamHome}
              </div>
              <div class="team-name" style="opacity:${
                winner === "home" ? 0.8 : 1
              };font-weight:${winner === "away" ? "bold" : "normal"};">
                ${teamAway}
              </div>
            </td>
            <td class="score">${score}</td>
            <td>
              ${
                c.show_symbols && m.result_symbol
                  ? `<div class="result-symbol">${m.result_symbol}</div>`
                  : ""
              }
            </td>
          </tr>
        `;
      })
      .join("");

    const card = `
      ${style}
      <ha-card>
        ${
          c.name
            ? `<h2 style="margin:0.2em 0 0.6em 0;">${c.name}</h2>`
            : ""
        }
        <table>${rows}</table>
      </ha-card>
    `;

    this.shadowRoot.innerHTML = card;
  }

  _formatDate(d) {
    if (!d) return "";
    try {
      const dt = new Date(d);
      return `${dt.getDate().toString().padStart(2, "0")}-${(dt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${dt.getFullYear().toString().slice(2)}`;
    } catch {
      return d;
    }
  }
}

customElements.define("matches-card", MatchesCard);