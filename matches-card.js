// ============================================================================
//  Matches Card – v0.3.009
//  Karta wyników 90minut.pl z gradientem i automatycznym GUI
// ============================================================================

console.info("%c[MatchesCard] v0.3.009 loaded ✅", "color: #0e9f6e; font-weight: bold;");

if (!customElements.get("matches-card")) {
  class MatchesCard extends HTMLElement {
    setConfig(config) {
      if (!config.entity) throw new Error("Entity is required");
      this.config = {
        name: "90minut Matches",
        show_name: true,
        show_logos: true,
        fill: "gradient", // gradient | zebra | none
        show_result_symbol: true,
        font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
        icon_size: { league: 26, crest: 24, result: 26 },
        gradient: { alpha: 0.5, start: 35, end: 100 },
        colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
        ...config,
      };
    }

    set hass(hass) {
      this._hass = hass;
      const entity = this.config.entity;
      const stateObj = hass.states[entity];
      if (!stateObj) return;

      const matches = stateObj.attributes.matches || [];

      const zebraCSS =
        this.config.fill === "zebra"
          ? `tr:nth-child(even){background-color:rgba(240,240,240,0.4);}`
          : "";
      const separatorCSS = `tr{border-bottom:1px solid rgba(0,0,0,0.1);}`;

      const style = `
        <style>
          ha-card { padding:10px 0;font-family:"Sofascore Sans",Arial,sans-serif; }
          table { width:100%;border-collapse:collapse; }
          td { text-align:center;vertical-align:middle;padding:4px 6px; }
          .team-cell{ text-align:left;vertical-align:middle;padding-left:8px;}
          .team-row{ display:flex;align-items:center;line-height:1.3em;}
          .bold{font-weight:600;} .dim{opacity:0.8;}
          .result-circle{border-radius:50%;width:${this.config.icon_size.result}px;
            height:${this.config.icon_size.result}px;color:white;
            display:flex;align-items:center;justify-content:center;font-weight:bold;
            margin:0 auto;}
          ${zebraCSS}${separatorCSS}
        </style>`;

      const rows = matches
        .map((m) => {
          const date = m.date ? new Date(m.date.replace(" ", "T")) : null;
          const dateStr = date
            ? date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" })
            : "-";
          const timeStr = m.finished
            ? "KONIEC"
            : date
            ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
            : "";

          const resultClass =
            m.result === "win"
              ? "row-win"
              : m.result === "loss"
              ? "row-loss"
              : m.result === "draw"
              ? "row-draw"
              : "";

          const homeBold =
            m.result === "win" ? "bold" : m.result === "loss" ? "dim" : "";
          const awayBold =
            m.result === "loss" ? "bold" : m.result === "win" ? "dim" : "";

          const [homeScore, awayScore] = (m.score || "-").split("-");

          const leagueIcon =
            m.league === "L"
              ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png"
              : m.league === "PP"
              ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png"
              : null;

          const colorRGB = this.config.colors[m.result]
            ? this.hexToRgba(this.config.colors[m.result], this.config.gradient.alpha)
            : "rgba(0,0,0,0)";

          const fillStyle =
            this.config.fill === "gradient"
              ? `background: linear-gradient(to right, rgba(0,0,0,0) ${this.config.gradient.start}%, ${colorRGB} ${this.config.gradient.end}%);`
              : "";

          return `
            <tr class="${resultClass}" style="${fillStyle}">
              <td><div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
                  <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div></td>
              <td>
                ${
                  leagueIcon
                    ? `<img src="${leagueIcon}" height="${this.config.icon_size.league}" style="display:block;margin:auto;"/>`
                    : m.league || "-"
                }
              </td>
              ${
                this.config.show_logos
                  ? `<td><img src="${m.logo_home}" height="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;"/><br>
                       <img src="${m.logo_away}" height="${this.config.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;"/></td>`
                  : ""
              }
              <td class="team-cell">
                <div class="team-row ${homeBold}" style="font-size:${this.config.font_size.teams}em;">${m.home}</div>
                <div class="team-row ${awayBold}" style="font-size:${this.config.font_size.teams}em;">${m.away}</div>
              </td>
              <td><div class="${homeBold}">${homeScore}</div><div class="${awayBold}">${awayScore}</div></td>
              <td>
                ${
                  this.config.show_result_symbol && m.result
                    ? `<div class="result-circle" style="background-color:${this.config.colors[m.result]}">${m.result.charAt(0).toUpperCase()}</div>`
                    : ""
                }
              </td>
            </tr>`;
        })
        .join("");

      const title =
        this.config.show_name && this.config.name
          ? `header="${this.config.name}"`
          : "";

      this.innerHTML = `${style}<ha-card ${title}><table>${rows}</table></ha-card>`;
    }

    hexToRgba(hex, alpha = 1) {
      if (!hex || typeof hex !== "string") return `rgba(0,0,0,${alpha})`;
      const sanitized = hex.replace("#", "");
      const bigint = parseInt(sanitized, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${alpha})`;
    }

    static getConfigElement() {
      import("/hacsfiles/matches-card/matches-card-editor.js")
        .then(() => console.log("[MatchesCard] Editor loaded dynamically"))
        .catch((e) => console.warn("[MatchesCard] Editor import failed", e));
      return document.createElement("matches-card-editor");
    }
  }

  customElements.define("matches-card", MatchesCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "matches-card",
    name: "Matches Card (90minut)",
    preview: true,
    description: "Karta meczów 90minut.pl z gradientem i edytorem GUI",
  });
}
