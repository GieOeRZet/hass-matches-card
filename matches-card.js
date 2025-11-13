// ============================================================================
//  Matches Card (90minut) – v0.3.506 (restored clean version)
//  Author: GieOeRZet
//  Notes:
//    - Removed light/dark mode – inherits HA theme fully
//    - Stable layout, working zebra + gradient
//    - This is the working version BEFORE later refactors
// ============================================================================

class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required.");

    this.config = {
      name: config.name || "90minut Matches",
      show_name: config.show_name ?? true,
      show_logos: config.show_logos ?? true,
      full_team_names: config.full_team_names ?? true,
      show_result_symbols: config.show_result_symbols ?? true,
      fill_mode: config.fill_mode || "gradient", // gradient, zebra, clear

      font_size: {
        date: config.font_size?.date || 0.9,
        status: config.font_size?.status || 0.8,
        teams: config.font_size?.teams || 1.0,
        score: config.font_size?.score || 1.0,
      },

      icon_size: {
        league: config.icon_size?.league || 26,
        crest: config.icon_size?.crest || 24,
        result: config.icon_size?.result || 26,
      },

      zebra_color: config.zebra_color || "#f0f0f0",

      gradient: {
        win: config.gradient?.win || "#009900",
        draw: config.gradient?.draw || "#888888",
        loss: config.gradient?.loss || "#cc0000",
        alpha: config.gradient?.alpha || 0.55,
      }
    };

    this.entity = config.entity;
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._hass) return;

    const entity = this._hass.states[this.entity];
    if (!entity) {
      this.innerHTML = "<ha-card>Błąd: encja nie istnieje.</ha-card>";
      return;
    }

    const data = entity.attributes.matches || [];

    let html = `
      <ha-card>
        ${this.config.show_name ? `<h2 style='margin:8px 0 12px 14px;'>${this.config.name}</h2>` : ""}
        <table style="width:100%; border-collapse:collapse;">
    `;

    data.forEach((m, idx) => {
      const bg = this._rowBackground(m, idx);
      const score = this._score(m);

      html += `
        <tr style="background:${bg};">
          <td style="padding:2px 3px; width:62px; font-size:${this.config.font_size.date}rem;">${m.date}</td>
          <td style="padding:2px 3px; width:54px; font-size:${this.config.font_size.status}rem;">${m.status}</td>

          <td style="padding:2px 3px; white-space:nowrap; font-size:${this.config.font_size.teams}rem;">
            ${this.config.show_logos ? this._crest(m.home_logo) : ""}
            ${m.home}
          </td>

          <td style="padding:2px 3px; width:36px; text-align:center; font-size:${this.config.font_size.score}rem;">
            ${score}
          </td>

          <td style="padding:2px 3px; white-space:nowrap; font-size:${this.config.font_size.teams}rem;">
            ${this.config.show_logos ? this._crest(m.away_logo) : ""}
            ${m.away}
          </td>
        </tr>
      `;
    });

    html += `</table></ha-card>`;
    this.innerHTML = html;
  }

  _score(m) {
    if (!m.score) return "-";
    const [h, a] = m.score.split(":");
    return `<div>${h}<br>${a}</div>`;
  }

  _crest(path) {
    if (!path) return "";
    return `<img src="${path}" style="width:${this.config.icon_size.crest}px; vertical-align:middle; margin-right:4px;">`;
  }

  _rowBackground(m, idx) {
    if (this.config.fill_mode === "clear") return "transparent";

    if (this.config.fill_mode === "zebra")
      return idx % 2 === 0 ? this.config.zebra_color : "transparent";

    if (this.config.fill_mode === "gradient" && m.result) {
      const col = m.result === "W" ? this.config.gradient.win :
                  m.result === "D" ? this.config.gradient.draw :
                                      this.config.gradient.loss;
      return `linear-gradient(90deg, ${col}${this._alpha()} 0%, transparent 100%)`;
    }

    return "transparent";
  }

  _alpha() {
    const a = Math.round(this.config.gradient.alpha * 255).toString(16).padStart(2, "0");
    return a;
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "sensor.90minut_gornik_zabrze_matches"
    };
  }
}

customElements.define("matches-card", MatchesCard);
