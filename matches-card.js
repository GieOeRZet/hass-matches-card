/*************************************************************************************************
 * 90MINUT MATCHES CARD — v0.6_gui-modern
 * Author: GieOeRZet
 *
 * ✅ Nowoczesny GUI edytor (ha-textfield, ha-select, ha-switch, ha-entity-picker)
 * ✅ W pełni kompatybilny z najnowszym frontendem HA
 * ✅ Naprzemienne wiersze (ciemniejszy/jaśniejszy)
 * ✅ Dwa herby, nazwy drużyn w dwóch liniach
 * ✅ Konfigurowalne fonty, kolory, szerokości kolumn, ikonki
 **************************************************************************************************/

// ========== [1] NOWOCZESNY GUI EDITOR ==========

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
      if (!this._hass || !this._config) return;

      const c = this._config;
      const style = `
        <style>
          ha-select, ha-textfield { width: 100%; }
          .section { margin: 12px 0; padding: 6px 0; border-top: 1px solid var(--divider-color); }
          .section h4 { margin: 6px 0; font-weight: 600; font-size: 14px; }
        </style>
      `;

      this.innerHTML = `
        ${style}
        <div class="card-config">
          <ha-entity-picker
            label="Sensor (90minut)"
            .hass=${this._hass}
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

          <div class="section">
            <ha-switch .checked=${c.show_logos} @change=${(e)=>this._update("show_logos", e.target.checked)}>
              Pokaż herby
            </ha-switch>
            <ha-switch .checked=${c.full_team_names} @change=${(e)=>this._update("full_team_names", e.target.checked)}>
              Pełne nazwy drużyn
            </ha-switch>
          </div>

          <div class="section">
            <h4>Wyrównanie nazw drużyn</h4>
            <ha-select
              .value=${c.team_align || "left"}
              label="Wyrównanie"
              @selected=${(e)=>this._update("team_align", e.target.value)}>
              <mwc-list-item value="left">Lewo</mwc-list-item>
              <mwc-list-item value="center">Środek</mwc-list-item>
              <mwc-list-item value="right">Prawo</mwc-list-item>
            </ha-select>
          </div>

          <div class="section">
            <h4>Szerokości kolumn (%)</h4>
            ${this._numberField("Data", "columns_pct.date", c.columns_pct?.date)}
            ${this._numberField("Liga", "columns_pct.league", c.columns_pct?.league)}
            ${this._numberField("Herb", "columns_pct.crest", c.columns_pct?.crest)}
            ${this._numberField("Wynik", "columns_pct.score", c.columns_pct?.score)}
            ${this._numberField("Rezultat", "columns_pct.result", c.columns_pct?.result)}
          </div>

          <div class="section">
            <h4>Rozmiary czcionek (em)</h4>
            ${this._numberField("Data", "font_size.date", c.font_size?.date)}
            ${this._numberField("Drużyny", "font_size.teams", c.font_size?.teams)}
            ${this._numberField("Wynik", "font_size.score", c.font_size?.score)}
            ${this._numberField("Status", "font_size.status", c.font_size?.status)}
            ${this._numberField("Litera W/P/R", "font_size.result_letter", c.font_size?.result_letter)}
          </div>

          <div class="section">
            <h4>Rozmiary ikon (px)</h4>
            ${this._numberField("Liga", "icon_size.league", c.icon_size?.league)}
            ${this._numberField("Herb", "icon_size.crest", c.icon_size?.crest)}
            ${this._numberField("Rezultat", "icon_size.result", c.icon_size?.result)}
          </div>
        </div>
      `;
    }

    _numberField(label, path, value) {
      return `<ha-textfield type="number" label="${label}" .value=${value ?? ""} @input=${(e)=>this._updatePath(path, Number(e.target.value))}></ha-textfield>`;
    }

    _update(prop, val) {
      this._config = { ...this._config, [prop]: val };
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    }

    _updatePath(path, val) {
      const parts = path.split(".");
      let obj = this._config;
      while (parts.length > 1) {
        const key = parts.shift();
        obj[key] = obj[key] || {};
        obj = obj[key];
      }
      obj[parts[0]] = val;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
    }
  }

  customElements.define("matches-card-editor", MatchesCardEditor);
}

// ========== [2] GŁÓWNA KARTA ==========

class MatchesCard extends HTMLElement {
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
      icon_size: { league: 26, crest: 24, result: 26 },
      columns_pct: { date: 20, league: 10, crest: 15, score: 14, result: 7 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" }
    };
  }

  setConfig(config) {
    this._config = { ...MatchesCard.getStubConfig(), ...config };
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
    const c = this._config;

    const style = `
      <style>
        ha-card {
          border-radius: 12px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          padding: 6px;
        }
        .header { font-weight: 600; padding: 8px 12px; font-size: 1.1em; }

        .row {
          display: grid;
          grid-template-columns:
            ${c.columns_pct.date}% ${c.columns_pct.league}% ${c.columns_pct.crest}% auto
            ${c.columns_pct.score}% ${c.columns_pct.result}%;
          align-items: center;
          padding: 8px;
        }
        .row:nth-child(odd) { background: rgba(var(--rgb-primary-text-color), 0.03); }
        .row:nth-child(even){ background: rgba(var(--rgb-primary-text-color), 0.07); }

        .date { text-align:center; font-size:${c.font_size.date}em; display:flex; flex-direction:column; }
        .league, .score, .result { text-align:center; display:flex; align-items:center; justify-content:center; }
        .crest-col { display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .team-logo { width:${c.icon_size.crest}px; height:${c.icon_size.crest}px; object-fit:contain; margin:1px 0; background:white; border-radius:4px; }
        .teams { text-align:${c.team_align}; display:flex; flex-direction:column; font-size:${c.font_size.teams}em; line-height:1.25em; padding-left:6px; }
        .score-text { font-size:${c.font_size.score}em; font-weight:bold; }
        .result-icon { width:${c.icon_size.result}px; height:${c.icon_size.result}px; border-radius:50%; color:#fff; font-size:${c.font_size.result_letter}em; display:flex; align-items:center; justify-content:center; font-weight:600; }
        .win { background:${c.colors.win}; } .loss { background:${c.colors.loss}; } .draw { background:${c.colors.draw}; }
        .no-data { text-align:center; padding:10px; color:var(--secondary-text-color); }
      </style>
    `;

    if (!matches.length) {
      this.innerHTML = `<ha-card><div class="header">${title}</div>${style}<div class="no-data">Brak danych</div></ha-card>`;
      return;
    }

    const rows = matches.map((m) => {
      const resClass = m.result === "win" ? "win" : m.result === "draw" ? "draw" : m.result === "loss" ? "loss" : "";
      const resLetter = m.result === "win" ? "W" : m.result === "draw" ? "R" : m.result === "loss" ? "P" : "";
      const leagueIcon = m.league === "PP"
        ? "https://img.sofascore.com/api/v1/unique-tournament/281/image"
        : "https://img.sofascore.com/api/v1/unique-tournament/202/image";

      return `
        <div class="row">
          <div class="date">
            <div>${m.date?.split(" ")[0] || ""}</div>
            <div style="font-size:${c.font_size.status}em;">${m.finished ? "Koniec" : "Nadchodzi"}</div>
          </div>
          <div class="league"><img src="${leagueIcon}" width="${c.icon_size.league}"></div>
          <div class="crest-col">
            ${c.show_logos && m.logo_home ? `<img src="${m.logo_home}" class="team-logo">` : ""}
            ${c.show_logos && m.logo_away ? `<img src="${m.logo_away}" class="team-logo">` : ""}
          </div>
          <div class="teams">
            <div>${m.home}</div>
            <div>${m.away}</div>
          </div>
          <div class="score"><div class="score-text">${m.score || "-"}</div></div>
          <div class="result">${resLetter ? `<div class="result-icon ${resClass}">${resLetter}</div>` : ""}</div>
        </div>`;
    }).join("");

    this.innerHTML = `<ha-card><div class="header">${title}</div>${style}${rows}</ha-card>`;
  }
}

customElements.define("matches-card", MatchesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "90minut Matches Card",
  description: "Karta 90minut.pl w stylu Sofascore (pełny nowoczesny GUI, bez hovera, naprzemienne wiersze)"
});