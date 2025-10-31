/****************************************************************************************
 *  90MINUT MATCHES CARD — wersja v0.1_b (scalona)
 *  Autor: GieOeRZet
 *  Opis:  Custom card dla Home Assistant prezentująca mecze z 90minut.pl z logami i wynikami
 *  
 *  SEKCJE:
 *   [1]  - REJESTRACJA ELEMENTU
 *   [2]  - STYLIZACJA i TEMATY
 *   [3]  - RENDEROWANIE KARTY
 *   [4]  - FUNKCJE POMOCNICZE
 *   [5]  - EDYTOR GUI (scalony)
 *   [6]  - REJESTRACJA w HA (window.customCards)
 ****************************************************************************************/

class MatchesCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "sensor.90minut_gornik_zabrze_matches",
      name: "90minut Matches",
      show_logos: true,
      show_competition_icon: true,
      text_align: "left",
      hover_effect: false,
      hover_color: "#374df5",
      column_widths: { date: 10, league: 10, logo: 10, teams: 50, score: 10, result: 10 },
      font_sizes: { date: 14, teams: 15, score: 15, competition: 12 },
    };
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Musisz wybrać sensor!");
    this.config = config;
  }

  connectedCallback() {
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this.isConnected) this.render();
  }

  /*******************************************************
   * [2] STYLIZACJA I TEMATY
   *******************************************************/
  getCardSize() {
    return 4;
  }

  render() {
    if (!this._hass || !this.config) return;

    const entity = this._hass.states[this.config.entity];
    if (!entity || !entity.attributes.matches) {
      this.innerHTML = `<ha-card><div class="card-header">${this.config.name || entity?.attributes?.friendly_name || "90minut Matches"}</div><div class="card-content">Brak danych</div></ha-card>`;
      return;
    }

    const matches = entity.attributes.matches || [];
    const styles = `
      <style>
        ha-card {
          padding: 8px;
          border-radius: var(--ha-card-border-radius, 12px);
          background: var(--card-background-color, var(--ha-card-background, #fff));
          color: var(--primary-text-color);
          transition: box-shadow 0.2s ease;
        }
        .match-row {
          display: grid;
          grid-template-columns: ${this.config.column_widths.date}% ${this.config.column_widths.league}% ${this.config.column_widths.logo}% ${this.config.column_widths.teams}% ${this.config.column_widths.score}% ${this.config.column_widths.result}%;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--divider-color, rgba(100,100,100,0.2));
          transition: all 0.2s ease;
        }
        .match-row:hover {
          ${this.config.hover_effect ? `box-shadow: 0 0 6px ${this.config.hover_color};` : ""}
          border-radius: 8px;
        }
        .match-date, .match-league, .match-score, .match-result {
          text-align: center;
          font-size: var(--font-size, 14px);
        }
        .match-teams {
          text-align: ${this.config.text_align};
          font-size: ${this.config.font_sizes.teams}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .team-name.bold { font-weight: 700; }
        .team-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          margin: auto;
        }
        .result-icon {
          font-weight: bold;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
        }
        .result-icon.win { background: var(--success-color, #0bb32a); }
        .result-icon.draw { background: var(--neutral-color, #9a9a9a); }
        .result-icon.loss { background: var(--error-color, #cb1818); }
        .league-icon {
          width: 26px;
          height: 26px;
          margin: auto;
        }
      </style>
    `;

    const rows = matches.map(m => {
      const resultClass = m.result === "win" ? "win" : m.result === "draw" ? "draw" : "loss";
      const resultLetter = m.result === "win" ? "W" : m.result === "draw" ? "R" : "P";

      return `
        <div class="match-row">
          <div class="match-date">${m.date}</div>
          <div class="match-league">
            ${this.config.show_competition_icon ? `<img src="${m.league === "PP"
              ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
              : "https://img.sofascore.com/api/v1/unique-tournament/202/image"}" class="league-icon">` : ""}
          </div>
          <div class="match-logo">
            ${this.config.show_logos && m.logo_home ? `<img src="${m.logo_home}" class="team-logo">` : ""}
          </div>
          <div class="match-teams">
            <div class="team-name ${m.result === "win" ? "bold" : ""}">${m.home}</div>
            <div class="team-name ${m.result === "loss" ? "bold" : ""}">${m.away}</div>
          </div>
          <div class="match-score">
            <div>${m.score}</div>
          </div>
          <div class="match-result">
            <div class="result-icon ${resultClass}">${resultLetter}</div>
          </div>
        </div>
      `;
    }).join("");

    this.innerHTML = `
      <ha-card>
        <div class="card-header">${this.config.name || entity.attributes.friendly_name}</div>
        ${styles}
        <div class="card-content">${rows}</div>
      </ha-card>
    `;
  }
}

/*********************************************************
 * [5] EDYTOR GUI (INLINE)
 *********************************************************/

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    if (!this._config) return;
    this.innerHTML = `
      <div class="card-config">
        <ha-entity-picker
          label="Sensor"
          .value="${this._config.entity || ""}"
          include-domains='["sensor"]'
          @value-changed=${e => this._valueChanged(e, "entity")}>
        </ha-entity-picker>

        <paper-input label="Nazwa karty" value="${this._config.name || ""}"
          @value-changed=${e => this._valueChanged(e, "name")}></paper-input>

        <ha-switch
          .checked=${this._config.show_logos}
          @change=${e => this._valueChanged(e, "show_logos")}>Pokaż herby</ha-switch>

        <ha-switch
          .checked=${this._config.hover_effect}
          @change=${e => this._valueChanged(e, "hover_effect")}>Efekt hover</ha-switch>

        <paper-input label="Kolor efektu hover" value="${this._config.hover_color || "#374df5"}"
          @value-changed=${e => this._valueChanged(e, "hover_color")}></paper-input>

        <paper-dropdown-menu label="Wyrównanie nazw drużyn">
          <paper-listbox slot="dropdown-content"
            selected="${["left","center","right"].indexOf(this._config.text_align || "left")}"
            @selected-changed=${e => this._valueChanged({detail:{value:["left","center","right"][e.detail.value]}}, "text_align")}>
            <paper-item>left</paper-item>
            <paper-item>center</paper-item>
            <paper-item>right</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>
    `;
  }

  _valueChanged(ev, prop) {
    if (!this._config || !this.dispatchEvent) return;
    const value = ev.detail?.value ?? ev.target?.value ?? ev.target?.checked;
    if (this._config[prop] === value) return;
    const newConfig = { ...this._config, [prop]: value };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }
}

/*********************************************************
 * [6] REJESTRACJA ELEMENTÓW W HOME ASSISTANT
 *********************************************************/

customElements.define("matches-card", MatchesCard);
customElements.define("matches-card-editor", MatchesCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches Card",
  description: "Karta pokazująca mecze z 90minut.pl z logami, wynikami i trybem edycji GUI"
});
