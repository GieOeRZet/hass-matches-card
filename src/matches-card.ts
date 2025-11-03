import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./matches-card-editor";

const LOGO_BASE = "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo";
const LEAGUE_LOGOS: Record<string, string> = {
  L: `${LOGO_BASE}/ekstraklasa.png`,
  PP: `${LOGO_BASE}/puchar.png`,
};

@customElement("matches-card")
export class MatchesCard extends LitElement {
  @property({ attribute: false }) hass: any;
  @state() private config: any;

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
    tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .result-circle {
      border-radius: 50%;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
  `;

  setConfig(config: any): void {
    if (!config.entity) throw new Error("Entity is required");
    this.config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      fill: "gradient",
      show_result_symbol: true,
      font_size: { date: 0.9, status: 0.8, teams: 1, score: 1 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config,
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const entity = this.hass.states[this.config.entity];
    const matches = entity?.attributes?.matches || [];
    return html`
      <ha-card header=${this.config.show_name ? this.config.name || "" : ""}>
        <table>
          ${matches.map((m: any) => this.renderRow(m))}
        </table>
      </ha-card>
    `;
  }

  private renderRow(m: any) {
    const c = this.config;
    const date = m.date ? new Date(m.date.replace(" ", "T")) : null;
    const dStr = date ? date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" }) : "-";
    const timeStr = m.finished ? "KONIEC" : date ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }) : "";

    const color = c.colors[m.result ?? ""] || "rgba(0,0,0,0)";
    const bg =
      c.fill === "gradient"
        ? `background: linear-gradient(to right, rgba(0,0,0,0) ${c.gradient.start}%, ${this.hexToRgba(color, c.gradient.alpha)} ${c.gradient.end}%);`
        : "";

    const leagueLogo = LEAGUE_LOGOS[m.league ?? ""] ?? null;
    const [homeScore, awayScore] = (m.score || "-").split("-");
    const classHome = m.result === "win" ? "bold" : m.result === "loss" ? "dim" : "";
    const classAway = m.result === "loss" ? "bold" : m.result === "win" ? "dim" : "";

    return html`
      <tr style=${bg}>
        <td>
          <div style="font-size:${c.font_size.date}em">${dStr}</div>
          <div style="font-size:${c.font_size.status}em">${timeStr}</div>
        </td>
        <td>
          ${leagueLogo
            ? html`<img src="${leagueLogo}" height="${c.icon_size.league}" style="display:block;margin:auto" />`
            : m.league || "-"}
        </td>
        ${c.show_logos
          ? html`<td>
              <img src="${m.logo_home}" height="${c.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;display:block;margin:auto" />
              <img src="${m.logo_away}" height="${c.icon_size.crest}" style="background:white;border-radius:6px;padding:2px;display:block;margin:auto" />
            </td>`
          : ""}
        <td class="team-cell">
          <div class="team-row ${classHome}" style="font-size:${c.font_size.teams}em">${m.home}</div>
          <div class="team-row ${classAway}" style="font-size:${c.font_size.teams}em">${m.away}</div>
        </td>
        <td>
          <div class="${classHome}">${homeScore}</div>
          <div class="${classAway}">${awayScore}</div>
        </td>
        <td>
          ${c.show_result_symbol && m.result
            ? html`<div class="result-circle" style="width:${c.icon_size.result}px;height:${c.icon_size.result}px;background:${c.colors[m.result]}">
                ${m.result.charAt(0).toUpperCase()}
              </div>`
            : ""}
        </td>
      </tr>
    `;
  }

  private hexToRgba(hex: string, alpha: number) {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res ? `rgba(${parseInt(res[1], 16)}, ${parseInt(res[2], 16)}, ${parseInt(res[3], 16)}, ${alpha})` : hex;
  }

  static async getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return { entity: "sensor.matches_today" };
  }
}

// 🔹 Rejestracja karty w GUI Lovelace
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "matches-card",
  name: "Matches Card",
  description: "Karta pokazująca mecze z ligi, z graficznym edytorem.",
  preview: true,
});
