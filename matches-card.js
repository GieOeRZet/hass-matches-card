class MatchesCard extends HTMLElement {
  static get properties() {
    return {
      hass: {},
      _config: {}
    };
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return { entity: "", show_logos: true, hover_enabled: false };
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this._config = {
      name: "90minut Matches",
      show_logos: true,
      hover_enabled: false,
      hover_shadow_color: "rgba(0,0,0,0.2)",
      alignment: "left",
      font_size: 14,
      column_widths: {
        date: 12,
        league: 8,
        logo: 12,
        score: 10,
        result: 8
      },
      ...config
    };
    this.style.display = "block";
  }

  getCardSize() {
    return 4;
  }

  render() {
    if (!this.hass) return;
    const entity = this.hass.states[this._config.entity];
    if (!entity) return this._createInfo("No data available");
    const data = entity.attributes.matches || [];

    if (data.length === 0)
      return this._createInfo(
        this._localize("card.no_data") || "No data available"
      );

    const style = this._getStyle();

    const rows = data.map((match) => {
      const isFinished = match.finished;
      const res = match.result;
      const resultColor =
        res === "win"
          ? "var(--color-win, #0bb32a)"
          : res === "loss"
          ? "var(--color-loss, #cb1818)"
          : res === "draw"
          ? "var(--color-draw, #a4a9b3)"
          : "var(--secondary-text-color)";

      return `
        <div class="match-row ${this._config.hover_enabled ? "hoverable" : ""}">
          <div class="col date">${match.date || ""}</div>
          <div class="col league"><img class="league-icon" src="${
            match.league === "L"
              ? "https://img.sofascore.com/api/v1/unique-tournament/202/image"
              : "https://img.sofascore.com/api/v1/unique-tournament/281/image"
          }"></div>
          <div class="col logo">
            ${
              this._config.show_logos
                ? `<img class="team-logo" src="${match.logo_home || ""}" />`
                : ""
            }
          </div>
          <div class="col teams" style="text-align: ${this._config.alignment}">
            <div class="home" style="${
              match.result === "win" && match.home === "Górnik Zabrze"
                ? "font-weight:700"
                : ""
            }">${match.home}</div>
            <div class="away" style="${
              match.result === "win" && match.away === "Górnik Zabrze"
                ? "font-weight:700"
                : ""
            }">${match.away}</div>
          </div>
          <div class="col score">
            <div>${match.score && match.score !== "-" ? match.score : ""}</div>
          </div>
          <div class="col result">
            ${
              isFinished && res
                ? `<div class="result-icon" style="background-color:${resultColor}">
                     <span>${res.charAt(0).toUpperCase()}</span>
                   </div>`
                : ""
            }
          </div>
        </div>`;
    });

    return `
      <ha-card>
        <div class="card-header">${this._config.name}</div>
        <div class="matches-table">${rows.join("")}</div>
        <style>${style}</style>
      </ha-card>
    `;
  }

  _createInfo(text) {
    return `<ha-card><div class="card-content">${text}</div></ha-card>`;
  }

  _getStyle() {
    const c = this._config.column_widths;
    const hoverShadow = this._config.hover_shadow_color;
    const fs = this._config.font_size;

    return `
      ha-card {
        padding: 8px 0;
        font-size: ${fs}px;
      }
      .matches-table {
        display: flex;
        flex-direction: column;
      }
      .match-row {
        display: grid;
        grid-template-columns: ${c.date}% ${c.league}% ${c.logo}% auto ${c.score}% ${c.result}%;
        align-items: center;
        padding: 6px 10px;
        border-bottom: 1px solid var(--divider-color);
        transition: box-shadow 0.2s ease, background 0.2s ease;
      }
      .match-row.hoverable:hover {
        background: var(--ha-card-background, rgba(0,0,0,0.05));
        box-shadow: 0 2px 8px ${hoverShadow};
      }
      .col {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .col.logo, .col.league, .col.result, .col.score {
        align-items: center;
      }
      .league-icon {
        width: 24px;
        height: 24px;
      }
      .team-logo {
        width: 28px;
        height: 28px;
        border-radius: 4px;
        object-fit: contain;
      }
      .result-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
      }
      .home, .away {
        line-height: 1.3;
      }
    `;
  }

  _localize(key) {
    const lang = (this.hass?.language || "en").split("-")[0];
    const translations =
      MatchesCard.translations?.[lang] || MatchesCard.translations?.en;
    return translations?.card?.[key] || key;
  }

  set hass(hass) {
    this._hass = hass;
    this.innerHTML = this.render();
  }
}

customElements.define("matches-card", MatchesCard);
