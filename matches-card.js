// ============================================================================
//  Matches Card (90minut) – v0.3.001-MOD-FINAL
//  - wyrównane wyniki (team + score w jednej linii)
//  - poprawione logo lig (GitHub fallback → tekst)
//  - mix padding (teamscore 2x6, reszta 2x3)
//  - embed_mode (bez ha-card / bez tła)
//  Autor: GieOeRZet
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
      fill_mode: "gradient",
      embed_mode: config.embed_mode ?? false,

      font_size: {
        date: 0.9,
        status: 0.8,
        teams: 1.0,
        score: 1.0
      },

      icon_size: {
        league: 26,
        crest: 24,
        result: 26
      },

      gradient: { alpha: 0.5, start: 35, end: 100 },

      columns_pct: {
        date: 10,
        league: 10,
        crest: 10,
        score: 10,
        result: 8
      },

      colors: {
        win: "#3ba55d",
        loss: "#e23b3b",
        draw: "#468cd2"
      },

      ...config
    };
  }

  set hass(hass) {
    this._hass = hass;

    const stateObj = hass.states[this.config.entity];
    if (!stateObj) return;

    const matches = stateObj.attributes.matches || [];

    // zebra CSS
    const zebraCSS =
      this.config.fill_mode === "zebra"
        ? `tr:nth-child(even) { background-color: rgba(240,240,240,0.4); }`
        : "";

    // -------------------------------
    // STYLE
    // -------------------------------
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
          padding: 2px 3px; /* global padding */
        }

        tr { border-bottom: 1px solid rgba(0,0,0,0.1); }

        /* mix padding for Teamscore cell */
        .teamscore-cell { padding: 2px 6px !important; }

        .teamscore-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 1.3em;
        }

        .teamscore-team { text-align: left; }
        .teamscore-score {
          text-align: right;
          min-width: 18px;
          font-weight: bold;
        }

        .result-circle {
          border-radius: 50%;
          width: ${this.config.icon_size.result}px;
          height: ${this.config.icon_size.result}px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
          margin: auto;
        }

        /* embed mode */
        .embed-wrapper {
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        ${zebraCSS}
      </style>
    `;

    // -------------------------------
    // ROWS
    // -------------------------------
    const rows = matches
      .map((match) => {
        // data i czas
        const rawDate = match.date ? match.date.replace(" ", "T") : null;
        const dateObj = rawDate ? new Date(rawDate) : null;

        const dateStr = dateObj
          ? dateObj.toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })
          : "-";

        const timeStr = match.finished
          ? "KONIEC"
          : dateObj
          ? dateObj.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit"
            })
          : "";

        // wynik
        const [homeScore, awayScore] = (match.score || "-").split("-");

        // bold logic
        const homeBold = match.result === "win" ? "bold" : match.result === "loss" ? "dim" : "";
        const awayBold = match.result === "loss" ? "bold" : match.result === "win" ? "dim" : "";

        // ikona ligi
        let leagueIcon = null;

        if (match.league) {
          const file =
            match.league === "L" ? "ekstraklasa.png"
            : match.league === "PP" ? "puchar.png"
            : null;

          if (file) {
            leagueIcon = `https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/${file}`;
          }
        }

        // nazwy
        const homeTeam = this.config.full_team_names ? match.home : match.home.split(" ")[0];
        const awayTeam = this.config.full_team_names ? match.away : match.away.split(" ")[0];

        // gradient
        const gradientCSS =
          this.config.fill_mode === "gradient" && match.result
            ? `background: linear-gradient(to right,
                rgba(0,0,0,0) ${this.config.gradient.start}%,
                ${this.config.colors[match.result]}${Math.round(
                this.config.gradient.alpha * 255
              ).toString(16)} 100%);`
            : "";

        // -----------------------
        // Wiersz
        // -----------------------
        return `
          <tr style="${gradientCSS}">

            <!-- data + godzina -->
            <td style="width:${this.config.columns_pct.date}%;">
              <div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
              <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div>
            </td>

            <!-- liga -->
            <td style="width:${this.config.columns_pct.league}%;">
              ${
                leagueIcon
                  ? `<img src="${leagueIcon}" height="${this.config.icon_size.league}" style="display:block;margin:auto;">`
                  : `<div style="font-size:0.9em;opacity:0.8;">${match.league}</div>`
              }
            </td>

            <!-- herby -->
            ${
              this.config.show_logos
                ? `<td style="width:${this.config.columns_pct.crest}%;">
                     <div>
                       <img src="${match.logo_home}" 
                            height="${this.config.icon_size.crest}" 
                            style="background:white;border-radius:6px;padding:2px;">
                     </div>
                     <div>
                       <img src="${match.logo_away}" 
                            height="${this.config.icon_size.crest}" 
                            style="background:white;border-radius:6px;padding:2px;">
                     </div>
                   </td>`
                : ""
            }

            <!-- drużyny + wyniki (wyrównane) -->
            <td class="teamscore-cell">
              <div class="teamscore-row">
                <span clas
