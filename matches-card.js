class MatchesCard extends HTMLElement {
  // 🧠 1️⃣ Kluczowy element dla HA GUI
  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  // 🧠 2️⃣ Domyślna konfiguracja przy dodawaniu z dashboardu
  static getStubConfig() {
    return {
      type: "custom:matches-card",
      entity: "sensor.90minut_gornik_zabrze_matches",
      name: "90minut Matches",
      show_logos: true,
      full_team_names: true,
      font_size: { date: 0.9, teams: 1, score: 1, status: 0.8, result_letter: 1 },
      icon_size: { league: 26, crest: 24, result: 26 },
      columns_pct: { date: 10, league: 8, crest: 10, teams: 45, score: 15, result: 12 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
    };
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  set hass(hass) {
    if (!this.config || !this.config.entity) return;
    const state = hass.states[this.config.entity];
    if (!state) return;

    const matches = state.attributes.matches || [];
    this.renderCard(matches);
  }

  renderCard(matches) {
    const c = this.config;
    this.innerHTML = `
      <ha-card header="${c.name || "Matches"}">
        <table style="width:100%; border-collapse:collapse;">
          ${matches
            .map((m, i) => {
              const bgColor = this.getResultColor(m.result);
              return `
                <tr style="
                  background: ${
                    i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.10)"
                  };
                  background: linear-gradient(
                    to right,
                    rgba(${this.hexToRgb(bgColor)}, 0.0) 0%,
                    rgba(${this.hexToRgb(bgColor)}, 0.5) 80%
                  );
                ">
                  <!-- 🕓 Data -->
                  <td style="width:${c.columns_pct.date}%; text-align:center; vertical-align:middle;">
                    <div style="font-size:${c.font_size.date}em;">
                      ${this.formatDate(m.date)}
                    </div>
                    <div style="font-size:${c.font_size.status}em;">
                      ${m.finished ? "Koniec" : this.formatTime(m.date)}
                    </div>
                  </td>

                  <!-- 🏆 Liga -->
                  <td style="width:${c.columns_pct.league}%; text-align:center; vertical-align:middle;">
                    <img src="${
                      m.league_icon || "https://img.sofascore.com/api/v1/unique-tournament/202/image"
                    }" height="${c.icon_size.league}" />
                  </td>

                  <!-- ⚽ Herby -->
                  <td style="width:${c.columns_pct.crest}%; text-align:center; vertical-align:middle;">
                    ${
                      c.show_logos
                        ? `
                        <img src="${m.logo_home || ""}" height="${c.icon_size.crest}" style="margin-bottom:4px;"/>
                        <br/>
                        <img src="${m.logo_away || ""}" height="${c.icon_size.crest}"/>
                        `
                        : ""
                    }
                  </td>

                  <!-- 🧾 Drużyny -->
                  <td style="width:${c.columns_pct.teams}%; text-align:left; vertical-align:middle;">
                    <div style="
                      font-size:${c.font_size.teams}em;
                      ${m.result === "win" ? "font-weight:bold" : "opacity:0.9"};
                    ">${m.home}</div>
                    <div style="
                      font-size:${c.font_size.teams}em;
                      ${m.result === "loss" ? "opacity:0.9" : "font-weight:bold"};
                    ">${m.away}</div>
                  </td>

                  <!-- 🔢 Wynik -->
                  <td style="width:${c.columns_pct.score}%; text-align:center; vertical-align:middle;">
                    <div style="font-size:${c.font_size.score}em;">${m.score_home || "-"}</div>
                    <div style="font-size:${c.font_size.score}em;">${m.score_away || "-"}</div>
                  </td>

                  <!-- 🔴 Symbol -->
                  <td style="width:${c.columns_pct.result}%; text-align:center; vertical-align:middle;">
                    <span style="font-size:${c.font_size.result_letter}em;">${this.resultLetter(
                      m.result
                    )}</span>
                  </td>
                </tr>`;
            })
            .join("")}
        </table>
      </ha-card>`;
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
    return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }

  formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
}

// 🧩 Rejestracja w HA
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  preview: true,
  description: "Custom match list card with gradient background and full GUI editor.",
});

customElements.define("matches-card", MatchesCard);