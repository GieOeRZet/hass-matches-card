/********************************************************************************************
 * 90MINUT MATCHES CARD — v0.9.5_gui-rework
 * Pełne GUI (dwukierunkowe bindowanie, działające pola, pickery testowe)
 * Sofascore style: zebra, poziome linie, osobne kolumny, 2 herby.
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

  _updateConfig(path, value) {
    const newConfig = JSON.parse(JSON.stringify(this.config || {}));
    const pathParts = path.split(".");
    let target = newConfig;
    while (pathParts.length > 1) target = target[pathParts.shift()] ||= {};
    target[pathParts[0]] = value;
    this.config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }

  render() {
    if (!this.hass) return html``;
    const c = this.config || {};

    return html`
      <div class="section">
        <h3>📊 Wybór sensora (test 4 warianty pickera)</h3>
        <div class="row">
          <ha-entity-picker
            label="Picker #1"
            .hass=${this.hass}
            .value=${c.entity || ""}
            include-domains='["sensor"]'
            @value-changed=${(e) => this._updateConfig("entity", e.detail.value)}>
          </ha-entity-picker>
          <ha-entity-picker
            label="Picker #2 (allow-custom)"
            .hass=${this.hass}
            .value=${c.entity || ""}
            allow-custom-entity
            @value-changed=${(e) => this._updateConfig("entity", e.detail.value)}>
          </ha-entity-picker>
        </div>
      </div>

      <div class="section">
        <h3>⚙️ Wygląd i opcje</h3>
        <div class="row switches">
          <div class="switch">
            <ha-switch
              .checked=${c.show_logos ?? true}
              @change=${(e) => this._updateConfig("show_logos", e.target.checked)}>
            </ha-switch>
            <label>Pokaż herby</label>
          </div>
          <div class="switch">
            <ha-switch
              .checked=${c.full_team_names ?? true}
              @change=${(e) => this._updateConfig("full_team_names", e.target.checked)}>
            </ha-switch>
            <label>Pełne nazwy drużyn</label>
          </div>
        </div>
        <ha-textfield
          label="Nazwa karty"
          .value=${c.name || ""}
          @input=${(e) => this._updateConfig("name", e.target.value)}>
        </ha-textfield>
      </div>

      <div class="section">
        <h3>📏 Szerokości kolumn (%)</h3>
        <div class="grid">
          ${["date", "league", "crest", "score", "result"].map(
            (k) => html`
              <ha-textfield
                type="number"
                label="${k}"
                .value=${c.columns_pct?.[k] ?? ""}
                @input=${(e) =>
                  this._updateConfig(`columns_pct.${k}`, Number(e.target.value))}>
              </ha-textfield>
            `
          )}
        </div>
      </div>

      <div class="section">
        <h3>🔠 Rozmiary czcionek (em)</h3>
        <div class="grid">
          ${["date", "teams", "score", "status", "result_letter"].map(
            (k) => html`
              <ha-textfield
                type="number"
                label="${k}"
                .value=${c.font_size?.[k] ?? ""}
                @input=${(e) =>
                  this._updateConfig(`font_size.${k}`, Number(e.target.value))}>
              </ha-textfield>
            `
          )}
        </div>
      </div>

      <div class="section">
        <h3>🏆 Wielkości ikon (px)</h3>
        <div class="grid">
          ${["league", "crest", "result"].map(
            (k) => html`
              <ha-textfield
                type="number"
                label="${k}"
                .value=${c.icon_size?.[k] ?? ""}
                @input=${(e) =>
                  this._updateConfig(`icon_size.${k}`, Number(e.target.value))}>
              </ha-textfield>
            `
          )}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 10px;
      }
      h3 {
        color: var(--primary-color);
        margin: 12px 0 6px;
      }
      .section {
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 12px;
        margin-bottom: 10px;
      }
      .row {
        display: flex;
        gap: 8px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
      }
      ha-switch + label {
        margin-left: 6px;
        user-select: none;
      }
      .switch {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `;
  }
}
customElements.define("matches-card-editor", MatchesCardEditor);

/* =========================== [ KARTA ] =========================== */
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
      icon_size: { league: 24, crest: 24, result: 24 },
      columns_pct: { date: 15, league: 10, crest: 10, score: 15, result: 10 },
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
          ? matches.map((m, i) => this._renderRow(m, i))
          : html`<div class="no-data">Brak danych</div>`}
      </ha-card>
    `;
  }

  _renderRow(m, i) {
    const c = this.config;
    const resLetter =
      m.result === "win" ? "W" : m.result === "draw" ? "R" : m.result === "loss" ? "P" : "";
    const resClass = m.result ?? "";
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
          <img src="${leagueIcon}" style="width:${c.icon_size.league}px" />
        </div>
        <div class="col crest">
          ${c.show_logos
            ? html`<img src="${m.logo_home}" style="width:${c.icon_size.crest}px" />
                <img src="${m.logo_away}" style="width:${c.icon_size.crest}px" />`
            : ""}
        </div>
        <div class="col teams">
          <div>${m.home}</div>
          <div>${m.away}</div>
        </div>
        <div class="col score">${m.score || "-"}</div>
        <div class="col result">
          ${resLetter
            ? html`<div class="result-icon ${resClass}" style="width:${c.icon_size.result}px">
                ${resLetter}
              </div>`
            : ""}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        border-radius: 10px;
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
        grid-template-columns: 15% 10% 10% 40% 15% 10%;
        align-items: center;
        padding: 6px 8px;
        border-bottom: 1px solid rgba(var(--rgb-primary-text-color), 0.15);
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
      .result-icon {
        border-radius: 50%;
        color: #fff;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
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
