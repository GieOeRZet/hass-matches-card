/**************************************************************************************
 *  matches-card.js — 90minut Matches Card (v0.1_b2)
 *  Author: GieOeRZet
 *  Notes:
 *   - scalony plik: karta + edytor GUI
 *   - edytor ustawia .hass na ha-entity-picker (poprawione)
 *   - czytelne sekcje oznaczone komentarzami
 **************************************************************************************/

/* ======================================================
   [SECTION 0] - UTILS
   ====================================================== */
const _safe = (v, def = "") => (v === undefined || v === null ? def : v);

/* ======================================================
   [SECTION 1] - MAIN CARD CLASS
   ====================================================== */
class MatchesCard extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "90minut Matches",
      show_logos: true,
      show_competition_icon: true,
      text_align: "left",
      hover_effect: false,
      hover_color: "#374df5",
      column_widths: { date: 10, league: 8, logo: 10, teams: 50, score: 10, result: 12 },
      font_sizes: { date: 13, teams: 15, score: 15, competition: 12 }
    };
  }

  setConfig(config) {
    if (!config) config = {};
    this._config = Object.assign({}, MatchesCard.getStubConfig(), config);
    // ensure entity key exists (but we will not throw here, allow editor to set)
    if (!this._config.entity) {
      // no throw: allow adding via editor; but console warn
      console.warn("matches-card: no entity set (use GUI to set sensor entity)");
    }
  }

  getCardSize() {
    return 4;
  }

  set hass(hass) {
    this._hass = hass;
    // re-render whenever hass updates while the card is connected
    if (this.isConnected) this._render();
  }

  /* ======================================================
     [SECTION 2] - RENDER / HELPERS
     ====================================================== */
  _render() {
    if (!this._config) {
      this.innerHTML = `<ha-card><div style="padding:8px">No config</div></ha-card>`;
      return;
    }

    const entityId = this._config.entity;
    const entity = entityId && this._hass ? this._hass.states[entityId] : null;
    const matches = entity?.attributes?.matches || [];

    // header
    const title = _safe(this._config.name, entity?.attributes?.friendly_name || "90minut Matches");

    // styles (derived from config)
    const cw = this._config.column_widths || {};
    const fs = this._config.font_sizes || {};
    const hoverCss = this._config.hover_effect ? `box-shadow: 0 4px 10px ${this._config.hover_color};` : "";

    const style = `
      <style>
        ha-card { padding: 6px; border-radius: 10px; }
        .card-header { font-weight:600; padding:8px 12px; font-size:${fs.teams || 15}px; }
        .matches-table { display:flex; flex-direction:column; gap:0; }
        .match-row {
          display: grid;
          grid-template-columns: ${cw.date}% ${cw.league}% ${cw.logo}% ${cw.teams}% ${cw.score}% ${cw.result}%;
          align-items: center;
          padding: 8px 6px;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.08));
          transition: background 0.12s ease, box-shadow 0.12s ease;
        }
        .match-row.hoverable:hover { ${hoverCss} }
        .match-date { text-align:center; font-size:${fs.date || 13}px; color:var(--secondary-text-color); }
        .match-league, .match-logo, .match-score, .match-result { display:flex; justify-content:center; align-items:center; }
        .league-icon { width: 24px; height: 24px; object-fit:contain; }
        .team-logo { width: 34px; height: 34px; object-fit:contain; background:#fff; padding:2px; border-radius:4px;}
        .match-teams { text-align:${this._config.text_align || "left"}; padding:0 8px; font-size:${fs.teams || 15}px; display:flex; flex-direction:column; justify-content:center; }
        .team-name { line-height:1.05; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .team-name.bold { font-weight:700; }
        .score-text { font-size:${fs.score || 15}px; font-weight:600; text-align:center; }
        .result-icon { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; }
        .result-win { background: var(--success-color, #0bb32a); }
        .result-draw { background: var(--draw-color, rgb(70,140,210)); }
        .result-loss { background: var(--error-color, #cb1818); }
        .no-data { padding: 12px; color: var(--secondary-text-color); text-align:center; }
      </style>
    `;

    // build rows
    if (!matches || matches.length === 0) {
      this.innerHTML = `<ha-card><div class="card-header">${title}</div>${style}<div class="no-data">No matches</div></ha-card>`;
      return;
    }

    const rowsHtml = matches.map(m => {
      const leagueIcon = this._config.show_competition_icon
        ? (m.league === "PP"
            ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
            : "https://img.sofascore.com/api/v1/unique-tournament/202/image")
        : "";

      const homeBold = m.result === "win" && m.home ? "bold" : "";
      const awayBold = m.result === "loss" && m.away ? "bold" : "";
      const resultClass = m.result === "win" ? "result-win" : m.result === "draw" ? "result-draw" : m.result === "loss" ? "result-loss" : "";
      const resultLetter = m.result === "win" ? "W" : m.result === "draw" ? "R" : m.result === "loss" ? "P" : "";

      return `
        <div class="match-row ${this._config.hover_effect ? "hoverable" : ""}">
          <div class="match-date">${_safe(m.date,"")}</div>
          <div class="match-league">${leagueIcon ? `<img src="${leagueIcon}" class="league-icon" alt="liga" />` : ""}</div>
          <div class="match-logo">${this._config.show_logos && m.logo_home ? `<img src="${m.logo_home}" class="team-logo" alt="home logo">` : ""}</div>
          <div class="match-teams">
            <div class="team-name ${homeBold}">${_safe(m.home)}</div>
            <div class="team-name ${awayBold}">${_safe(m.away)}</div>
          </div>
          <div class="match-score"><div class="score-text">${m.score === "-" ? "" : _safe(m.score)}</div></div>
          <div class="match-result">${resultLetter ? `<div class="result-icon ${resultClass}">${resultLetter}</div>` : ""}</div>
        </div>
      `;
    }).join("");

    this.innerHTML = `<ha-card>
      <div class="card-header">${title}</div>
      ${style}
      <div class="matches-table">${rowsHtml}</div>
    </ha-card>`;
  }

  connectedCallback() {
    // initial render (may be updated by hass later)
    this._render();
  }
}

/* ======================================================
   [SECTION 3] - EDITOR (INLINE) - robustny: ustawia .hass i listeners
   ====================================================== */
class MatchesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._root = this;
  }

  setConfig(config) {
    this._config = Object.assign({}, MatchesCard.getStubConfig(), config || {});
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // re-render so ha-entity-picker gets hass
    if (this.isConnected) this._render();
  }

  _render() {
    if (!this._config) return;
    // Build DOM via innerHTML for simple layout, then set properties/listeners programmatically
    this.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;padding:6px">
        <div id="entity-row"></div>
        <div><paper-input id="name" label="Card Title"></paper-input></div>
        <div style="display:flex;gap:12px;align-items:center">
          <div><ha-switch id="logos-switch"></ha-switch></div><div>Show team logos</div>
        </div>
        <div style="display:flex;gap:12px;align-items:center">
          <div><ha-switch id="hover-switch"></ha-switch></div><div>Enable hover effect</div>
        </div>
        <div><paper-input id="hover-color" label="Hover color (hex or rgba)"></paper-input></div>
        <div>
          <paper-dropdown-menu label="Teams alignment" id="align-menu">
            <paper-listbox slot="dropdown-content" id="align-listbox" selected="0">
              <paper-item value="left">left</paper-item>
              <paper-item value="center">center</paper-item>
              <paper-item value="right">right</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div style="font-size:12px;color:var(--secondary-text-color)">Column widths (date / league / logo / teams / score / result) %</div>
        </div>
        <div style="display:flex;gap:8px">
          <paper-input id="col-date" label="date" type="number" style="width:60px"></paper-input>
          <paper-input id="col-league" label="league" type="number" style="width:60px"></paper-input>
          <paper-input id="col-logo" label="logo" type="number" style="width:60px"></paper-input>
          <paper-input id="col-teams" label="teams" type="number" style="width:60px"></paper-input>
          <paper-input id="col-score" label="score" type="number" style="width:60px"></paper-input>
          <paper-input id="col-result" label="result" type="number" style="width:60px"></paper-input>
        </div>
      </div>
    `;

    // entity picker (create element programmatically so we can pass .hass)
    const entityRow = this.querySelector("#entity-row");
    entityRow.innerHTML = ""; // clear
    const picker = document.createElement("ha-entity-picker");
    if (this._hass) picker.hass = this._hass; // important: pass hass object
    picker.setAttribute("label", "Sensor (sensor.*)");
    picker.includeDomains = ["sensor"];
    picker.value = this._config.entity || "";
    picker.addEventListener("value-changed", (e) => this._onValueChanged(e, "entity"));
    entityRow.appendChild(picker);

    // name
    const nameInput = this.querySelector("#name");
    nameInput.value = this._config.name || "";
    nameInput.addEventListener("value-changed", (e) => this._onValueChanged(e, "name"));

    // logos switch
    const logosSwitch = this.querySelector("#logos-switch");
    logosSwitch.checked = !!this._config.show_logos;
    logosSwitch.addEventListener("change", (e) => this._onValueChanged({ detail: { value: e.target.checked } }, "show_logos"));

    // hover switch
    const hoverSwitch = this.querySelector("#hover-switch");
    hoverSwitch.checked = !!this._config.hover_effect;
    hoverSwitch.addEventListener("change", (e) => this._onValueChanged({ detail: { value: e.target.checked } }, "hover_effect"));

    // hover color
    const hc = this.querySelector("#hover-color");
    hc.value = this._config.hover_color || "#374df5";
    hc.addEventListener("value-changed", (e) => this._onValueChanged(e, "hover_color"));

    // alignment
    const alignList = this.querySelector("#align-listbox");
    const alignVals = ["left","center","right"];
    alignList.selected = alignVals.indexOf(this._config.text_align || "left");
    alignList.addEventListener("selected-changed", (e) => {
      const idx = e.detail.value;
      const val = alignVals[idx] || "left";
      this._onValueChanged({ detail: { value: val } }, "text_align");
    });

    // column widths inputs
    const colDate = this.querySelector("#col-date");
    const colLeague = this.querySelector("#col-league");
    const colLogo = this.querySelector("#col-logo");
    const colTeams = this.querySelector("#col-teams");
    const colScore = this.querySelector("#col-score");
    const colResult = this.querySelector("#col-result");

    const cw = Object.assign({}, MatchesCard.getStubConfig().column_widths, this._config.column_widths || {});
    colDate.value = cw.date; colLeague.value = cw.league; colLogo.value = cw.logo;
    colTeams.value = cw.teams; colScore.value = cw.score; colResult.value = cw.result;

    const _colHandler = (evt, key) => {
      const val = Number(evt.target.value);
      const newCW = Object.assign({}, this._config.column_widths || {}, {[key]: val});
      this._onValueChanged({ detail: { value: newCW } }, "column_widths");
    };

    colDate.addEventListener("value-changed", (e) => _colHandler(e, "date"));
    colLeague.addEventListener("value-changed", (e) => _colHandler(e, "league"));
    colLogo.addEventListener("value-changed", (e) => _colHandler(e, "logo"));
    colTeams.addEventListener("value-changed", (e) => _colHandler(e, "teams"));
    colScore.addEventListener("value-changed", (e) => _colHandler(e, "score"));
    colResult.addEventListener("value-changed", (e) => _colHandler(e, "result"));
  }

  _onValueChanged(ev, prop) {
    const value = ev.detail?.value ?? ev.target?.value ?? ev.target?.checked;
    // if column_widths value passed is entire object, apply directly
    if (prop === "column_widths" && typeof value === "object") {
      this._config.column_widths = value;
    } else {
      this._config[prop] = value;
    }
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }
}

/* ======================================================
   [SECTION 4] - REGISTER CUSTOM ELEMENTS & customCards meta
   ====================================================== */
customElements.define("matches-card", MatchesCard);
customElements.define("matches-card-editor", MatchesCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches Card",
  preview: true,
  description: "Card for 90minut.pl matches with logos and GUI editor"
});

/* End of file */
