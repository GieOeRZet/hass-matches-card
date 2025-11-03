import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import "./matches-card-editor";

interface MatchData {
  home: string;
  away: string;
  date: string;
  time: string;
  logo_home?: string;
  logo_away?: string;
  result?: string;
  colors?: Record<string, string>;
}

export class MatchesCard extends LitElement {
  @property({ attribute: false }) public hass: any;
  @property({ type: Object }) public config: any;

  static styles = css`
    ha-card {
      padding: 10px 0;
      font-family: "Sofascore Sans", Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td {
      text-align: center;
      vertical-align: middle;
      padding: 4px 6px;
    }
    .team-cell {
      text-align: left;
      vertical-align: middle;
      padding-left: 8px;
    }
    .team-row {
      display: flex;
      align-items: center;
      line-height: 1.3em;
    }
    .bold {
      font-weight: 600;
    }
    .dim {
      opacity: 0.8;
    }
    .result-circle {
      border-radius: 50%;
      width: 26px;
      height: 26px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin: 0 auto;
    }
  `;

  setConfig(config: any): void {
    if (!config.entity) throw new Error("Wymagane jest pole 'entity'");
    this.config = {
      name: "Nadchodzące mecze",
      show_name: true,
      show_logos: true,
      show_result_symbol: true,
      fill: "gradient",
      font_size: { teams: 1 },
      icon_size: { crest: 40 },
      colors: { W: "#009900", D: "#999999", L: "#cc0000" },
      ...config,
    };
  }

  get matches(): MatchData[] {
    if (!this.hass || !this.config?.entity) return [];
    const entity = this.hass.states[this.config.entity];
    return entity?.attributes?.matches || [];
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const matches = this.matches || [];
    if (matches.length === 0) return html`<ha-card>Pusto – brak meczów.</ha-card>`;

    const rows = matches.map((t: MatchData) => {
      const resultClassHome = t.result === "W" ? "bold" : "dim";
      const resultClassAway = t.result === "L" ? "bold" : "dim";
      const gradient = this.config.fill === "gradient"
        ? `background: linear-gradient(90deg, ${this.hexToRgba("#000", 0.04)}, ${this.hexToRgba("#000", 0.0)});`
        : "";

      return html`
        <tr style="${gradient}">
          <td>${t.date}<br />${t.time}</td>
          ${this.config.show_logos
            ? html`
              <td>
                <img src="${t.logo_home}" height="${this.config.icon_size.crest}"
                     style="background:white;border-radius:6px;padding:2px;" /><br />
                <img src="${t.logo_away}" height="${this.config.icon_size.crest}"
                     style="background:white;border-radius:6px;padding:2px;" />
              </td>`
            : ""}
          <td class="team-cell">
            <div class="team-row ${resultClassHome}" style="font-size:${this.config.font_size.teams}em;">${t.home}</div>
            <div class="team-row ${resultClassAway}" style="font-size:${this.config.font_size.teams}em;">${t.away}</div>
          </td>
          <td>
            <div class="${resultClassHome}">${t.result === "W" ? "3" : ""}</div>
            <div class="${resultClassAway}">${t.result === "L" ? "0" : ""}</div>
          </td>
          <td>
            ${this.config.show_result_symbol && t.result
              ? html`
                <div class="result-circle"
                     style="background-color:${this.config.colors[t.result]}">
                  ${t.result.charAt(0).toUpperCase()}
                </div>`
              : ""}
          </td>
        </tr>
      `;
    });

    return html`
      <ha-card>
        ${this.config.show_name ? html`<h1 class="card-header">${this.config.name}</h1>` : ""}
        <table>
          ${rows}
        </table>
      </ha-card>
    `;
  }

  hexToRgba(hex: string, alpha: number): string {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    hex = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => r + r + g + g + b + b
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
      : hex;
  }
}

// 🧩 Jawna rejestracja kart i edytora (ważne dla HA)
if (!customElements.get("matches-card")) {
  customElements.define("matches-card", MatchesCard);
}

import { MatchesCardEditor } from "./matches-card-editor";

if (!customElements.get("matches-card-editor")) {
  customElements.define("matches-card-editor", MatchesCardEditor);
}

// 🪣 Rejestracja w katalogu kart Lovelace
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Karta wyników 90minut.pl z gradientem RGBA i edytorem GUI",
});