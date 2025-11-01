// ===================================================================
// 90minut Matches Card v0.1.014-layout+style
// Autor: GieOeRZet + ChatGPT
// Opis: Layout + możliwość wyboru stylu wyniku (gradient / circle)
// ===================================================================

class MatchesCard extends HTMLElement {
  set hass(hass) {
    const config = this.config;
    const entityId = config.entity;
    const state = hass.states[entityId];

    if (!state) {
      this.innerHTML = `<ha-card><div class="error">Brak danych dla ${entityId}</div></ha-card>`;
      return;
    }

    const matches = state.attributes.matches || [];
    const title = config.name || state.attributes.friendly_name || "90minut Matches";

    // --- Ustawienia domyślne ---
    const showLogos = config.show_logos ?? true;
    const fullTeamNames = config.full_team_names ?? true;
    const resultStyle = config.result_style || "gradient"; // "gradient" | "circle"
    const gradientAlpha = config.gradient_alpha ?? 0.5;

    const fontSize = config.font_size || {
      date: 0.9,
      teams: 1,
      score: 1,
      status: 0.8,
      result_letter: 1
    };

    const iconSize = config.icon_size || {
      league: 26,
      crest: 24,
      result: 26
    };

    const colors = config.colors || {
      win: "#3ba55d",
      loss: "#e23b3b",
      draw: "#468cd2"
    };

    const columns = config.columns_pct || {
      date: 12,
      league: 10,
      crest: 10,
      score: 10,
      result: 8
    };

    // --- Automatyczna szerokość kolumny "teams" ---
    const usedWidth = columns.date + columns.league + columns.crest + columns.score + columns.result;
    const teamsWidth = Math.max(0, 100 - usedWidth);

    const ekLogo = "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png";
    const ppLogo = "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png";

    // --- Generowanie wierszy meczowych ---
    const rows = matches.map((m, i) => {
      const bgStripe = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)";
      const resultColor =
        m.result === "win" ? colors.win :
        m.result === "loss" ? colors.loss : colors.draw;

      const background =
        resultStyle === "gradient"
          ? `linear-gradient(to right,
              rgba(0,0,0,0.0) 0%,
              ${this.hexToRgba(resultColor, gradientAlpha)} 80%), ${bgStripe}`
          : bgStripe;

      const leagueIcon = m.league === "PP" ? ppLogo : ekLogo;
      const date = m.date ? m.date.split(" ")[0].split("-").reverse().join(".") : "";
      const time = m.finished ? "Koniec" : (m.date ? m.date.split(" ")[1]?.substring(0,5) : "");

      const [scoreTop, scoreBot] = (m.score || "-").split("-").map(s => parseInt(s) || 0);
      const scoreTopTxt = m.score && m.score !== "-" ? scoreTop : "-";
      const scoreBotTxt = m.score && m.score !== "-" ? scoreBot : "-";

      const homeBold = scoreTop > scoreBot ? "bold" : "";
      const awayBold = scoreBot > scoreTop ? "bold" : "";
      const homeDim = scoreTop < scoreBot ? "dim" : "";
      const awayDim = scoreBot < scoreTop ? "dim" : "";

      const resultLetter =
        m.result === "win" ? "W" :
        m.result === "loss" ? "P" :
        m.result === "draw" ? "R" : "";

      const resultCell = resultStyle === "circle"
        ? `<div class="cell result">
             <div class="result-circle" style="background:${resultColor}; width:${iconSize.result}px; height:${iconSize.result}px;">
               <span class="result-letter" style="font-size:${fontSize.result_letter}em;">${resultLetter}</span>
             </div>
           </div>`
        : `<div class="cell result"></div>`;

      return `
        <div class="match-row" style="background:${background};">
          <div class="cell date">
            <div class="date-top" style="font-size:${fontSize.date}em;">${date}</div>
            <div class="date-bottom" style="font-size:${fontSize.status}em;">${time}</div>
          </div>
          <div class="cell league">
            <img src="${leagueIcon}" class="league-icon" style="height:${iconSize.league}px;">
          </div>
          ${showLogos ? `
            <div class="cell crest">
              <img src="${m.logo_home || ""}" class="team-logo" style="height:${iconSize.crest}px;">
              <img src="${m.logo_away || ""}" class="team-logo" style="height:${iconSize.crest}px;">
            </div>` : ""}
          <div class="cell teams" style="width:${teamsWidth}%;">
            <div class="team ${homeBold} ${homeDim}" style="font-size:${fontSize.teams}em;">${fullTeamNames ? m.home : (m.home_short || m.home)}</div>
            <div class="team ${awayBold} ${awayDim}" style="font-size:${fontSize.teams}em;">${fullTeamNames ? m.away : (m.away_short || m.away)}</div>
          </div>
          <div class="cell score">
            <div class="score-top ${homeBold} ${homeDim}" style="font-size:${fontSize.score}em;">${scoreTopTxt}</div>
            <div class="score-bot ${awayBold} ${awayDim}" style="font-size:${fontSize.score}em;">${scoreBotTxt}</div>
          </div>
          ${resultCell}
        </div>
        <div class="separator"></div>
      `;
    }).join("");

    this.innerHTML = `
      <ha-card header="${title}">
        <div class="matches-table">${rows}</div>
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Musisz podać encję sensora!");
    this.config = config;
  }

  hexToRgba(hex, alpha) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  getCardSize() { return 4; }
}

customElements.define("matches-card", MatchesCard);

// ===================================================================
// Stylizacja karty
// ===================================================================
const style = document.createElement("style");
style.textContent = `
  ha-card {
    overflow: hidden;
  }
  .matches-table {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .match-row {
    display: grid;
    grid-template-columns: 12% 10% 10% auto 10% 8%;
    align-items: center;
    padding: 6px 8px;
    transition: background 0.3s;
  }
  .separator {
    height: 1px;
    width: 100%;
    background: rgba(120,120,120,0.25);
  }
  .cell {
    text-align: center;
  }
  .league-icon, .team-logo {
    display: block;
    margin: auto;
  }
  .team-logo {
    background: white;
    border-radius: 4px;
    padding: 2px;
    margin: 2px auto;
  }
  .teams {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .team {
    line-height: 1.2em;
  }
  .bold { font-weight: 700; }
  .dim { opacity: 0.8; }
  .score {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .result {
    text-align: center;
  }
  .result-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    margin: auto;
  }
  .result-letter { line-height: 1em; }
`;
document.head.appendChild(style);