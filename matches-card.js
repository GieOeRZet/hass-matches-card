/******************************************************************************************
 * 90minut Matches Card – v0.9.6_gui-labeled
 * Autor: Roman & ChatGPT
 * Opis: Karta Home Assistant prezentująca mecze z 90minut.pl w stylu Sofascore.
 * Wersja: GUI z pełnym bindowaniem, zebrowaniem, natywnym entity pickerem i opisami sekcji.
 ******************************************************************************************/

// ============================================================================
// SEKCJA 1: Rejestracja karty dla Home Assistant (aby była widoczna jak natywna)
// ============================================================================
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches",
  description: "Wyświetla mecze drużyny z 90minut.pl w stylu Sofascore",
  preview: true
});

// ============================================================================
// SEKCJA 2: Definicja głównej klasy karty
// ============================================================================
class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");

    // Domyślna konfiguracja
    this.config = {
      name: config.name || "90minut Matches",
      entity: config.entity,
      show_logos: config.show_logos ?? true,
      full_team_names: config.full_team_names ?? true,
      font_size: config.font_size || {
        date: 0.9,
        teams: 1.0,
        score: 1.0,
        status: 0.8,
        result_letter: 1.0,
      },
      icon_size: config.icon_size || {
        league: 22,
        crest: 20,
        result: 22,
      },
      columns_pct: config.columns_pct || {
        date: 15,
        league: 10,
        crest: 10,
        score: 10,
        result: 7,
      },
      colors: config.colors || {
        win: "#3ba55d",
        loss: "#e23b3b",
        draw: "#468cd2",
      },
    };
  }

  set hass(hass) {
    this._hass = hass;
    const entity = hass.states[this.config.entity];
    if (!entity) return;

    const matches = entity.attributes.matches || [];

    // ========================================================================
    // SEKCJA 3: Tworzenie struktury HTML karty
    // ========================================================================
    this.innerHTML = `
      <ha-card header="${this.config.name}">
        <style>
          :host {
            display: block;
            font-family: var(--primary-font-family, "Sofascore Sans", sans-serif);
          }
          .match-row {
            display: flex;
            align-items: center;
            padding: 6px 10px;
            border-bottom: 1px solid var(--divider-color, rgba(130,130,130,0.2));
            background: var(--ha-card-background, var(--card-background-color));
          }
          .match-row:nth-child(even) {
            background-color: rgba(0,0,0,0.05);
          }
          .col {
            text-align: center;
          }
          .team-names {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            display: flex;
            text-align: left;
          }
          .team-names div {
            line-height: 1.1em;
          }
          .team-logos {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2px;
          }
          img.league-icon {
            height: ${this.config.icon_size.league}px;
          }
          img.crest {
            height: ${this.config.icon_size.crest}px;
          }
          .result-circle {
            width: ${this.config.icon_size.result}px;
            height: ${this.config.icon_size.result}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
        </style>

        <div class="matches-list">
          ${matches.map((m, i) => {
            const bg = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)";
            const resultColor =
              m.result === "win"
                ? this.config.colors.win
                : m.result === "loss"
                ? this.config.colors.loss
                : this.config.colors.draw;

            return `
              <div class="match-row" style="background:${bg}">
                <div class="col" style="width:${this.config.columns_pct.date}%;">${m.date}</div>
                <div class="col" style="width:${this.config.columns_pct.league}%;">
                  <img class="league-icon" src="${
                    m.league === "PP"
                      ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
                      : "https://img.sofascore.com/api/v1/unique-tournament/202/image"
                  }">
                </div>
                <div class="col team-logos" style="width:${this.config.columns_pct.crest}%;">
                  ${this.config.show_logos ? `<img class="crest" src="${m.logo_home || ''}"><img class="crest" src="${m.logo_away || ''}">` : ""}
                </div>
                <div class="col team-names" style="width:${100 - (this.config.columns_pct.date + this.config.columns_pct.league + this.config.columns_pct.crest + this.config.columns_pct.score + this.config.columns_pct.result)}%;">
                  <div style="font-size:${this.config.font_size.teams}em;">${m.home}</div>
                  <div style="font-size:${this.config.font_size.teams}em;">${m.away}</div>
                </div>
                <div class="col" style="width:${this.config.columns_pct.score}%;">
                  <div style="font-size:${this.config.font_size.score}em;">${m.score}</div>
                </div>
                <div class="col" style="width:${this.config.columns_pct.result}%;">
                  <div class="result-circle" style="background:${resultColor}">
                    ${m.result ? m.result[0].toUpperCase() : ""}
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }

  static getStubConfig() {
    return {
      entity: "sensor.90minut_gornik_zabrze_matches",
    };
  }
}

customElements.define("matches-card", MatchesCard);

// ============================================================================
// SEKCJA 4: GUI KONFIGURATORA (pełne bindowanie i entity-picker)
// ============================================================================
class MatchesCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const value = target.checked ?? target.value;
    const key = target.dataset.config;
    if (key) {
      this._config = { ...this._config, [key]: value };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    }
  }

  render() {
    if (!this._config) return html``;
    return html`
      <ha-form>
        <ha-entity-picker
          label="Sensor"
          .hass=${this.hass}
          .value=${this._config.entity}
          .configValue=${"entity"}
          include-domains="sensor"
          @value-changed=${this._valueChanged}>
        </ha-entity-picker>

        <ha-textfield
          label="Nazwa karty"
          .value=${this._config.name || ""}
          data-config="name"
          @input=${this._valueChanged}>
        </ha-textfield>

        <ha-switch
          .checked=${this._config.show_logos !== false}
          data-config="show_logos"
          @change=${this._valueChanged}>
          Pokaż herby
        </ha-switch>

        <ha-switch
          .checked=${this._config.full_team_names !== false}
          data-config="full_team_names"
          @change=${this._valueChanged}>
          Pełne nazwy drużyn
        </ha-switch>
      </ha-form>
    `;
  }
}
customElements.define("matches-card-editor", MatchesCardEditor);
window.customElements.whenDefined("hui-view").then(() => {
  window.customCards = window.customCards || [];
  window.customCards.push({ type: "matches-card", editor: "matches-card-editor" });
});
