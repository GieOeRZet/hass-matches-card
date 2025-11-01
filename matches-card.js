/********************************************************************
 *  MATCHES-CARD v0.1.016 (layout-final)
 *  - Układ inspirowany Sofascore
 *  - 6 kolumn (data | liga | herby | nazwy | wyniki | znaczki)
 *  - Gradient od kolumny drużyn do końca (kolumny 4–6)
 *  - Tryb wyników: gradient / circle / none
 *  - Zebra, separatory, pogrubienia, czcionki, kolory, itd.
 ********************************************************************/
class MatchesCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("hui-element-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "90minut Matches",
      show_logos: true,
      full_team_names: true,
      result_style: "gradient",
      gradient_alpha: 0.5,
      gradient_end: 50,
      icon_size: { league: 26, crest: 24, result: 26 },
      font_size: { date: 0.9, status: 0.8, teams: 1, score: 1, result_letter: 1 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
    };
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass || !this.config) return;
    const entity = this._hass.states[this.config.entity];
    if (!entity) {
      this.innerHTML = `<ha-card><div class="missing">Nie znaleziono encji ${this.config.entity}</div></ha-card>`;
      return;
    }

    const matches = entity.attributes.matches || [];
    const cfg = this.config;

    this.innerHTML = `
      <ha-card header="${cfg.name || "Matches"}">
        <style>
          ha-card {
            font-family: var(--primary-font-family);
            overflow: hidden;
          }
          .match-row {
            display: grid;
            grid-template-columns: ${cfg.columns_pct.date}% ${cfg.columns_pct.league}% ${cfg.columns_pct.crest}% auto ${cfg.columns_pct.score}% ${cfg.columns_pct.result}%;
            grid-template-rows: auto auto;
            align-items: center;
            padding: 6px 8px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .match-row:nth-child(even) {
            background-color: rgba(255,255,255,0.03);
          }
          .date, .league, .result {
            text-align: center;
            justify-self: center;
          }
          .team-name {
            justify-self: start;
          }
          .crest, .league img, .result-symbol {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          img {
            object-fit: contain;
            background: white;
            border-radius: 2px;
          }
          .result-symbol {
            width: ${cfg.icon_size.result}px;
            height: ${cfg.icon_size.result}px;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .win { background: ${cfg.colors.win}; }
          .loss { background: ${cfg.colors.loss}; }
          .draw { background: ${cfg.colors.draw}; }
        </style>
        <div class="matches">
          ${matches.map((m, i) => this._renderMatch(m, i, cfg)).join("")}
        </div>
      </ha-card>
    `;
  }

  _renderMatch(m, i, cfg) {
    const isFinished = m.status?.toLowerCase().includes("koniec");
    const winner = m.home_score > m.away_score ? "home" : m.home_score < m.away_score ? "away" : "draw";

    // kolor wyniku
    const color =
      winner === "home"
        ? cfg.colors.win
        : winner === "away"
        ? cfg.colors.loss
        : cfg.colors.draw;

    // gradient tła
    const gradient =
      cfg.result_style === "gradient"
        ? `background: linear-gradient(to right, rgba(0,0,0,0) 0%, ${color}${this._toRGBA(
            cfg.gradient_alpha
          )} ${cfg.gradient_end}%);`
        : "";

    // klasa symbolu
    const resultSymbol =
      cfg.result_style === "circle"
        ? `<div class="result-symbol ${winner}">
             ${winner === "draw" ? "R" : winner === "home" ? "W" : "P"}
           </div>`
        : "";

    return `
      <div class="match-row" style="${gradient}">
        <div class="date" style="grid-row: span 2;">
          <div style="font-size:${cfg.font_size.date}em;">${m.date}</div>
          <div style="font-size:${cfg.font_size.status}em;">${isFinished ? "Koniec" : m.time}</div>
        </div>
        <div class="league" style="grid-row: span 2;">
          <img src="${m.league_logo}" width="${cfg.icon_size.league}" height="${cfg.icon_size.league}">
        </div>
        <div class="crest"><img src="${m.home_logo}" width="${cfg.icon_size.crest}" height="${cfg.icon_size.crest}"></div>
        <div class="team-name" style="font-size:${cfg.font_size.teams}em; font-weight:${winner==="home"?"bold":"normal"}; opacity:${winner==="away"?0.8:1};">${m.home_team}</div>
        <div class="score" style="font-size:${cfg.font_size.score}em; text-align:center;">${m.home_score ?? "-"}</div>
        <div class="result" style="grid-row: span 2;">${resultSymbol}</div>

        <div class="crest"><img src="${m.away_logo}" width="${cfg.icon_size.crest}" height="${cfg.icon_size.crest}"></div>
        <div class="team-name" style="font-size:${cfg.font_size.teams}em; font-weight:${winner==="away"?"bold":"normal"}; opacity:${winner==="home"?0.8:1};">${m.away_team}</div>
        <div class="score" style="font-size:${cfg.font_size.score}em; text-align:center;">${m.away_score ?? "-"}</div>
      </div>
    `;
  }

  _toRGBA(alpha) {
    const val = Math.round(alpha * 255).toString(16).padStart(2, "0");
    return val;
  }
}

customElements.define("matches-card", MatchesCard);