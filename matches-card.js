// Matches Card v0.1.007 — stabilny layout + zebra + gradient + pełny GUI hook

// ⚠️ LitElement/html/css z HA (kompatybilne ze współczesnym frontendem)
const LitBase = window.LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitBase.prototype.html;
const css  = LitBase.prototype.css;

class MatchesCard extends LitBase {
  // ✅ Klucz do wyświetlenia edytora GUI
  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  // ✅ Domyślny YAML przy dodaniu karty z listy
  static getStubConfig() {
    return {
      type: "custom:matches-card",
      entity: "sensor.90minut_gornik_zabrze_matches",
      name: "90minut Matches",
      show_logos: true,
      full_team_names: true,
      font_size: { date: 0.9, teams: 1.0, score: 1.0, status: 0.8, result_letter: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      columns_pct: { date: 12, league: 10, crest: 12, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" }
    };
  }

  static get properties() {
    return {
      hass: {},
      config: { type: Object },
      _rows: { type: Array }
    };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error("Entity is required");

    // Domyślne + nadpisanie
    this.config = {
      name: "Matches Card",
      show_logos: true,
      full_team_names: true,
      font_size: { date: 0.9, teams: 1.0, score: 1.0, status: 0.8, result_letter: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      columns_pct: { date: 12, league: 10, crest: 12, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config
    };
  }

  getCardSize() { return 4; }

  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;

    if (!this.config?.entity) return;
    const st = hass.states[this.config.entity];
    if (!st) return;

    const matches = st.attributes.matches || [];
    this._rows = matches;
    if (prev !== hass) this.requestUpdate();
  }

  // -------- helpers (formaty, kolory, obliczenia) --------
  _hexToRgb(hex) {
    const c = (hex || "").replace("#", "");
    const r = parseInt(c.substring(0,2) || "00", 16);
    const g = parseInt(c.substring(2,4) || "00", 16);
    const b = parseInt(c.substring(4,6) || "00", 16);
    return `${r},${g},${b}`;
  }
  _resultColor(res) {
    const col = this.config.colors || {};
    if (res === "win") return col.win || "#3ba55d";
    if (res === "loss") return col.loss || "#e23b3b";
    return col.draw || "#468cd2";
  }
  _date(dstr) {
    const d = new Date(dstr);
    if (Number.isNaN(d.getTime())) return dstr || "";
    return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }
  _time(dstr) {
    const d = new Date(dstr);
    if (Number.isNaN(d.getTime())) return "";
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }
  _scorePart(score, idx) {
    if (!score || score === "-") return "-";
    const [h, a] = String(score).split("-");
    return idx === 0 ? (h ?? "-") : (a ?? "-");
  }
  _letter(res) {
    if (res === "win") return "W";
    if (res === "loss") return "P";
    if (res === "draw") return "R";
    return "";
  }
  _leagueIcon(league, fallback) {
    if (league === "PP") return "https://img.sofascore.com/api/v1/unique-tournament/281/image";
    return "https://img.sofascore.com/api/v1/unique-tournament/202/image";
  }
  _teamsWidthPct() {
    const c = this.config.columns_pct || {};
    const sum = (c.date||0)+(c.league||0)+(c.crest||0)+(c.score||0)+(c.result||0);
    return Math.max(0, 100 - sum);
  }

  // ----------------- RENDER -----------------
  render() {
    const c = this.config;
    const rows = this._rows || [];
    const teamsPct = this._teamsWidthPct();
    const gridCols = `${c.columns_pct.date}% ${c.columns_pct.league}% ${c.columns_pct.crest}% ${teamsPct}% ${c.columns_pct.score}% ${c.columns_pct.result}%`;

    return html`
      <ha-card .header=${c.name || "Matches"}>
        <div class="table" style="grid-template-columns:${gridCols};">
          ${rows.map((m, i) => {
            const stripe = i % 2 === 0 ? "var(--stripeA)" : "var(--stripeB)";
            const resColor = this._resultColor(m.result);
            const grad = `linear-gradient(to right, rgba(${this._hexToRgb(resColor)},0.0) 0%, rgba(${this._hexToRgb(resColor)},0.5) 80%)`;
            return html`
              <div class="row" style="background:${stripe}, ${grad};">
                <!-- 1) Data (2 linie) -->
                <div class="cell date">
                  <div class="date-top" style="font-size:${c.font_size.date}em;">${this._date(m.date)}</div>
                  <div class="date-sub" style="font-size:${c.font_size.status}em;">${m.finished ? "Koniec" : this._time(m.date)}</div>
                </div>

                <!-- 2) Liga (centrowana ikona) -->
                <div class="cell league">
                  <img class="league-icon" src="${m.league_icon || this._leagueIcon(m.league)}" style="height:${c.icon_size.league}px;" alt="league">
                </div>

                <!-- 3) Herby (dwa wiersze, środek) -->
                <div class="cell crests">
                  ${c.show_logos && m.logo_home ? html`<img class="crest" src="${m.logo_home}" style="height:${c.icon_size.crest}px;" alt="home" />` : html``}
                  ${c.show_logos && m.logo_away ? html`<img class="crest" src="${m.logo_away}" style="height:${c.icon_size.crest}px;" alt="away" />` : html``}
                </div>

                <!-- 4) Drużyny (lewo, środek w pionie; zwycięzca pogrubiony) -->
                <div class="cell teams">
                  <div class="team ${m.result === "win" ? "winner" : "loser"}"  style="font-size:${c.font_size.teams}em;">${m.home}</div>
                  <div class="team ${m.result === "loss" ? "loser" : "winner"}" style="font-size:${c.font_size.teams}em;">${m.away}</div>
                </div>

                <!-- 5) Wynik (dwa wiersze, centrowane; zwycięzca pogrubiony) -->
                <div class="cell score">
                  <div class="score-line ${m.result === "win" ? "winner" : "loser"}"  style="font-size:${c.font_size.score}em;">${this._scorePart(m.score, 0)}</div>
                  <div class="score-line ${m.result === "loss" ? "loser" : "winner"}" style="font-size:${c.font_size.score}em;">${this._scorePart(m.score, 1)}</div>
                </div>

                <!-- 6) Litera W/P/R -->
                <div class="cell result" style="font-size:${c.font_size.result_letter}em;">${this._letter(m.result)}</div>

                <!-- separator -->
                <div class="separator"></div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display:block; }
      ha-card { overflow:hidden; }

      /* Zebra – automatyka do motywu */
      .table {
        display: grid;
        row-gap: 0;
        --stripeA: rgba(255,255,255,0.03);
        --stripeB: rgba(255,255,255,0.08);
      }
      @media (prefers-color-scheme: light) {
        .table {
          --stripeA: rgba(0,0,0,0.02);
          --stripeB: rgba(0,0,0,0.06);
        }
      }

      .row {
        display: grid;
        grid-template-columns: inherit;
        position: relative;
        padding: 8px 10px 6px;
      }

      .separator {
        grid-column: 1 / -1;
        height: 1px;
        background: var(--divider-color, rgba(0,0,0,0.12));
        opacity: 0.25;
        margin-top: 6px;
      }

      .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 44px;
        text-align: center;
      }
      .cell.date .date-top { line-height: 1.1; }
      .cell.date .date-sub { line-height: 1.1; opacity: 0.9; }
      .league-icon { display:block; }

      .cell.crests .crest {
        display: block;
        object-fit: contain;
        margin: 2px 0;
        background: #fff;        /* białe tło logo */
        border-radius: 6px;
        padding: 2px 3px;
      }

      .cell.teams {
        align-items: flex-start; /* lewo */
        text-align: left;
      }
      .team.winner { font-weight: 700; }
      .team.loser  { opacity: 0.9; }

      .cell.score .winner { font-weight: 700; }
      .cell.score .loser  { opacity: 0.9; }
    `;
  }
}

// Rejestracja do listy kart niestandardowych (GUI)
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  preview: true,
  description: "Custom match list card with gradient rows, zebra and full GUI editor."
});

// Definicja elementu
customElements.define("matches-card", MatchesCard);