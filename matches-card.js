class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this.config = {
      name: "Matches Card",
      show_logos: true,
      full_team_names: true,
      team_align: "left",
      font_size: { date: 0.9, teams: 1, score: 1, status: 0.8, result_letter: 1 },
      icon_size: { league: 26, crest: 24, result: 26 },
      columns_pct: { date: 10, league: 8, crest: 10, teams: 45, score: 15, result: 12 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config,
    };
  }

  getCardSize() {
    return 4;
  }

  set hass(hass) {
    const state = hass.states[this.config.entity];
    if (!state) return;
    const data = state.attributes.matches || [];
    this.renderCard(data);
  }

  renderCard(matches) {
    this.innerHTML = `
      <ha-card header="${this.config.name || "Matches"}">
        <table style="width:100%; border-collapse:collapse;">
          ${matches
            .map(
              (m, i) => `
            <tr style="
              background: ${
                i % 2 === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)"
              };
              background: linear-gradient(
                to right,
                rgba(${this.hexToRgb(this.getResultColor(m.result))}, 0.0) 0%,
                rgba(${this.hexToRgb(this.getResultColor(m.result))}, 0.5) 80%
              );
            ">
              <td style="width:${this.config.columns_pct.date}%; text-align:center; vertical-align:middle;">
                <div style="font-size:${this.config.font_size.date}em;">${this.formatDate(
                m.date
              )}</div>
                <div style="font-size:${this.config.font_size.status}em;">${
                m.finished ? "Koniec" : this.formatTime(m.date)
              }</div>
              </td>
              <td style="width:${this.config.columns_pct.league}%; text-align:center;">
                <img src="${
                  m.league === "PP"
                    ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
                    : "https://img.sofascore.com/api/v1/unique-tournament/202/image"
                }" height="${this.config.icon_size.league}" />
              </td>
              <td style="width:${this.config.columns_pct.crest}%; text-align:center;">
                ${this.config.show_logos && m.logo_home
                  ? `<img src="${m.logo_home}" height="${this.config.icon_size.crest}" />`
                  : ""}
                <br>
                ${this.config.show_logos && m.logo_away
                  ? `<img src="${m.logo_away}" height="${this.config.icon_size.crest}" />`
                  : ""}
              </td>
              <td style="width:${this.config.columns_pct.teams}%; text-align:left; vertical-align:middle;">
                <div style="font-size:${this.config.font_size.teams}em; ${
                m.result === "win" ? "font-weight:bold" : "opacity:0.9"
              }">${m.home}</div>
                <div style="font-size:${this.config.font_size.teams}em; ${
                m.result === "loss" ? "opacity:0.9" : "font-weight:bold"
              }">${m.away}</div>
              </td>
              <td style="width:${this.config.columns_pct.score}%; text-align:center;">
                <div style="font-size:${this.config.font_size.score}em;">${
                m.score.split("-")[0] || "-"
              }</div>
                <div style="font-size:${this.config.font_size.score}em;">${
                m.score.split("-")[1] || "-"
              }</div>
              </td>
              <td style="width:${this.config.columns_pct.result}%; text-align:center; font-size:${
                this.config.font_size.result_letter
              }em;">
                ${this.resultLetter(m.result)}
              </td>
            </tr>
          `
            )
            .join("")}
        </table>
      </ha-card>
    `;
  }

  getResultColor(result) {
    const c = this.config.colors;
    if (result === "win") return c.win;
    if (result === "loss") return c.loss;
    return c.draw;
  }

  resultLetter(result) {
    if (result === "win") return "W";
    if (result === "loss") return "P";
    if (result === "draw") return "R";
    return "";
  }

  hexToRgb(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `${r},${g},${b}`;
  }

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
}

customElements.define("matches-card", MatchesCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Custom match list card with gradient and zebra layout",
});