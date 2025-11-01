// ===================================================================
// 90minut Matches Card v0.1.011
// Autor: GieOeRZet + ChatGPT
// Opis: Karta wyników z automatycznym wykrywaniem zwycięzcy po wyniku
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

    // Ustawienia domyślne
    const showLogos = config.show_logos ?? true;
    const fullTeamNames = config.full_team_names ?? true;
    const useGradient = config.use_gradient ?? true;
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

    const ekLogo = "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png";
    const ppLogo = "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png";

    // Generowanie wierszy meczowych
    const rows = matches.map((m, i) => {
      const bgStripe = i % 2 === 0 ? "var(--ha-card-background)" : "rgba(0,0,0,0.04)";

      let gradColor = "";
      let color = "";
      if (m.result === "win") { gradColor = colors.win; color = colors.win; }
      else if (m.result === "loss") { gradColor = colors.loss; color = colors.loss; }
      else { gradColor = colors.draw; color = colors.draw; }

      const leagueIcon = m.league === "PP" ? ppLogo : ekLogo;
      const date = m.date ? m.date.split(" ")[0].split("-").reverse().join(".") : "";
      const time = m.finished ? "Koniec" : (m.date ? m.date.split(" ")[1]?.substring(0,5) : "");

      // 🧠 Automatyczne rozpoznawanie zwycięzcy
      const scoreTop = parseInt(m.score?.split("-")[0] || 0);
      const scoreBot = parseInt(m.score?.split("-")[1] || 0);
      const homeBold = scoreTop > scoreBot ? "bold" : "";
      const awayBold = scoreBot > scoreTop ? "bold" : "";
      const homeDim = scoreTop < scoreBot ? "dim" : "";
      const awayDim = scoreBot < scoreTop ? "dim" : "";

      const scoreTopTxt = m.score && m.score !== "-" ? m.score.split("-")[0] : "-";
      const scoreBotTxt = m.score && m.score !== "-" ? m.score.split("-")[1] : "-";
      const resultLetter = m.result === "win" ? "W" : m.result === "loss" ? "P" : m.result === "draw" ? "R" : "";

      // 🎨 Gradient lub kółko
      const background = useGradient
        ? `linear-gradient(to right, rgba(0,0,0,0.0) 0%, ${gradColor}80 80%), ${bgStripe}`
        : bgStripe;

      const resultCell = useGradient
        ? `<div class="cell result"></div>`
        : `<div class="cell result">
             <div class="result-circle" style="background:${color}; width:${iconSize.result}px; height:${iconSize.result}px;">
               <span class="result-letter" style="font-size:${fontSize.result_letter}em;">${resultLetter}</span>
             </div>
           </div>`;

      return `
        <div class="match-row" style="background:${background}">
          <div class="cell date">
            <div class="date-top" style="font-size:${fontSize.date}em;">${date}</div>
            <div class="date-bottom" style="font-size:${fontSize.status}em;">${time}</div>
          </div>
          <div class="cell league">
            <img src="${leagueIcon}" class="league-icon" style="height:${iconSize.league}px;">
          </div>
          ${showLogos ? `<div class="cell crest"><img src="${m.logo_home || ""}" class="team-logo" style="height:${iconSize.crest}px;"></div>` : ""}
          <div class="cell teams">
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

  getCardSize() {
    return 5;
  }
}

customElements.define("matches-card", MatchesCard);

// ===================================================================
// Stylizacja
// ===================================================================
const style = document.createElement("style");
style.textContent = `
  .matches-table {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .match-row {
    display: grid;
    grid-template-columns: 12% 10% 10% auto 12% 8%;
    align-items: center;
    padding: 6px 8px;
  }
  .separator {
    height: 1px;
    width: 100%;
    background: rgba(120,120,120,0.2);
  }
  .cell { text-align: center; }
  .league-icon, .team-logo { display: block; margin: auto; }
  .team-logo {
    background: white;
    border-radius: 4px;
    padding: 2px;
  }
  .teams { text-align: left; }
  .team { line-height: 1.2em; }
  .bold { font-weight: 700; }
  .dim { opacity: 0.8; }
  .score { display: flex; flex-direction: column; }
  .result { text-align: center; }
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