// ============================================================================
//  Matches Card – v0.3.100 (TypeScript)
//  Karta wyników 90minut.pl z gradientem RGBA + GUI-edytor dla Home Assistant
// ============================================================================

import { html, css, LitElement, TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./matches-card-editor";

// ============================
//  MatchesCard – Główna karta
// ============================

@customElement("matches-card")
export class MatchesCard extends LitElement {
  @property({ attribute: false }) hass: any;
  @property({ type: Object }) config: any;

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
    if (!config.entity) throw new Error("Entity is required");
    this.config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      fill: "gradient", // gradient | zebra | none
      show_result_symbol: true,
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config,
    };
  }

  render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) return nothing;

    const entity = this.hass.states[this.config.entity];
    if (!entity) return html`<ha-card>Nie znaleziono encji</ha-card>`;

    const matches = entity.attributes.matches || [];
    const zebraCSS =
      this.config.fill === "zebra"
        ? `tr:nth-child(even){background-color:rgba(240,240,240,0.4);}`
        : "";
    const separatorCSS = `tr{border-bottom:1px solid rgba(0,0,0,0.1);}`;

    const rows = matches
      .map((m: any) => {
        const date = m.date ? new Date(m.date.replace(" ", "T")) : null;
        const dateStr = date
          ? date.toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
            })
          : "-";
        const timeStr = m.finished
          ? "KONIEC"
          : date
          ? date.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        const resultClass =
          m.result === "win"
            ? "row-win"
            : m.result === "loss"
            ? "row-loss"
            : m.result === "draw"
            ? "row-draw"
            : "";

        const homeBold =
          m.result === "win" ? "bold" : m.result === "loss" ? "dim" : "";
        const awayBold =
          m.result === "loss" ? "bold" : m.result === "win" ? "dim" : "";

        const [homeScore, awayScore] = (m.score || "-").split("-");

        const leagueIcon =
          m.league === "L"
            ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png"
            : m.league === "PP"
            ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png"
            : null;

        const color = this.config.colors[m.result] || "rgba(0,0,0,0)";
        const fillStyle =
          this.config.fill === "gradient"
            ? `background: linear-gradient(to right, rgba(0,0,0,0) ${
                this.config.gradient.start
              }%, ${this.hexToRgba(color, this.config.gradient.alpha)} ${
                this.config.gradient.end
              }%);`
            : "";

        return html`
          <tr class="${resultClass}" style="${fillStyle}">
            <td>
              <div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
              <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div>
            </td>
            <td>
              ${leagueIcon
                ? html`<img
                    src="${leagueIcon}"
                    height="${this.config.icon_size.league}"
                    style="display:block;margin:auto;"
                  />`
                : m.league || "-"}
            </td>
            ${this.config.show_logos
              ? html`<td>
                  <img
                    src="${m.logo_home}"
                    height="${this.config.icon_size.crest}"
                    style="background:white;border-radius:6px;padding:2px;"
                  /><br />
                  <img
                    src="${m.logo_away}"
                    height="${this.config.icon_size.crest}"
                    style="background:white;border-radius:6px;padding:2px;"
                  />
                </td>`
              : ""}
            <td class="team-cell">
              <div
                class="team-row ${homeBold}"
                style="font-size:${this.config.font_size.teams}em;"
              >
                ${m.home}
              </div>
              <div
                class="team-row ${awayBold}"
                style="font-size:${this.config.font_size.teams}em;"
              >
                ${m.away}
              </div>
            </td>
            <td>
              <div class="${homeBold}">${homeScore}</div>
              <div class="${awayBold}">${awayScore}</div>
            </td>
            <td>
              ${this.config.show_result_symbol && m.result
                ? html`<div
                    class="result-circle"
                    style="background-color:${this.config.colors[m.result]}"
                  >
                    ${m.result.charAt(0).toUpperCase()}
                  </div>`
                : ""}
            </td>
          </tr>
        `;
      })
      .join("");

    return html`
      <ha-card>
        ${this.config.show_name
          ? html`<h1 class="card-header">${this.config.name}</h1>`
          : ""}
        <table>
          <style>
            ${zebraCSS}${separatorCSS}
          </style>
          ${rows}
        </table>
      </ha-card>
    `;
  }

  hexToRgba(hex: string, alpha: number): string {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    hex = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m, r, g, b) => r + r + g + g + b + b
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)},${parseInt(
          result[2],
          16
        )},${parseInt(result[3], 16)},${alpha})`
      : hex;
  }
}

// ===========================================
//  Rejestracja karty i edytora dla Lovelace
// ===========================================

import { MatchesCardEditor } from "./matches-card-editor";

if (!customElements.get("matches-card-editor")) {
  customElements.define("matches-card-editor", MatchesCardEditor);
}

(window as any).MatchesCard = MatchesCard;
(window as any).MatchesCardEditor = MatchesCardEditor;

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Karta wyników 90minut.pl z gradientem RGBA i GUI-edytorem",
});

console.info(
  "%c⚽ Matches Card loaded successfully",
  "color: white; background: #007bff; padding: 4px 8px; border-radius: 4px;"
);