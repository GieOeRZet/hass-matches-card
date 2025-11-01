class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this.config = {
      name: "90minut Matches",
      show_logos: true,
      full_team_names: true,
      result_style: "gradient", // gradient or circle
      gradient_alpha: 0.5,
      gradient_end: 80, // percentage width
      icon_size: { league: 26, crest: 24, result: 26 },
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
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

  getCardSize() {
    return 6;
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;

    const matches = stateObj.attributes.matches || [];

    const style = `
      <style>
        ha-card {
          padding: 10px 0;
          font-family: "Sofascore Sans", Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        tr {
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        tr:nth-child(even) {
          background-color: rgba(240,240,240,0.6);
        }
        td {
          vertical-align: middle;
          text-align: center;
          padding: 4px 6px;
        }
        .team-name {
          text-align: left;
          padding-left: 8px;
        }
        .bold { font-weight: bold; }
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
        .row-win {
          background: linear-gradient(
            to right,
            rgba(59,165,93,0) 0%,
            rgba(59,165,93,${this.config.gradient_alpha}) ${this.config.gradient_end}%
          );
        }
        .row-loss {
          background: linear-gradient(
            to right,
            rgba(226,59,59,0) 0%,
            rgba(226,59,59,${this.config.gradient_alpha}) ${this.config.gradient_end}%
          );
        }
        .row-draw {
          background: linear-gradient(
            to right,
            rgba(70,140,210,0) 0%,
            rgba(70,140,210,${this.config.gradient_alpha}) ${this.config.gradient_end}%
          );
        }
      </style>
    `;

    const rows = matches.map(match => {
      const isFinished = match.finished;
      const date = new Date(match.date);
      const dateStr = date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const timeStr = isFinished
        ? "Koniec"
        : date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          });

      const resultClass =
        match.result === "win" ? "row-win" :
        match.result === "loss" ? "row-loss" :
        match.result === "draw" ? "row-draw" : "";

      const homeBold = match.result === "win" ? "bold" : match.result === "loss" ? "dim" : "";
      const awayBold = match.result === "loss" ? "bold" : match.result === "win" ? "dim" : "";

      const [homeScore, awayScore] = match.score.split("-");

      const leagueIcon =
        match.league === "L"
          ? "https://raw.githubusercontent.com/gieoerzet/matches-card/main/logo/ekstraklasa.png"
          : "https://raw.githubusercontent.com/gieoerzet/matches-card/main/logo/puchar.png";

      const resultLetter =
        match.result === "win" ? "W" :
        match.result === "loss" ? "P" :
        match.result === "draw" ? "R" : "";

      return `
        <tr class="${resultClass}">
          <td style="width:${this.config.columns_pct.date}%;">
            <div>${dateStr}</div>
            <div style="font-size:${this.config.font_size.status}em">${timeStr}</div>
          </td>
          <td style="width:${this.config.columns_pct.league}%;">
            <img src="${leagueIcon}" height="${this.config.icon_size.league}" />
          </td>
          <td style="width:${this.config.columns_pct.crest}%;">
            <img src="${match.logo_home}" height="${this.config.icon_size.crest}" /><br>
            <img src="${match.logo_away}" height="${this.config.icon_size.crest}" />
          </td>
          <td class="team-name">
            <div class="${homeBold}" style="font-size:${this.config.font_size.teams}em">${match.home}</div>
            <div class="${awayBold}" style="font-size:${this.config.font_size.teams}em">${match.away}</div>
          </td>
          <td style="width:${this.config.columns_pct.score}%;">
            <div class="${homeBold}" style="font-size:${this.config.font_size.score}em">${homeScore}</div>
            <div class="${awayBold}" style="font-size:${this.config.font_size.score}em">${awayScore}</div>
          </td>
          <td style="width:${this.config.columns_pct.result}%;">
            ${this.config.result_style === "circle" && resultLetter
              ? `<div class="result-circle" style="background-color:${this.config.colors[match.result]}">${resultLetter}</div>`
              : ""}
          </td>
        </tr>
      `;
    }).join("");

    this.innerHTML = `
      ${style}
      <ha-card header="${this.config.name}">
        <table>${rows}</table>
      </ha-card>
    `;
  }

  // minimalny placeholder by HA nie wywalał błędu
  getConfigElement() {
    return null;
  }
}

customElements.define("matches-card", MatchesCard);