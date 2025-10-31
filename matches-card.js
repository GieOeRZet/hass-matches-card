/*************************************************************************************************
 * 90MINUT MATCHES CARD — v0.4_sofascore
 * Author: GieOeRZet
 * 
 * ✅ Pełna karta Sofascore-style:
 *    • Dwa herby (home / away)
 *    • Kółka W/P/R (zielone / niebieskie / czerwone)
 *    • Kolumna z datą i statusem (np. "Koniec", "Nadchodzi")
 *    • Hover box-shadow (konfigurowalny kolor + przełącznik)
 *    • Wyrównanie nazw drużyn (lewo / środek / prawo)
 *    • Regulacja szerokości kolumn (%)
 *    • Regulacja wielkości czcionek (px)
 *    • Dynamiczne kolory zależne od motywu jasny/ciemny
 *    • W pełni funkcjonalny GUI (ha-entity-picker, ha-switch, paper-input)
 **************************************************************************************************/

/* -----------------------------------------------------
   [1] Edytor GUI — rejestrowany PRZED kartą (ważne!)
----------------------------------------------------- */
if (!customElements.get("matches-card-editor")) {
  class MatchesCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = config;
      this.render();
    }
    set hass(hass) {
      this._hass = hass;
      this.render();
    }

    render() {
      if (!this._config) return;
      const c = this._config;

      this.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px;padding:8px;">
          <ha-entity-picker label="Sensor (90minut)" .hass="${this._hass}" .value="${c.entity || ""}" include-domains='["sensor"]'
            @value-changed="${(e)=>this._update(e,'entity')}"></ha-entity-picker>

          <paper-input label="Nazwa karty" .value="${c.name || ""}" @value-changed="${(e)=>this._update(e,'name')}"></paper-input>

          <ha-switch .checked="${c.show_logos}" @change="${(e)=>this._update(e,'show_logos')}">Pokaż herby</ha-switch>
          <ha-switch .checked="${c.show_both_logos}" @change="${(e)=>this._update(e,'show_both_logos')}">Pokaż oba herby</ha-switch>
          <ha-switch .checked="${c.show_competition_icon}" @change="${(e)=>this._update(e,'show_competition_icon')}">Pokaż logo ligi</ha-switch>

          <ha-switch .checked="${c.hover_effect}" @change="${(e)=>this._update(e,'hover_effect')}">Efekt hover</ha-switch>
          <paper-input label="Kolor efektu hover" .value="${c.hover_color || '#374df5'}" @value-changed="${(e)=>this._update(e,'hover_color')}"></paper-input>

          <paper-dropdown-menu label="Wyrównanie nazw drużyn">
            <paper-listbox slot="dropdown-content" selected="${["left","center","right"].indexOf(c.text_align || "left")}"
              @selected-changed="${(e)=>this._update({detail:{value:["left","center","right"][e.detail.value]}} ,'text_align')}">
              <paper-item>left</paper-item>
              <paper-item>center</paper-item>
              <paper-item>right</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>

          <h4>Szerokości kolumn (%)</h4>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${Object.entries(c.column_widths || {}).map(([k,v])=>`
              <paper-input label="${k}" type="number" min="1" max="100" .value="${v}"
                @value-changed="${(e)=>this._updateCol(k,e)}" style="width:80px"></paper-input>
            `).join("")}
          </div>

          <h4>Rozmiary czcionek (px)</h4>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${Object.entries(c.font_sizes || {}).map(([k,v])=>`
              <paper-input label="${k}" type="number" min="8" max="30" .value="${v}"
                @value-changed="${(e)=>this._updateFont(k,e)}" style="width:80px"></paper-input>
            `).join("")}
          </div>
        </div>
      `;
    }

    _update(e, prop) {
      const val = e.detail?.value ?? e.target?.checked ?? e.target?.value;
      this._config = { ...this._config, [prop]: val };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    }

    _updateCol(key, e) {
      const val = Number(e.detail?.value ?? e.target?.value);
      this._config.column_widths = { ...this._config.column_widths, [key]: val };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    }

    _updateFont(key, e) {
      const val = Number(e.detail?.value ?? e.target?.value);
      this._config.font_sizes = { ...this._config.font_sizes, [key]: val };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    }
  }
  customElements.define("matches-card-editor", MatchesCardEditor);
}

/* -----------------------------------------------------
   [2] Główna karta — Sofascore layout
----------------------------------------------------- */
class MatchesCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "90minut Matches",
      show_logos: true,
      show_both_logos: true,
      show_competition_icon: true,
      text_align: "left",
      hover_effect: false,
      hover_color: "#374df5",
      column_widths: { date: 12, league: 8, logo: 10, teams: 45, score: 12, result: 13 },
      font_sizes: { date: 13, teams: 15, score: 15, competition: 12 }
    };
  }

  setConfig(config) {
    this._config = Object.assign({}, MatchesCard.getStubConfig(), config);
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) return;

    const e = this._hass.states[this._config.entity];
    const matches = e?.attributes?.matches || [];
    const title = this._config.name || e?.attributes?.friendly_name || "90minut Matches";
    const cw = this._config.column_widths;
    const fs = this._config.font_sizes;

    const style = `
      <style>
        ha-card {
          border-radius: 12px;
          padding: 6px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }
        .header {
          font-weight: 600;
          padding: 8px 12px;
          font-size: ${fs.teams + 1}px;
        }
        .table { display: flex; flex-direction: column; gap: 2px; }

        .row {
          display: grid;
          grid-template-columns: ${cw.date}% ${cw.league}% ${cw.logo}% ${cw.teams}% ${cw.score}% ${cw.result}%;
          align-items: center;
          padding: 6px 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .row.hover:hover {
          box-shadow: 0 0 12px ${this._config.hover_color};
        }

        .date {
          text-align: center;
          color: var(--secondary-text-color);
          font-size: ${fs.date}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .league, .score, .result { display: flex; justify-content: center; align-items: center; }

        .team-logo {
          width: 34px; height: 34px;
          object-fit: contain;
          border-radius: 6px;
          background: white;
          margin: 1px;
        }

        .teams {
          display: flex;
          flex-direction: column;
          text-align: ${this._config.text_align};
          font-size: ${fs.teams}px;
          line-height: 1.2em;
          justify-content: center;
        }

        .team { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bold { font-weight: 700; }

        .score-text { font-size: ${fs.score}px; font-weight: 600; }

        .result-icon {
          width: 26px; height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
        .win { background: #0bb32a; }
        .draw { background: #468cd2; }
        .loss { background: #cb1818; }

        .no-data {
          text-align: center;
          color: var(--secondary-text-color);
          padding: 10px;
        }
      </style>
    `;

    if (!matches.length) {
      this.innerHTML = `<ha-card><div class="header">${title}</div>${style}<div class="no-data">Brak danych meczów</div></ha-card>`;
      return;
    }

    const rows = matches.map((m) => {
      const resultLetter = m.result === "win" ? "W" : m.result === "draw" ? "R" : m.result === "loss" ? "P" : "";
      const resClass = m.result === "win" ? "win" : m.result === "draw" ? "draw" : "loss";
      const leagueIcon = this._config.show_competition_icon
        ? (m.league === "PP"
            ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
            : "https://img.sofascore.com/api/v1/unique-tournament/202/image")
        : "";

      return `
        <div class="row ${this._config.hover_effect ? "hover" : ""}">
          <div class="date">
            <div>${m.date?.split(" ")[0] || ""}</div>
            <div style="font-size:${fs.competition}px;">${m.finished ? "Koniec" : "Nadchodzi"}</div>
          </div>
          <div class="league">${leagueIcon ? `<img src="${leagueIcon}" width="22" height="22">` : ""}</div>
          <div class="logo">
            ${this._config.show_logos && m.logo_home ? `<img src="${m.logo_home}" class="team-logo">` : ""}
            ${this._config.show_both_logos && m.logo_away ? `<img src="${m.logo_away}" class="team-logo">` : ""}
          </div>
          <div class="teams">
            <div class="team ${m.result === "win" ? "bold" : ""}">${m.home}</div>
            <div class="team ${m.result === "loss" ? "bold" : ""}">${m.away}</div>
          </div>
          <div class="score"><div class="score-text">${m.score || ""}</div></div>
          <div class="result">
            ${resultLetter ? `<div class="result-icon ${resClass}">${resultLetter}</div>` : ""}
          </div>
        </div>
      `;
    }).join("");

    this.innerHTML = `<ha-card><div class="header">${title}</div>${style}<div class="table">${rows}</div></ha-card>`;
  }
}

customElements.define("matches-card", MatchesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches Card",
  description: "Karta 90minut.pl w stylu Sofascore — dwa herby, hover, kolumny i GUI"
});
