/********************************************************************************************
 * 90MINUT MATCHES CARD — v0.9_gui-final-debug
 * Author: GieOeRZet
 *
 * ✅ Pełny układ 1–6 kolumn (Data | Liga | Herb | Drużyny | Wynik | Rezultat)
 * ✅ Zebra i poziome linie
 * ✅ Procentowa szerokość kolumn (bez automatycznych wyliczeń)
 * ✅ 4 warianty entity-picker do testu
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

  _update(path, value) {
    const newConfig = { ...this.config };
    newConfig[path] = value;
    this.config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }

  render() {
    if (!this.hass) return html``;
    const c = this.config || {};

    return html`
      <h3>🎯 TEST PICKERÓW (wszystkie ustawiają to samo pole "entity")</h3>

      <ha-entity-picker
        .hass=${this.hass}
        label="Picker #1 – standardowy"
        .value=${c.entity || ""}
        include-domains='["sensor"]'
        @value-changed=${(e) => this._update("entity", e.detail.value)}>
      </ha-entity-picker>

      <ha-entity-picker
        .hass=${this.hass}
        label="Picker #2 – z allow-custom-entity"
        .value=${c.entity || ""}
        allow-custom-entity
        include-domains='["sensor"]'
        @value-changed=${(e) => this._update("entity", e.detail.value)}>
      </ha-entity-picker>

      <ha-entity-picker
        .hass=${this.hass}
        label="Picker #3 – bez include-domains"
        .value=${c.entity || ""}
        @value-changed=${(e) => this._update("entity", e.detail.value)}>
      </ha-entity-picker>

      <ha-entity-picker
        .hass=${this.hass}
        label="Picker #4 – z domain 'sensor' jako tekst"
        .value=${c.entity || ""}
        .includeDomains=${["sensor"]}
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

      <h4>Szerokości kolumn (%)</h4>
      ${["date", "league", "crest", "teams", "score", "result"].map(
        (k) => html`
          <ha-textfield
            type="number"
            label="${k}"
            .value=${c.columns_pct?.[k] ?? ""}
            @input=${(e) =>
              this._update("columns_pct", {
                ...c.columns_pct,
                [k]: Number(e.target.value),
              })}>
          </ha-textfield>
        `
      )}

      <h4>Rozmiary czcionek (em)</h4>
      ${["date", "teams", "score", "status", "result_letter"].map(
        (k) => html`
          <ha-textfield
            type="number"
            label="${k}"
            .value=${c.font_size?.[k] ?? ""}
            @input=${(e) =>
              this._update("font_size", {
                ...c.font_size,
                [k]: Number(e.target.value),
              })}>
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
      ha-textfield,
      ha-select {
        width: 100%;
        margin-top: 6px;
      }
      ha-switch {
        display: flex;
        align-items: center;
        margin: 6px 0;
      }
      h3 {
        color: var(--primary-color);
        margin: 12px 0 6px;
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
      font_size: { date: 0.9, teams: 1, score: 1, status: 0.8, result_letter: 1 },
      columns_pct: { date: 15, league: 10, crest: 10, teams: 35, score: 15, result: 15 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
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

    return html`
      <ha-card>
        <div class="header">${title}</div>
        ${matches.length
          ? matches.map((m, i) => this._renderRow(m, i, c))
          : html`<div class="no-data">Brak danych</div>`}
      </ha-card>
    `;
  }

  _renderRow(m, i, c) {
    const resClass =
      m.result === "win" ? "win" : m.result === "draw" ? "draw" : m.result === "loss" ? "loss" : "";
    const resLetter =
      m.result === "win" ? "W" : m.result === "draw" ? "R" : m.result === "loss" ? "P" : "";

    const leagueIcon =
      m.league === "PP"
        ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
        : "https://img.sofascore.com/api/v1/unique-tournament/202/image";

    return html`
      <div class="row">
        <div class="col date">
          <div>${m.date?.split(" ")[0] || ""}</div>
          <div class="status">${m.finished ? "Koniec" : "Nadchodzi"}</div>
        </div>
        <div class="col league">
          <img src="${leagueIcon}" width="24" height="24" />
        </div>
        <div class="col crest">
          ${c.show_logos && m.logo_home
            ? html`<img src="${m.logo_home}" class="team-logo" />`
            : ""}
          ${c.show_logos && m.logo_away
            ? html`<img src="${m.logo_away}" class="team-logo" />`
            : ""}
        </div>
        <div class="col teams">
          <div>${m.home}</div>
          <div>${m.away}</div>
        </div>
        <div class="col score">${m.score || "-"}</div>
        <div class="col result">
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
        grid-template-columns: 15% 10% 10% 35% 15% 15%;
        align-items: center;
        padding: 8px 8px;
        border-bottom: 1px solid rgba(var(--rgb-primary-text-color), 0.12);
      }
      .row:nth-child(odd) {
        background: rgba(var(--rgb-primary-text-color), 0.04);
      }
      .row:nth-child(even) {
        background: rgba(var(--rgb-primary-text-color), 0.08);
      }
      .col {
        text-align: center;
      }
      .teams {
        text-align: left;
        display: flex;
        flex-direction: column;
        line-height: 1.3em;
      }
      .team-logo {
        width: 24px;
        height: 24px;
        object-fit: contain;
        margin: 1px 0;
        border-radius: 4px;
        background: white;
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
  description:
    "v0.9_gui-final-debug — oddzielne kolumny, zebra, linie, 4 pickery testowe, pełny GUI"
});