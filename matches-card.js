/********************************************************************************************
 * 90MINUT MATCHES CARD — v0.7_gui-stable
 * Author: GieOeRZet
 * ✅ Pełny, działający GUI (LitElement)
 * ✅ Synchronizacja YAML <-> GUI
 * ✅ Naprzemienne tło i poziome separatory
 * ✅ Automatyczna szerokość kolumny ligi
 ********************************************************************************************/

import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module";

/* =========================== [ GUI EDITOR ] =========================== */
class MatchesCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, config: {} };
  }

  setConfig(config) {
    this.config = config;
  }

  _value(path) {
    const parts = path.split(".");
    return parts.reduce((acc, p) => (acc && acc[p] !== undefined ? acc[p] : ""), this.config);
  }

  _update(path, value) {
    const parts = path.split(".");
    const newConfig = JSON.parse(JSON.stringify(this.config));
    let obj = newConfig;
    while (parts.length > 1) {
      const key = parts.shift();
      obj[key] = obj[key] || {};
      obj = obj[key];
    }
    obj[parts[0]] = value;
    this.config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }

  render() {
    if (!this.hass) return html``;
    const c = this.config || {};

    return html`
      <ha-entity-picker
        .hass=${this.hass}
        label="Sensor (90minut)"
        .value=${c.entity || ""}
        allow-custom-entity
        include-domains='["sensor"]'
        @value-changed=${(e) => this._update("entity", e.detail.value)}>
      </ha-entity-picker>

      <ha-textfield
        label="Nazwa karty"
        .value=${c.name || ""}
        @input=${(e) => this._update("name", e.target.value)}>
      </ha-textfield>

      <ha-switch
        .checked=${c.show_logos ?? true}
        @change=${(e) => this._update("show_logos", e.target.checked)}>
        Pokaż herby
      </ha-switch>

      <ha-switch
        .checked=${c.full_team_names ?? true}
        @change=${(e) => this._update("full_team_names", e.target.checked)}>
        Pełne nazwy drużyn
      </ha-switch>

      <ha-select
        label="Wyrównanie nazw drużyn"
        .value=${c.team_align || "left"}
        @selected=${(e) => this._update("team_align", e.target.value)}>
        <mwc-list-item value="left">Lewo</mwc-list-item>
        <mwc-list-item value="center">Środek</mwc-list-item>
        <mwc-list-item value="right">Prawo</mwc-list-item>
      </ha-select>

      <h4>Szerokości kolumn (%)</h4>
      ${["date", "crest", "score", "result"].map(
        (k) => html`
          <ha-textfield
            type="number"
            label="${k}"
            .value=${this._value(`columns_pct.${k}`)}
            @input=${(e) => this._update(`columns_pct.${k}`, Number(e.target.value))}>
          </ha-textfield>
        `
      )}

      <h4>Rozmiary czcionek (em)</h4>
      ${["date", "teams", "score", "status", "result_letter"].map(
        (k) => html`
          <ha-textfield
            type="number"
            label="${k}"
            .value=${this._value(`font_size.${k}`)}
            @input=${(e) => this._update(`font_size.${k}`, Number(e.target.value))}>
          </ha-textfield>
        `
      )}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding-bottom: 12px;
      }
      h4 {
        margin-top: 14px;
        margin-bottom: 4px;
        font-weight: 600;
        font-size: 14px;
      }
      ha-textfield,
      ha-select {
        width: 100%;
        margin-top: 4px;
      }
      ha-switch {
        display: flex;
        align-items: center;
        margin: 6px 0;
      }
    `;
  }
}
customElements.define("matches-card-editor", MatchesCardEditor);

/* =========================== [ GŁÓWNA KARTA ] =========================== */

class MatchesCard extends LitElement {
  static get properties() {
    return { hass: {}, config: {} };
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "90minut Matches",
      show_logos: true,
      full_team_names: true,
      team_align: "left",
      font_size: { date: 0.9, teams: 1, score: 1, status: 0.8, result_letter: 1 },
      columns_pct: { date: 20, crest: 15, score: 14, result: 7 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" }
    };
  }

  setConfig(config) {
    this.config = { ...MatchesCard.getStubConfig(), ...config };
  }

  render() {
    const c = this.config;
    const e = this.hass?.states[c.entity];
    const matches = e?.attributes?.matches || [];
    const title = c.name || e?.attributes?.friendly_name || "90minut Matches";

    // Automatyczna szerokość kolumny ligi
    const autoWidth =
      100 -
      (c.columns_pct.date + c.columns_pct.crest + c.columns_pct.score + c.columns_pct.result);

    return html`
      <ha-card>
        <div class="header">${title}</div>
        ${matches.length
          ? matches.map((m, i) => this._renderRow(m, i, c, autoWidth))
          : html`<div class="no-data">Brak danych</div>`}
      </ha-card>
    `;
  }

  _renderRow(m, i, c, autoWidth) {
    const resClass =
      m.result === "win" ? "win" : m.result === "draw" ? "draw" : m.result === "loss" ? "loss" : "";
    const resLetter =
      m.result === "win" ? "W" : m.result === "draw" ? "R" : m.result === "loss" ? "P" : "";

    return html`
      <div class="row">
        <div class="date">
          <div>${m.date?.split(" ")[0] || ""}</div>
          <div class="status">${m.finished ? "Koniec" : "Nadchodzi"}</div>
        </div>
        <div class="league">
          <img
            src="https://img.sofascore.com/api/v1/unique-tournament/202/image"
            width="24"
            height="24"
          />
        </div>
        <div class="crest-col">
          ${c.show_logos && m.logo_home
            ? html`<img src="${m.logo_home}" class="team-logo" />`
            : ""}
          ${c.show_logos && m.logo_away
            ? html`<img src="${m.logo_away}" class="team-logo" />`
            : ""}
        </div>
        <div class="teams">
          <div>${m.home}</div>
          <div>${m.away}</div>
        </div>
        <div class="score">${m.score || "-"}</div>
        <div class="result">
          ${resLetter ? html`<div class="result-icon ${resClass}">${resLetter}</div>` : ""}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        border-radius: 12px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        padding: 8px;
      }
      .header {
        font-weight: 600;
        font-size: 1.1em;
        padding: 8px 12px;
      }
      .row {
        display: grid;
        grid-template-columns: 20% auto 15% auto 14% 7%;
        align-items: center;
        padding: 6px 8px;
        border-bottom: 1px solid rgba(var(--rgb-primary-text-color), 0.1);
      }
      .row:nth-child(odd) {
        background: rgba(var(--rgb-primary-text-color), 0.03);
      }
      .row:nth-child(even) {
        background: rgba(var(--rgb-primary-text-color), 0.07);
      }
      .date {
        text-align: center;
        display: flex;
        flex-direction: column;
        font-size: var(--font-size-date, 0.9em);
      }
      .league,
      .score,
      .result {
        text-align: center;
      }
      .crest-col {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .team-logo {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin: 1px 0;
        border-radius: 4px;
        background: white;
      }
      .teams {
        text-align: var(--team-align, left);
        display: flex;
        flex-direction: column;
        font-size: var(--font-size-teams, 1em);
        line-height: 1.3em;
      }
      .score {
        font-weight: 700;
        font-size: var(--font-size-score, 1em);
      }
      .result-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }
      .win {
        background: #3ba55d;
      }
      .loss {
        background: #e23b3b;
      }
      .draw {
        background: #468cd2;
      }
      .no-data {
        text-align: center;
        color: var(--secondary-text-color);
        padding: 8px;
      }
    `;
  }
}
customElements.define("matches-card", MatchesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches Card",
  description: "Karta 90minut.pl w stylu Sofascore (GUI stable, zebra, auto width)"
});