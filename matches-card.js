// ============================================================================
//  Matches Card – v0.2.007
//  Autor: GieOeRZet
//  Repozytorium: https://github.com/GieOeRZet/matches-card
//
//  Opis:
//  Karta Lovelace do Home Assistant pokazująca mecze z sensora 90minut.pl.
//  Layout identyczny jak poprzednio – przywrócony gradient i separator na stałe.
//  Tryby:
//   - view_mode: "gradient" → tło gradientowe W/P/R (bez zebry)
//   - view_mode: "symbol"   → kółka W/P/R (z zebrą)
// ============================================================================

class MatchesCard extends HTMLElement {
  // ========================================================================
  // KONFIGURACJA DOMYŚLNA
  // ========================================================================
  setConfig(config) {
    if (!config.entity)
      throw new Error("Entity is required (np. sensor.90minut_gornik_zabrze_matches)");

    this.config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      view_mode: "gradient", // "gradient" | "symbol"

      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },

      gradient: { alpha: 0.5, start: 35, end: 100 },

      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },

      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },

      table: { zebra: true, system_colors: true },

      ...config,
    };
  }

  // ========================================================================
  // RENDEROWANIE KARTY
  // ========================================================================
  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;

    const matches = stateObj.attributes.matches || [];

    // -------------------------
    // STYLE BAZOWE
    // -------------------------
    const zebraEnabled = this.config.view_mode === "symbol" && this.config.table?.zebra;
    const zebraCSS = zebraEnabled
      ? `tr:nth-child(even){background-color:rgba(240,240,240,0.4);}`
      : "";
    const separatorCSS = `tr{border-bottom:1px solid rgba(0,0,0,0.1);}`;

    const style = `
      <style>
        ha-card {
          padding: 10px 0;
          font-family: "Sofascore Sans", Arial, sans-serif;
        }
        table { width: 100%; border-collapse: collapse; }
        td {
          text-align: center;
          vertical-align: middle;
          padding: 4px 6px;
        }
        .dual-cell {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .dual-cell > * {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .team-cell {
          text-align: left;
          vertical-align: middle;
          padding-left: 8px;
        }
        .team-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          line-height: 1.3em;
        }
        .bold { font-weight: 600; }
        .dim { opacity: 0.8; }
        .result-circle {
          border-radius: 50%;
          width: ${this.config.icon_size.result}px;
          height: ${this.config.icon_size.result}px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          margin: 0 auto;
        }
        ${zebraCSS}
        ${separatorCSS}
      </style>
    `;

    // ========================================================================
    // GENEROWANIE TABELI
    // ========================================================================
    const rows = matches
      .map((match) => {
        const rawDate = match.date ? match.date.replace(" ", "T") : null;
        const dateObj = rawDate ? new Date(rawDate) : null;
        const dateStr = dateObj
          ? dateObj.toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-";
        const timeStr = match.finished
          ? "KONIEC"
          : dateObj
          ? dateObj.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const resultClass =
          match.result === "win"
            ? "row-win"
            : match.result === "loss"
            ? "row-loss"
            : match.result === "draw"
            ? "row-draw"
            : "";

        const homeBold =
          match.result === "win" ? "bold" : match.result === "loss" ? "dim" : "";
        const awayBold =
          match.result === "loss" ? "bold" : match.result === "win" ? "dim" : "";

        const [homeScore, awayScore] = (match.score || "-").split("-");

        const leagueIcon =
          match.league === "L"
            ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png"
            : match.league === "PP"
            ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png"
            : null;

        const homeTeam = this.config.full_team_names
          ? match.home
          : match.home.split(" ")[0];
        const awayTeam = this.config.full_team_names
          ? match.away
          : match.away.split(" ")[0];

        // ✅ poprawiony gradient
        const gradientCSS =
          this.config.view_mode === "gradient" && match.result
            ? `background: linear-gradient(to right,
                rgba(0,0,0,0) ${this.config.gradient.start}%,
                ${this.hexToRgba(this.config.colors[match.result], this.config.gradient.alpha)} ${this.config.gradient.end}%);`
            : "";

        return `
          <tr class="${resultClass}" style="${gradientCSS}">
            <!-- Data -->
            <td style="width:${this.config.columns_pct.date}%;">
              <div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
              <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div>
            </td>

            <!-- Liga -->
            <td style="width:${this.config.columns_pct.league}%;">
              ${
                leagueIcon
                  ? `<img src="${leagueIcon}" height="${this.config.icon_size.league}" style="display:block;margin:auto;" />`
                  : `<div style="font-size:0.9em;opacity:0.8;">${match.league}</div>`
              }
            </td>

            <!-- Herby -->
            ${
              this.config.show_logos
                ? `
            <td class="dual-cell" style="width:${this.config.columns_pct.crest}%;">
              <div><img src="${match.logo_home}" height="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;" /></div>
              <div><img src="${match.logo_away}" height="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;" /></div>
            </td>`
                : ""
            }

            <!-- Drużyny -->
            <td class="team-cell">
              <div class="team-row ${homeBold}" style="font-size:${this.config.font_size.teams}em;">${homeTeam}</div>
              <div class="team-row ${awayBold}" style="font-size:${this.config.font_size.teams}em;">${awayTeam}</div>
            </td>

            <!-- Wynik -->
            <td class="dual-cell" style="width:${this.config.columns_pct.score}%;">
              <div class="${homeBold}" style="font-size:${this.config.font_size.score}em;">${homeScore}</div>
              <div class="${awayBold}" style="font-size:${this.config.font_size.score}em;">${awayScore}</div>
            </td>

            <!-- Symbol W/P/R -->
            <td class="result-cell" style="width:${this.config.columns_pct.result}%;">
              ${
                this.config.view_mode === "symbol" && match.result
                  ? `<div class="result-circle" style="background-color:${this.config.colors[match.result]}">${match.result.charAt(0).toUpperCase()}</div>`
                  : ""
              }
            </td>
          </tr>
        `;
      })
      .join("");

    const cardName =
      this.config.show_name === false
        ? ""
        : this.config.name ||
          stateObj.attributes.friendly_name ||
          "90minut Matches";

    this.innerHTML = `
      ${style}
      <ha-card ${cardName ? `header="${cardName}"` : ""}>
        <table>${rows}</table>
      </ha-card>
    `;
  }

  // ✅ funkcja konwertująca HEX → RGBA (naprawia gradient)
  hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  getCardSize() {
    return 6;
  }

  getConfigElement() {
    return null;
  }
}

// ============================================================================
// REJESTRACJA KARTY
// ============================================================================
customElements.define("matches-card", MatchesCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  description: "Karta pokazująca mecze z sensora 90minut.pl",
});