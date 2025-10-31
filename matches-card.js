/**********************************************************************
 * Matches Card v1.1-tableGrid-GUI
 * Autor: Roman + GPT-5
 * Opis:
 *  Nowoczesna karta wyników meczów w stylu Sofascore.
 *  Układ 6 kolumn × 2 wiersze (CSS Grid) z pełnym GUI w HA.
 *
 *  Struktura siatki:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │ 1: Data/Koniec | 2: Logo ligi | 3a,b: Herby | 4a,b: Drużyny │
 *  │ 5a,b: Wyniki | 6: Symbol W/P/R                               │
 *  └─────────────────────────────────────────────────────────────┘
 **********************************************************************/

class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("⚠️ Wybierz sensor z listą meczów.");
    this._config = {
      name: "",
      show_logos: true,
      full_team_names: true,
      font_size: { date: 0.9, teams: 1, score: 1, status: 0.8, result_letter: 1 },
      icon_size: { league: 26, crest: 22, result: 26 },
      columns_pct: { date: 14, league: 8, crest: 10, score: 8, result: 6 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config,
    };
  }

  set hass(hass) {
    const entity = hass.states[this._config.entity];
    if (!entity) return;
    const matches = entity.attributes.matches || [];
    this.innerHTML = `
      <ha-card>
        ${this._config.name ? `<h1 class="card-header">${this._config.name}</h1>` : ""}
        <div class="matches-container">
          ${matches.map((match, i) => this._renderMatch(match, i)).join("")}
        </div>
      </ha-card>
    `;
  }

  // ===========================================================
  // Render pojedynczego meczu
  // ===========================================================
  _renderMatch(match, index) {
    const isFinished = match.finished;
    const date = new Date(match.date);
    const dateStr = date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "2-digit" });
    const timeStr = isFinished ? "Koniec" : date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

    const resultColor = {
      win: this._config.colors?.win || "#3ba55d",
      loss: this._config.colors?.loss || "#e23b3b",
      draw: this._config.colors?.draw || "#468cd2",
    }[match.result] || "#888";

    const cw = this._config.columns_pct || {};
    const colWidths = [
      (cw.date || 14) + "%",
      (cw.league || 8) + "%",
      (cw.crest || 10) + "%",
      "auto",
      (cw.score || 8) + "%",
      (cw.result || 6) + "%",
    ].join(" ");

    const zebra = index % 2 === 0 ? "even" : "odd";

    return `
      <div class="match-block ${zebra}" style="grid-template-columns: ${colWidths};">
        <!-- 1️⃣ Data -->
        <div class="cell date" style="grid-row: span 2;">
          <div>${dateStr}</div>
          <div>${timeStr}</div>
        </div>

        <!-- 2️⃣ Liga -->
        <div class="cell league" style="grid-row: span 2;">
          ${match.league === "L"
            ? `<img src="https://img.sofascore.com/api/v1/unique-tournament/202/image" alt="Liga">`
            : `<img src="https://img.sofascore.com/api/v1/unique-tournament/281/image" alt="PP">`}
        </div>

        <!-- 3️⃣ Herby -->
        <div class="cell crest home">${match.logo_home ? `<img src="${match.logo_home}" alt="${match.home}">` : ""}</div>
        <div class="cell crest away">${match.logo_away ? `<img src="${match.logo_away}" alt="${match.away}">` : ""}</div>

        <!-- 4️⃣ Nazwy -->
        <div class="cell team home"><span>${match.home}</span></div>
        <div class="cell team away"><span>${match.away}</span></div>

        <!-- 5️⃣ Wynik -->
        <div class="cell score home">${match.score ? match.score.split("-")[0] : "-"}</div>
        <div class="cell score away">${match.score ? match.score.split("-")[1] : "-"}</div>

        <!-- 6️⃣ Symbol W/P/R -->
        <div class="cell result" style="grid-row: span 2; color:${resultColor};">
          <div class="result-icon">${match.result ? match.result.toUpperCase()[0] : "-"}</div>
        </div>
      </div>
    `;
  }

  // ===========================================================
  // Style
  // ===========================================================
  static get styles() {
    return `
      ha-card { padding: 0.5em; }
      .card-header { margin: 0.3em 0.8em; font-size: 1.1em; font-weight: bold; }
      .matches-container { display: flex; flex-direction: column; gap: 0.3em; }

      .match-block {
        display: grid;
        grid-template-rows: 1fr 1fr;
        align-items: center;
        border-radius: 8px;
        padding: 0.4em 0.6em;
        background-color: var(--ha-card-background, #1e1e1e);
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .match-block.even { background-color: rgba(255,255,255,0.04); }
      .match-block.odd  { background-color: rgba(255,255,255,0.08); }

      .cell { display: flex; justify-content: center; align-items: center; }
      .cell.team { justify-content: flex-start; }
      .cell img { height: 22px; max-width: 24px; object-fit: contain; }
      .cell.date div { font-size: 0.85em; text-align: center; }
      .result-icon { font-weight: bold; font-size: 1.2em; }
    `;
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("matches-card", MatchesCard);