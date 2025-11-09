// ============================================================================
//  Matches Card (90minut) – v0.3.505
//  Author: GieOeRZet
//  Description:
//    - Fill modes: gradient / zebra / clear
//    - Light mode: fully transparent (no ha-card)
//    - Perfect vertical alignment for score column (matches team layout)
//    - Monospace font for equal-width digits
//    - Stable layout (0% column hides it), square crests, compact spacing
// ============================================================================

class MatchesCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "sensor.90minut_gornik_zabrze_matches",
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient",        // gradient | zebra | clear
      theme_mode: "auto",           // auto | light | dark
      light_mode: false,            // true => transparent, no ha-card
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      zebra_color: "",
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
    };
  }

  setConfig(config) {
    this.config = { ...MatchesCard.getStubConfig(), ...config };
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;

    const matches = stateObj.attributes.matches || [];

    const darkMode =
      this.config.theme_mode === "dark" ||
      (this.config.theme_mode === "auto" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const rowSep = darkMode ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)";
    const zebraBg =
      this.config.zebra_color && this.config.zebra_color.trim() !== ""
        ? this.config.zebra_color
        : darkMode
        ? "rgba(255,255,255,0.06)"
        : "rgba(240,240,240,0.4)";

    const zebraCSS =
      this.config.fill_mode === "zebra"
        ? `tr:nth-child(even){background-color:${zebraBg};}`
        : "";

    const style = `
      <style>
        table { width: 100%; border-collapse: collapse; }
        td {
          text-align: center;
          vertical-align: middle;
          padding: 2px 4px;
        }
        tr { border-bottom: 1px solid ${rowSep}; }

        /* --- Dual cells (crest/score) --- */
        .dual-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding-top: 2px;
          padding-bottom: 2px;
        }

        /* --- Score alignment --- */
        .dual-cell.score {
          align-items: flex-start;
          justify-content: center;
        }
        .dual-cell.score div {
          font-family: monospace;
          text-align: left;
          width: 2ch;
        }

        /* --- Teams layout --- */
        .team-cell {
          text-align: left;
          vertical-align: middle;
          padding-left: 6px;
        }
        .team-row {
          display: flex;
          align-items: center;
          line-height: 1.2em;
        }

        /* --- Misc --- */
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

        img.crest {
          width: ${this.config.icon_size.crest}px;
          height: ${this.config.icon_size.crest}px;
          object-fit: contain;
          aspect-ratio: 1 / 1;
          background: white;
          border-radius: 4px;
          padding: 2px;
        }

        ${zebraCSS}

        ha-card.matches-card {
          padding: 12px 6px;
          background: var(--card-background-color);
          font-family: "Sofascore Sans", Arial, sans-serif;
        }
        .matches-table {
          width: 100%;
        }
      </style>
    `;

    const rows = matches.map((match) => {
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
        ? dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
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
        ? match.home || ""
        : (match.home || "").split(" ")[0] || "";
      const awayTeam = this.config.full_team_names
        ? match.away || ""
        : (match.away || "").split(" ")[0] || "";

      const colorHex =
        this.config.colors && match.result
          ? this.config.colors[match.result]
          : "#000000";

      const rgbaColor = this.hexToRgba(colorHex, this.config.gradient.alpha);

      const gradientCSS =
        this.config.fill_mode === "gradient" && match.result
          ? `background: linear-gradient(to right, rgba(0,0,0,0) ${this.config.gradient.start}%, ${rgbaColor} ${this.config.gradient.end}%);`
          : "";

      const col = this.config.columns_pct;
      const visible = Object.values(col).filter((v) => v > 0);
      const totalUsed = visible.reduce((a, b) => a + b, 0);
      const teamWidth = Math.max(0, 100 - totalUsed);

      return `
        <tr class="${resultClass}" style="${gradientCSS}">
          ${col.date > 0 ? `
            <td style="width:${col.date}%;">
              <div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
              <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div>
            </td>` : ""}
          ${col.league > 0 ? `
            <td style="width:${col.league}%;">
              ${leagueIcon
                ? `<img src="${leagueIcon}" height="${this.config.icon_size.league}" style="display:block;margin:auto;" />`
                : `<div style="font-size:0.9em;opacity:0.8;">${match.league ?? ""}</div>`}
            </td>` : ""}
          ${this.config.show_logos && col.crest > 0 ? `
            <td class="dual-cell" style="width:${col.crest}%;">
              <div><img class="crest" src="${match.logo_home || ""}" /></div>
              <div><img class="crest" src="${match.logo_away || ""}" /></div>
            </td>` : ""}
          <td class="team-cell" style="width:${teamWidth}%;">
            <div class="team-row ${homeBold}" style="font-size:${this.config.font_size.teams}em;">${homeTeam}</div>
            <div class="team-row ${awayBold}" style="font-size:${this.config.font_size.teams}em;">${awayTeam}</div>
          </td>
          ${col.score > 0 ? `
            <td class="dual-cell score" style="width:${col.score}%;">
              <div class="${homeBold}" style="font-size:${this.config.font_size.score}em;">${homeScore ?? ""}</div>
              <div class="${awayBold}" style="font-size:${this.config.font_size.score}em;">${awayScore ?? ""}</div>
            </td>` : ""}
          ${col.result > 0 ? `
            <td class="result-cell" style="width:${col.result}%;">
              ${this.config.show_result_symbols && match.result
                ? `<div class="result-circle" style="background-color:${colorHex}">${match.result.charAt(0).toUpperCase()}</div>`
                : ""}
            </td>` : ""}
        </tr>
      `;
    }).join("");

    const cardName =
      this.config.show_name === false
        ? ""
        : this.config.name ||
          stateObj.attributes.friendly_name ||
          "90minut Matches";

    // Render
    if (this.config.light_mode) {
      this.innerHTML = `${style}<table class="matches-table">${rows}</table>`;
    } else {
      this.innerHTML = `
        ${style}
        <ha-card class="matches-card" ${cardName ? `header="${cardName}"` : ""}>
          <table class="matches-table">${rows}</table>
        </ha-card>
      `;
    }
  }

  hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    let c = hex.replace("#", "").trim();
    if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
    const bigint = parseInt(c, 16);
    if (isNaN(bigint)) return `rgba(0,0,0,${alpha})`;
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  getCardSize() { return 6; }
}

customElements.define("matches-card", MatchesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  description: "Match display card with gradient/zebra/clear fill modes, transparent light mode, and aligned scores.",
  version: "0.3.505",
});
