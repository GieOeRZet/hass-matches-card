class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity is required");
    }

    this.config = {
      name: "Matches Card",
      show_logos: true,
      full_team_names: true,
      colors: {
        win: "#3ba55d",
        loss: "#e23b3b",
        draw: "#468cd2"
      },
      ...config
    };
  }

  getCardSize() {
    return 4;
  }

  renderMatchRow(match, index) {
    const { colors } = this.config;
    const rowColor =
      match.result === "win"
        ? colors.win
        : match.result === "loss"
        ? colors.loss
        : colors.draw;

    const zebra = index % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.08)";
    const bg = `linear-gradient(to right, rgba(${this.hexToRgb(rowColor)},0.0) 0%, rgba(${this.hexToRgb(rowColor)},0.5) 80%)`;

    return `
      <div class="match-row" style="background:${bg};">
        <div class="cell date">
          <div>${this.formatDate(match.date)}</div>
          <div class="sub">${match.finished ? "Koniec" : this.formatTime(match.date)}</div>
        </div>
        <div class="cell league">
          <img src="${this.getLeagueLogo(match.league)}" alt="" class="league-logo"/>
        </div>
        <div class="cell crest">
          <img src="${match.logo_home || ""}" alt="" class="team-logo"/>
          <img src="${match.logo_away || ""}" alt="" class="team-logo"/>
        </div>
        <div class="cell teams">
          <div class="team ${this.isWinner(match, "home") ? "winner" : "loser"}">${match.home}</div>
          <div class="team ${this.isWinner(match, "away") ? "winner" : "loser"}">${match.away}</div>
        </div>
        <div class="cell score">
          <div class="${this.isWinner(match, "home") ? "winner" : "loser"}">${this.formatScore(match.score, 0)}</div>
          <div class="${this.isWinner(match, "away") ? "winner" : "loser"}">${this.formatScore(match.score, 1)}</div>
        </div>
        <div class="cell result">
          <div class="res-letter">${this.resultLetter(match.result)}</div>
        </div>
      </div>
      <div class="separator"></div>
    `;
  }

  isWinner(match, side) {
    if (!match.result) return false;
    if (match.result === "draw") return false;
    return (match.result === "win" && side === "home") || (match.result === "loss" && side === "away");
  }

  formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth()+1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  }

  formatTime(dateStr) {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes()
      .toString()
      .padStart(2,"0")}`;
  }

  formatScore(score, index) {
    if (!score || score === "-") return "-";
    const parts = score.split("-");
    return parts[index] || "-";
  }

  resultLetter(res) {
    if (res === "win") return "W";
    if (res === "loss") return "P";
    if (res === "draw") return "R";
    return "";
  }

  hexToRgb(hex) {
    const c = hex.replace("#", "");
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  getLeagueLogo(league) {
    if (league === "L") return "https://img.sofascore.com/api/v1/unique-tournament/202/image";
    if (league === "PP") return "https://img.sofascore.com/api/v1/unique-tournament/281/image";
    return "";
  }

  set hass(hass) {
    const state = hass.states[this.config.entity];
    if (!state) return;
    const matches = state.attributes.matches || [];

    this.innerHTML = `
      <ha-card header="${this.config.name}">
        <div class="matches-container">
          ${matches.map((m, i) => this.renderMatchRow(m, i)).join("")}
        </div>
      </ha-card>
    `;
  }
}

customElements.define("matches-card", MatchesCard);

customElements.whenDefined("hui-view").then(() => {
  if (!window.customCards) window.customCards = [];
  window.customCards.push({
    type: "matches-card",
    name: "Matches Card",
    description: "Stylowa karta meczów inspirowana Sofascore"
  });
});

const style = document.createElement("style");
style.textContent = `
.matches-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.match-row {
  display: grid;
  grid-template-columns: 12% 10% 10% 48% 10% 10%;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.95rem;
}
.separator {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 1px 0;
}
.cell {
  text-align: center;
}
.cell.teams {
  text-align: left;
}
.team.winner, .score .winner {
  font-weight: bold;
}
.team.loser, .score .loser {
  opacity: 0.9;
}
.team-logo {
  display: block;
  height: 28px;
  margin: 2px auto;
  object-fit: contain;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
}
.league-logo {
  height: 26px;
  margin: 0 auto;
}
.res-letter {
  font-weight: bold;
  font-size: 1rem;
}
`;
document.head.appendChild(style);