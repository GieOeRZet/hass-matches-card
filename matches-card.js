// ============================================================================
//  Matches Card (90minut) – v0.3.000 – SmartAccordion (restore baseline)
//  Autor: GieOeRZet
//  UWAGA: Ta wersja jest punktem przywracania i nie może być modyfikowana
// ============================================================================

class MatchesCard extends HTMLElement {

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity is required (sensor.90minut_xxx)");
    }

    this.config = {
      name: config.name || "90minut Matches",
      show_name: config.show_name ?? true,
      full_team_names: config.full_team_names ?? true,
      show_logos: config.show_logos ?? true,
      show_result_symbols: config.show_result_symbols ?? true,
      fill_mode: config.fill_mode || "gradient",  // gradient | zebra | clear

      font_size: {
        date: config.font_size?.date || 0.9,
        status: config.font_size?.status || 0.8,
        teams: config.font_size?.teams || 1.0,
        score: config.font_size?.score || 1.0,
      },

      icon_size: {
        league: config.icon_size?.league || 26,
        crest: config.icon_size?.crest || 24,
        result: config.icon_size?.result || 26,
      },

      gradient: {
        alpha: config.gradient?.alpha || 0.55,
        start: config.gradient?.start || 35,
        end: config.gradient?.end || 100,
      },

      colors: {
        win: config.colors?.win || "#3ba55d",
        draw: config.colors?.draw || "#468cd2",
        loss: config.colors?.loss || "#e23b3b",
      },

      columns_pct: {
        date: 10,
        league: 10,
        crest: 10,
        score: 10,
        result: 8,
      },

      ...config
    };
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;

    const matches = stateObj.attributes.matches || [];

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
        td { text-align:center; vertical-align:middle; padding:4px 6px; }
        tr { border-bottom:1px solid rgba(0,0,0,0.1); }
        .dual-cell{display:flex;flex-direction:column;justify-content:center;align-items:center;}
        .team-cell{text-align:left;padding-left:8px;}
        .team-row{display:flex;align-items:center;justify-content:flex-start;line-height:1.3em;}
        .bold{font-weight:600;}
        .dim{opacity:0.8;}
        .result-circle{
          border-radius:50%;
          width:${this.config.icon_size.result}px;
          height:${this.config.icon_size.result}px;
          color:white;display:flex;justify-content:center;align-items:center;
          font-weight:bold;margin:0 auto;
        }
        ${zebraCSS}
      </style>
    `;

    const rows = matches.map((match) => {
      const rawDate = match.date ? match.date.replace(" ", "T") : null;
      const dateObj = rawDate ? new Date(rawDate) : null;

      const dateStr = dateObj
        ? dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "-";

      const timeStr =
        match.finished
          ? "KONIEC"
          : dateObj
            ? dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
            : "";

      const resultClass =
        match.result === "win" ? "row-win" :
        match.result === "loss" ? "row-loss" :
        match.result === "draw" ? "row-draw" : "";

      const homeBold = match.result === "win" ? "bold" :
                       match.result === "loss" ? "dim" : "";

      const awayBold = match.result === "loss" ? "bold" :
                       match.result === "win" ? "dim" : "";

      const [homeScore, awayScore] = (match.score || "-").split("-");

      const homeTeam = this.config.full_team_names ? match.home : match.home.split(" ")[0];
      const awayTeam = this.config.full_team_names ? match.away : match.away.split(" ")[0];

      const gradientCSS =
        this.config.fill_mode === "gradient" && match.result
          ? `background: linear-gradient(to right,
                rgba(0,0,0,0) ${this.config.gradient.start}%,
                ${this.config.colors[match.result]}${Math.round(this.config.gradient.alpha * 255)
                .toString(16)} 100%);`
          : "";

      return `
        <tr class="${resultClass}" style="${gradientCSS}">
          <td style="width:${this.config.columns_pct.date}%;">
            <div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
            <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div>
          </td>

          <td style="width:${this.config.columns_pct.league}%;">
            <div style="font-size:0.9em;opacity:0.8;">${match.league}</div>
          </td>

          ${this.config.show_logos ? `
          <td class="dual-cell" style="width:${this.config.columns_pct.crest}%;">
            <img src="${match.logo_home}" height="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;" />
            <img src="${match.logo_away}" height="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;" />
          </td>` : ""}

          <td class="team-cell">
            <div class="team-row ${homeBold}" style="font-size:${this.config.font_size.teams}em;">${homeTeam}</div>
            <div class="team-row ${awayBold}" style="font-size:${this.config.font_size.teams}em;">${awayTeam}</div>
          </td>

          <td class="dual-cell" style="width:${this.config.columns_pct.score}%;">
            <div class="${homeBold}" style="font-size:${this.config.font_size.score}em;">${homeScore}</div>
            <div class="${awayBold}" style="font-size:${this.config.font_size.score}em;">${awayScore}</div>
          </td>

          <td style="width:${this.config.columns_pct.result}%;">
            ${
              this.config.show_result_symbols && match.result
                ? `<div class="result-circle" style="background-color:${this.config.colors[match.result]}">${match.result.charAt(0).toUpperCase()}</div>`
                : ""
            }
          </td>
        </tr>
      `;
    }).join("");

    const cardName =
      this.config.show_name === false
        ? ""
        : this.config.name || stateObj.attributes.friendly_name || "90minut Matches";

    this.innerHTML = `
      ${style}
      <ha-card ${cardName ? `header="${cardName}"` : ""}>
        <table>${rows}</table>
      </ha-card>
    `;
  }

  getCardSize() { return 6; }
}

customElements.define("matches-card", MatchesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  description: "Karta pokazująca mecze (wersja restore-point 0.3.000)"
});