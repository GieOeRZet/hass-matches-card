// ============================================================================
//  Matches Card (90minut) – v0.3.001 Stable
//  Autor: GieOeRZet
//  Repozytorium: https://github.com/GieOeRZet/matches-card
//  Bazuje na v0.3.000 Finał Stable
//  Zmiany:
//   - gradient RGBA (poprawne alpha)
//   - lekko poprawione marginesy i wysokości logo
//   - pełny edytor konfiguracji
// ============================================================================

class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity)
      throw new Error("Wymagana encja, np. sensor.90minut_gornik_zabrze_matches");

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

      colors: {
        win: "#3ba55d",
        loss: "#e23b3b",
        draw: "#468cd2",
      },

      columns_pct: {
        date: 10,
        league: 10,
        crest: 10,
        score: 10,
        result: 8,
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

    const zebraCSS =
      this.config.fill_mode === "zebra"
        ? `tr:nth-child(even){background-color:rgba(240,240,240,0.4);}`
        : "";

    const style = `
      <style>
        ha-card {
          padding: 8px;
          font-family: Arial, sans-serif;
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
        tr:last-child { border-bottom: none; }
        .dual { display:flex; flex-direction:column; justify-content:center; align-items:center; }
        .bold { font-weight:600; }
        .dim { opacity:0.75; }
        ${zebraCSS}
      </style>
    `;

    const rows = matches
      .map((m, idx) => {
        const rawDate = m.date ? m.date.replace(" ", "T") : null;
        const dateObj = rawDate ? new Date(rawDate) : null;
        const dateStr = dateObj
          ? dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "-";
        const timeStr = dateObj
          ? dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
          : "";

        const [homeScore, awayScore] = (m.score || "-").split("-");
        const homeBold = m.result === "win" ? "bold" : m.result === "loss" ? "dim" : "";
        const awayBold = m.result === "loss" ? "bold" : m.result === "win" ? "dim" : "";

        // kolor gradientu (RGBA)
        let gradientCSS = "";
        if (this.config.fill_mode === "gradient" && m.result) {
          const hex = this.config.colors[m.result] || "#000000";
          const rgb = hex.replace("#", "").match(/.{1,2}/g).map(x => parseInt(x, 16)).join(",");
          gradientCSS = `background: linear-gradient(to right,
            rgba(${rgb},0) ${this.config.gradient.start}%,
            rgba(${rgb},${this.config.gradient.alpha}) ${this.config.gradient.end}%);`;
        }

        return `
          <tr style="${gradientCSS}">
            <td>${dateStr}<br><span style="font-size:0.8em">${timeStr}</span></td>
            ${this.config.show_logos ? `<td><img src="${m.logo_home}" height="24" style="background:white;border-radius:4px;padding:2px"></td>` : ""}
            <td class="${homeBold}">${m.home}</td>
            <td class="dual"><div>${homeScore}</div><div>${awayScore}</div></td>
            <td class="${awayBold}">${m.away}</td>
            ${this.config.show_logos ? `<td><img src="${m.logo_away}" height="24" style="background:white;border-radius:4px;padding:2px"></td>` : ""}
          </tr>
        `;
      })
      .join("");

    const cardName = this.config.show_name ? this.config.name || "90minut Matches" : "";
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
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  description: "Karta pokazująca mecze z sensora 90minut.pl"
});