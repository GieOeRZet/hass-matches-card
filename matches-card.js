/* Matches Card – v0.3.012
 * Obsługa nowego formatu fill.type (gradient / zebra / none)
 * Kompatybilne z edytorem GUI (0.3.011)
 * Autor: GieOeRZet
 */

class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;
    const matches = stateObj.attributes.matches || [];

    // ✅ obsługa nowego formatu fill: { type: "gradient", ... }
    const fillType =
      typeof this.config.fill === "string"
        ? this.config.fill
        : this.config.fill?.type || "none";

    const zebraConf = this.config.fill?.zebra || {};
    const gradientConf = this.config.fill?.gradient || {};
    const styleConf = this.config.style || {};
    const colors = this.config.colors || {
      win: "#3ba55d",
      loss: "#e23b3b",
      draw: "#468cd2",
    };

    const zebraCSS =
      fillType === "zebra"
        ? `tr:nth-child(even){
             background: repeating-linear-gradient(${zebraConf.angle || 135}deg,
               rgba(0,0,0,${zebraConf.stripe_opacity ?? 0.06}),
               rgba(0,0,0,${zebraConf.stripe_opacity ?? 0.06}) ${zebraConf.stripe_width ?? 18}px,
               transparent ${zebraConf.stripe_width ?? 18}px,
               transparent ${(zebraConf.stripe_width ?? 18) + (zebraConf.stripe_gap ?? 18)}px);
           }`
        : "";

    const separatorCSS = `tr{border-bottom:1px solid rgba(0,0,0,0.1);}`;

    const gradientStart = gradientConf.start_color ?? "#1e3a8a";
    const gradientEnd = gradientConf.end_color ?? "#9333ea";
    const gradientAlpha = gradientConf.start_opacity ?? 0.4;
    const gradientAngle = gradientConf.angle ?? 135;

    const fillStyle =
      fillType === "gradient"
        ? `background:linear-gradient(${gradientAngle}deg, ${gradientStart}${Math.round(
            gradientAlpha * 255
          )
            .toString(16)
            .padStart(2, "0")}, ${gradientEnd}${Math.round(
            gradientAlpha * 255
          )
            .toString(16)
            .padStart(2, "0")});`
        : "";

    const style = `
      <style>
        ha-card {
          padding:${styleConf.padding ?? 10}px;
          border-radius:${styleConf.radius ?? 12}px;
          font-family:"Inter","Segoe UI",Roboto,sans-serif;
        }
        table { width:100%; border-collapse:collapse; }
        td { text-align:center; vertical-align:middle; padding:4px 6px; }
        .team-cell{ text-align:left; padding-left:8px; }
        .team-row{ display:flex; align-items:center; line-height:1.3em; }
        .bold{font-weight:600;} .dim{opacity:0.8;}
        .result-circle{
          border-radius:50%;
          width:26px; height:26px; color:white;
          display:flex; align-items:center; justify-content:center;
          font-weight:bold; margin:0 auto;
        }
        ${zebraCSS} ${separatorCSS}
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

        return `
          <tr class="${resultClass}" style="${fillStyle}">
            <td><div>${dateStr}</div><div>${timeStr}</div></td>
            <td>
              ${leagueIcon
                ? `<img src="${leagueIcon}" height="22" style="display:block;margin:auto;"/>`
                : m.league || "-"}
            </td>
            <td>
              <img src="${m.logo_home}" height="24" style="background:white;border-radius:4px;padding:2px;"/><br>
              <img src="${m.logo_away}" height="24" style="background:white;border-radius:4px;padding:2px;"/>
            </td>
            <td class="team-cell">
              <div class="team-row ${homeBold}">${m.home}</div>
              <div class="team-row ${awayBold}">${m.away}</div>
            </td>
            <td><div class="${homeBold}">${homeScore}</div><div class="${awayBold}">${awayScore}</div></td>
            <td>
              ${
                m.result
                  ? `<div class="result-circle" style="background-color:${colors[m.result]}">
                      ${m.result.charAt(0).toUpperCase()}
                     </div>`
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

  static getConfigElement() {
    try {
      return document.createElement("matches-card-editor");
    } catch (e) {
      console.warn("[MatchesCard] editor not yet loaded:", e);
      return null;
    }
  }
}

if (!customElements.get("matches-card")) {
  customElements.define("matches-card", MatchesCard);
  console.info("[MatchesCard] v0.3.012 loaded ✅");
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  preview: true,
  description: "Karta meczów 90minut.pl z edytorem GUI i gradientem",
});