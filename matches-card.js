// ============================================================================
//  Matches Card (90minut) – v0.9.42-classic
//  Autor: GieOeRZet
//  Repozytorium: https://github.com/GieOeRZet/matches-card
//
//  Zmiany od 0.9.40:
//  - przywrócona klasyczna struktura (bez importów)
//  - poprawiony gradient (RGBA zamiast HEX+alpha)
//  - logotypy offline (z folderu /logo/ zamiast z URL)
//  - wyrównane białe tło i rozmiar logotypów klubów
//  - brak separatora pod ostatnim wierszem
// ============================================================================

class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity)
      throw new Error("Entity is required (np. sensor.90minut_gornik_zabrze_matches)");

    this.config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient", // gradient | zebra | none

      font_size: {
        date: 0.9,
        status: 0.8,
        teams: 1.0,
        score: 1.0,
      },

      icon_size: {
        league: 26,
        crest: 24,
        result: 26,
      },

      gradient: {
        alpha: 0.5,
        start: 35,
        end: 100,
      },

      columns_pct: {
        date: 10,
        league: 10,
        crest: 10,
        score: 10,
        result: 8,
      },

      colors: {
        win: "#3ba55d",
        loss: "#e23b3b",
        draw: "#468cd2",
      },

      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;
    const matches = stateObj.attributes.matches || [];

    // -------------------------
    // STYLE BASE
    // -------------------------
    const zebraCSS =
      this.config.fill_mode === "zebra"
        ? `tr:nth-child(even){background-color:rgba(240,240,240,0.4);}`
        : "";

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
        tr {
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        tr:last-child {
          border-bottom: none;
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
      </style>
    `;

    // -------------------------
    // TABELA RENDER
    // -------------------------
    const rows = matches
      .map((match) => {
        // Data
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

        // Wynik, drużyny, kolory
        const resultClass =
          match.result === "win"
            ? "row-win"
            : match.result === "loss"
            ? "row-loss"
            : match.result === "draw"
            ? "row-draw"
            : "";

        const homeBold =
          match.result === "win"
            ? "bold"
            : match.result === "loss"
            ? "dim"
            : "";
        const awayBold =
          match.result === "loss"
            ? "bold"
            : match.result === "win"
            ? "dim"
            : "";

        const [homeScore, awayScore] = (match.score || "-").split("-");

        // Liga (offline)
        const leagueFile =
          match.league === "L"
            ? "ekstraklasa.png"
            : match.league === "PP"
            ? "puchar.png"
            : match.league === "1L"
            ? "1liga.png"
            : null;
        const leagueIcon = leagueFile
          ? `/hacsfiles/matches-card/logo/${leagueFile}`
          : null;

        // Drużyny
        const homeTeam = this.config.full_team_names
          ? match.home
          : match.home.split(" ")[0];
        const awayTeam = this.config.full_team_names
          ? match.away
          : match.away.split(" ")[0];

        // Gradient logic (RGBA)
        let gradientCSS = "";
        if (this.config.fill_mode === "gradient" && match.result) {
          const rgb =
            this.config.colors[match.result]
              .replace("#", "")
              .match(/.{1,2}/g)
              .map((x) => parseInt(x, 16))
              .join(",");
          gradientCSS = `background: linear-gradient(to right,
            rgba(${rgb},0) ${this.config.gradient.start}%,
            rgba(${rgb},${this.config.gradient.alpha}) ${this.config.gradient.end}%);`;
        }

        return `
          <tr class="${resultClass}" style="${gradientCSS}">
            <td style="width:${this.config.columns_pct.date}%;">
              <div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
              <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div>
            </td>
            <td style="width:${this.config.columns_pct.league}%;">
              ${
                leagueIcon
                  ? `<img src="${leagueIcon}" height="${this.config.icon_size.league}" style="display:block;margin:auto;" />`
                  : `<div style="font-size:0.9em;opacity:0.8;">${match.league}</div>`
              }
            </td>
            ${
              this.config.show_logos
                ? `
              <td class="dual-cell" style="width:${this.config.columns_pct.crest}%;">
                <div><img src="${match.logo_home}" height="${this.config.icon_size.crest}" width="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;" /></div>
                <div><img src="${match.logo_away}" height="${this.config.icon_size.crest}" width="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;" /></div>
              </td>`
                : ""
            }
            <td class="team-cell">
              <div class="team-row ${homeBold}" style="font-size:${this.config.font_size.teams}em;">${homeTeam}</div>
              <div class="team-row ${awayBold}" style="font-size:${this.config.font_size.teams}em;">${awayTeam}</div>
            </td>
            <td class="dual-cell" style="width:${this.config.columns_pct.score}%;">
              <div class="${homeBold}" style="font-size:${this.config.font_size.score}em;">${homeScore}</div>
              <div class="${awayBold}" style="font-size:${this.config.font_size.score}em;">${awayScore}</div>
            </td>
            <td class="result-cell" style="width:${this.config.columns_pct.result}%;">
              ${
                this.config.show_result_symbols && match.result
                  ? `<div class="result-circle" style="background-color:${this.config.colors[match.result]}">${match.result
                      .charAt(0)
                      .toUpperCase()}</div>`
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

  getCardSize() {
    return 6;
  }
}

if (!customElements.get("matches-card")) {
  customElements.define("matches-card", MatchesCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === "matches-card")) {
  window.customCards.push({
    type: "matches-card",
    name: "Matches Card (90minut)",
    description: "Karta pokazująca mecze z sensora 90minut.pl"
  });
}
console.info(
  "%c[Matches Card]%c v0.9.42-classic załadowana poprawnie.",
  "color:#3ba55d;font-weight:bold",
  "color:inherit"
);