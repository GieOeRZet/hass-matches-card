/*********************************************************************
 *  MATCHES CARD (v0.2_b)
 *  Autor: Roman (GieOeRZet)
 *  Opis:  Karta wyników meczów w stylu Sofascore
 *         Z obsługą GUI edytora (dynamiczny import)
 *********************************************************************/

// === SEKCJA IMPORTÓW ===
class MatchesCard extends HTMLElement {
  static getConfigElement() {
    if (!customElements.get("matches-card-editor")) {
      import("./matches-card-editor.js");
    }
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return { entity: "", name: "Matches Card" };
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Wybierz encję sensora z 90minut");
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  // === SEKCJA RENDEROWANIA ===
  render() {
    if (!this._hass || !this.config) return;
    const entity = this._hass.states[this.config.entity];
    if (!entity) {
      this.innerHTML = `<ha-card>Nie znaleziono encji ${this.config.entity}</ha-card>`;
      return;
    }

    const matches = entity.attributes.matches || [];
    if (!matches.length) {
      this.innerHTML = `<ha-card>Brak danych o meczach</ha-card>`;
      return;
    }

    const zebraA = "rgba(255,255,255,0.03)";
    const zebraB = "rgba(255,255,255,0.06)";

    let html = `
      <ha-card>
        <style>
          ha-card {
            font-family: var(--primary-font-family);
            padding: 8px 0;
          }
          .match {
            display: grid;
            grid-template-columns: 
              ${this.config.columns_pct?.date || 10}% 
              ${this.config.columns_pct?.league || 10}% 
              ${this.config.columns_pct?.crest || 12}% 
              auto 
              ${this.config.columns_pct?.score || 12}% 
              ${this.config.columns_pct?.result || 6}%;
            align-items: center;
            padding: 6px 10px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .match:nth-child(even) { background: ${zebraA}; }
          .match:nth-child(odd)  { background: ${zebraB}; }

          .cell { text-align: center; }
          .teams { text-align: left; }

          .cell.crest img {
            width: ${this.config.icon_size?.crest || 26}px;
            height: ${this.config.icon_size?.crest || 26}px;
            object-fit: contain;
            background: white;
            border-radius: 6px;
            padding: 2px;
          }

          .cell.league img {
            width: ${this.config.icon_size?.league || 24}px;
            height: ${this.config.icon_size?.league || 24}px;
          }

          .cell.result span {
            display: inline-block;
            background: var(--result-bg, gray);
            color: white;
            border-radius: 50%;
            width: ${this.config.icon_size?.result || 26}px;
            height: ${this.config.icon_size?.result || 26}px;
            line-height: ${this.config.icon_size?.result || 26}px;
            font-weight: bold;
          }

          .winner { font-weight: 700; }
          .loser  { opacity: 0.7; }
        </style>
    `;

    matches.forEach((m, i) => {
      const resColor =
        m.result === "win"
          ? this.config.colors?.win || "#3ba55d"
          : m.result === "loss"
          ? this.config.colors?.loss || "#e23b3b"
          : this.config.colors?.draw || "#468cd2";

      html += `
        <div class="match" style="--result-bg:${resColor}">
          <div class="cell date">
            <div>${m.date.split(" ")[0]}</div>
            <div style="font-size:0.8em;opacity:0.7;">${
              m.finished ? "Koniec" : m.date.split(" ")[1]
            }</div>
          </div>
          <div class="cell league">
            <img src="${
              m.league === "L"
                ? "https://img.sofascore.com/api/v1/unique-tournament/202/image"
                : "https://img.sofascore.com/api/v1/unique-tournament/281/image"
            }">
          </div>
          <div class="cell crest">
            <img src="${m.logo_home || ""}">
            <img src="${m.logo_away || ""}">
          </div>
          <div class="cell teams">
            <div class="${m.result === "win" ? "winner" : ""}">${m.home}</div>
            <div class="${m.result === "loss" ? "loser" : ""}">${m.away}</div>
          </div>
          <div class="cell score">
            <div>${m.score.split("-")[0] || "-"}</div>
            <div>${m.score.split("-")[1] || "-"}</div>
          </div>
          <div class="cell result"><span>${
            m.result === "win" ? "W" : m.result === "loss" ? "P" : "R"
          }</span></div>
        </div>`;
    });

    html += `</ha-card>`;
    this.innerHTML = html;
  }
}

// --- Rejestracja karty w HA ---
if (!customElements.get("matches-card")) {
  customElements.define("matches-card", MatchesCard);
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Karta wyników 90minut.pl w stylu Sofascore"
});