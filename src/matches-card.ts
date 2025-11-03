import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("matches-card")
export class MatchesCard extends LitElement {
  @property({ attribute: false }) hass;
  @state() config;

  setConfig(config) {
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
    if (!this.hass || !this.config) return nothing;
    const entity = this.hass.states[this.config.entity];
    const matches = entity?.attributes?.matches || [];

    return html`
      <ha-card header=${this.config.show_name ? this.config.name || "" : nothing}>
        <table>
          ${matches.map((m) => this.renderRow(m))}
        </table>
      </ha-card>
    `;
  }

  renderRow(m) {
    const cfg = this.config;
    const dateObj = m.date ? new Date(m.date.replace(" ", "T")) : null;
    const date = dateObj
      ? dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" })
      : "-";
    const time = m.finished
      ? "KONIEC"
      : dateObj
      ? dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
      : "";

    const color = cfg.colors[m.result ?? ""] || "rgba(0,0,0,0)";
    const bg =
      cfg.fill === "gradient"
        ? `background: linear-gradient(to right, rgba(0,0,0,0) ${cfg.gradient.start}%, ${this.hexToRgba(
            color,
            cfg.gradient.alpha
          )} ${cfg.gradient.end}%);`
        : "";

    const [homeScore, awayScore] = (m.score || "-").split("-");
    const clsHome = m.result === "win" ? "bold" : m.result === "loss" ? "dim" : "";
    const clsAway = m.result === "loss" ? "bold" : m.result === "win" ? "dim" : "";

    return html`
      <tr style=${bg}>
        <td>
          <div style="font-size:${cfg.font_size.date}em">${date}</div>
          <div style="font-size:${cfg.font_size.status}em">${time}</div>
        </td>
        <td>
          ${m.league_logo
            ? html`<img src="${m.league_logo}" height="${cfg.icon_size.league}" />`
            : m.league || "-"}
        </td>
        ${cfg.show_logos
          ? html`<td>
              <img
                src="${m.logo_home}"
                height="${cfg.icon_size.crest}"
                style="background:white;border-radius:6px;padding:2px;display:block;margin:auto"
              />
              <img
                src="${m.logo_away}"
                height="${cfg.icon_size.crest}"
                style="background:white;border-radius:6px;padding:2px;display:block;margin:auto"
              />
            </td>`
          : nothing}
        <td class="team-cell">
          <div class="team-row ${clsHome}" style="font-size:${cfg.font_size.teams}em">${m.home}</div>
          <div class="team-row ${clsAway}" style="font-size:${cfg.font_size.teams}em">${m.away}</div>
        </td>
        <td>
          <div class="${clsHome}">${homeScore}</div>
          <div class="${clsAway}">${awayScore}</div>
        </td>
        <td>
          ${cfg.show_result_symbol && m.result
            ? html`<div
                class="result-circle"
                style="width:${cfg.icon_size.result}px;height:${cfg.icon_size.result}px;background:${cfg.colors[m.result]}"
              >
                ${m.result.charAt(0).toUpperCase()}
              </div>`
            : nothing}
        </td>
      </tr>
    `;
  }

  hexToRgba(hex, alpha) {
    const h = hex.replace(/^#/, "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

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
      line-height: 1.3em;
    }
    .bold {
      font-weight: 600;
    }
    .dim {
      opacity: 0.7;
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
}
