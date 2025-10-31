/**************************************************************************************
 *  90minut Matches Card — v0.2_ui
 *  Author: GieOeRZet
 *  Description:
 *    - Pełna karta Lovelace z edytorem GUI
 *    - Wsparcie dwóch herbów (home + away)
 *    - Wizualny edytor (ha-entity-picker, ha-switch, paper-input)
 **************************************************************************************/

const _safe = (v, def = "") => (v === undefined || v === null ? def : v);

class MatchesCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "90minut Matches",
      show_logos: true,
      show_competition_icon: true,
      show_both_logos: true,
      text_align: "left",
      hover_effect: false,
      hover_color: "#374df5",
      column_widths: { date: 10, league: 8, logo_home: 10, teams: 40, score: 10, logo_away: 10, result: 12 },
      font_sizes: { date: 13, teams: 15, score: 15, competition: 12 }
    };
  }

  setConfig(config) {
    this._config = Object.assign({}, MatchesCard.getStubConfig(), config);
  }

  getCardSize() {
    return 5;
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) return;

    const entity = this._hass.states[this._config.entity];
    const matches = entity?.attributes?.matches || [];
    const title = this._config.name || entity?.attributes?.friendly_name || "90minut Matches";

    const cw = this._config.column_widths;
    const fs = this._config.font_sizes;

    const style = `
      <style>
        ha-card { padding: 8px; border-radius: 12px; }
        .card-header { font-weight: 600; padding: 6px 10px; font-size: ${fs.teams}px; }
        .matches-table { display: flex; flex-direction: column; }
        .match-row {
          display: grid;
          grid-template-columns: ${cw.date}% ${cw.league}% ${cw.logo_home}% ${cw.teams}% ${cw.score}% ${cw.logo_away}% ${cw.result}%;
          align-items: center;
          padding: 6px;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.1));
          transition: all 0.15s ease;
        }
        .match-row.hoverable:hover {
          box-shadow: 0 0 8px ${this._config.hover_color};
        }
        .match-date { text-align: center; font-size: ${fs.date}px; color: var(--secondary-text-color); }
        .match-league, .match-score, .match-result { display: flex; justify-content: center; align-items: center; }
        .league-icon { width: 24px; height: 24px; }
        .team-logo { width: 34px; height: 34px; border-radius: 6px; background: white; object-fit: contain; }
        .match-teams { display: flex; flex-direction: column; justify-content: center; text-align: ${this._config.text_align}; font-size: ${fs.teams}px; padding: 0 8px; }
        .team-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .team-name.bold { font-weight: bold; }
        .score-text { font-size: ${fs.score}px; font-weight: 600; }
        .result-icon { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
        .result-win { background: var(--success-color, #0bb32a); }
        .result-draw { background: rgb(70,140,210); }
        .result-loss { background: var(--error-color, #cb1818); }
        .no-data { text-align: center; color: var(--secondary-text-color); padding: 10px; }
      </style>
    `;

    if (matches.length === 0) {
      this.innerHTML = `<ha-card><div class="card-header">${title}</div>${style}<div class="no-data">Brak danych meczów</div></ha-card>`;
      return;
    }

    const rows = matches.map((m) => {
      const leagueIcon = this._config.show_competition_icon
        ? (m.league === "PP"
            ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
            : "https://img.sofascore.com/api/v1/unique-tournament/202/image")
        : "";

      const homeBold = m.result === "win" ? "bold" : "";
      const awayBold = m.result === "loss" ? "bold" : "";
      const resultClass =
        m.result === "win"
          ? "result-win"
          : m.result === "draw"
          ? "result-draw"
          : m.result === "loss"
          ? "result-loss"
          : "";
      const resultLetter =
        m.result === "win"
          ? "W"
          : m.result === "draw"
          ? "R"
          : m.result === "loss"
          ? "P"
          : "";

      return `
        <div class="match-row ${this._config.hover_effect ? "hoverable" : ""}">
          <div class="match-date">${_safe(m.date, "")}</div>
          <div class="match-league">${leagueIcon ? `<img src="${leagueIcon}" class="league-icon">` : ""}</div>
          <div class="match-logo">${this._config.show_logos && m.logo_home ? `<img src="${m.logo_home}" class="team-logo">` : ""}</div>
          <div class="match-teams">
            <div class="team-name ${homeBold}">${_safe(m.home)}</div>
            <div class="team-name ${awayBold}">${_safe(m.away)}</div>
          </div>
          <div class="match-score"><div class="score-text">${_safe(m.score, "")}</div></div>
          <div class="match-logo">${this._config.show_both_logos && m.logo_away ? `<img src="${m.logo_away}" class="team-logo">` : ""}</div>
          <div class="match-result">${resultLetter ? `<div class="result-icon ${resultClass}">${resultLetter}</div>` : ""}</div>
        </div>
      `;
    });

    this.innerHTML = `<ha-card><div class="card-header">${title}</div>${style}<div class="matches-table">${rows.join("")}</div></ha-card>`;
  }
}

/* ==========================================================
   [EDITOR] — pełny edytor GUI z ha-entity-picker i wszystkimi opcjami
   ========================================================== */
class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, MatchesCard.getStubConfig(), config);
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._config) return;

    this.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:8px;padding:6px;">
        <ha-entity-picker label="Sensor (90minut)" .hass="${this._hass}" .value="${this._config.entity}" include-domains='["sensor"]' @value-changed="${(e) => this.valueChanged(e, 'entity')}"></ha-entity-picker>
        <paper-input label="Nazwa karty" .value="${this._config.name}" @value-changed="${(e) => this.valueChanged(e, 'name')}"></paper-input>

        <ha-switch .checked="${this._config.show_logos}" @change="${(e) => this.valueChanged(e, 'show_logos')}">Pokaż herby</ha-switch>
        <ha-switch .checked="${this._config.show_both_logos}" @change="${(e) => this.valueChanged(e, 'show_both_logos')}">Pokaż oba herby</ha-switch>
        <ha-switch .checked="${this._config.show_competition_icon}" @change="${(e) => this.valueChanged(e, 'show_competition_icon')}">Pokaż logo ligi</ha-switch>

        <ha-switch .checked="${this._config.hover_effect}" @change="${(e) => this.valueChanged(e, 'hover_effect')}">Efekt hover</ha-switch>
        <paper-input label="Kolor efektu hover" .value="${this._config.hover_color}" @value-changed="${(e) => this.valueChanged(e, 'hover_color')}"></paper-input>

        <paper-dropdown-menu label="Wyrównanie tekstu drużyn">
          <paper-listbox slot="dropdown-content" selected="${["left","center","right"].indexOf(this._config.text_align || "left")}"
            @selected-changed="${(e) => this.valueChanged({ detail: { value: ["left","center","right"][e.detail.value] } }, 'text_align')}">
            <paper-item>left</paper-item>
            <paper-item>center</paper-item>
            <paper-item>right</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>
    `;
  }

  valueChanged(e, prop) {
    const val = e.detail?.value ?? e.target?.checked ?? e.target?.value;
    this._config[prop] = val;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }
}

/* ==========================================================
   [REGISTER]
   ========================================================== */
customElements.define("matches-card", MatchesCard);
customElements.define("matches-card-editor", MatchesCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches Card",
  description: "Karta prezentująca mecze z 90minut.pl z dwoma herbami i pełnym GUI"
});
