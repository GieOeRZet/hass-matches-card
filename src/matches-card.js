// ===================================================================
// Matches Card - wersja 0.3.034
// Pełna karta Lovelace dla Home Assistant
// ===================================================================

import { html, css, LitElement } from "lit";
import "./matches-card-editor.js";
import pl from "./translations/pl.json";
import en from "./translations/en.json";
import gornik from "./assets/gornik.png";
import ekstraklasa from "./assets/ekstraklasa.png";

class MatchesCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      lang: { type: String },
    };
  }

  constructor() {
    super();
    this.lang = "pl";
    this.translations = { pl, en };
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Górnik Zabrze",
      show_logos: true,
      show_league: true,
      matches: [
        {
          team_home: "Górnik Zabrze",
          team_away: "Ruch Chorzów",
          result: "2:1",
          date: "2025-11-09 18:00",
          league: "Ekstraklasa",
        },
      ],
    };
  }

  setConfig(config) {
    this.config = config;
  }

  t(key) {
    return this.translations[this.lang]?.[key] || key;
  }

  render() {
    if (!this.config) return html``;

    const matches = this.config.matches || [];

    return html`
      <ha-card header="${this.config.title || this.t("title")}">
        <div class="table">
          ${matches.map(
            (match) => html`
              <div class="row">
                ${this.config.show_logos
                  ? html`
                      <img
                        class="logo"
                        src="${gornik}"
                        alt="logo"
                        height="26"
                      />
                    `
                  : ""}
                <div class="teams">
                  ${match.team_home} - ${match.team_away}
                </div>
                <div class="result">${match.result}</div>
                ${this.config.show_league
                  ? html`<div class="league">${match.league}</div>`
                  : ""}
              </div>
            `
          )}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        padding: 8px;
        background: linear-gradient(145deg, #1e1e1e, #292929);
        color: white;
        font-family: "Roboto", sans-serif;
      }
      .table {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .row {
        display: grid;
        grid-template-columns: 40px 1fr 60px auto;
        align-items: center;
        padding: 4px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .logo {
        border-radius: 50%;
      }
      .teams {
        padding-left: 8px;
        font-weight: 500;
      }
      .result {
        text-align: right;
        font-weight: bold;
      }
      .league {
        font-size: 0.8em;
        color: #ccc;
        text-align: right;
      }
    `;
  }
}

customElements.define("matches-card", MatchesCard);
