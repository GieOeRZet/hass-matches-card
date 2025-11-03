import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";

interface MatchItem {
  date?: string;
  league?: string;
  logo_home?: string;
  logo_away?: string;
  home?: string;
  away?: string;
  score?: string;
  result?: "win" | "loss" | "draw" | "";
  finished?: boolean;
}

interface MatchesCardConfig {
  entity: string;
  name?: string;
  show_name?: boolean;
  show_logos?: boolean;
  show_result_symbol?: boolean;
  fill?: "gradient" | "zebra" | "none";
  font_size?: {
    date: number;
    status: number;
    teams: number;
    score: number;
  };
  icon_size?: {
    league: number;
    crest: number;
    result: number;
  };
  gradient?: {
    alpha: number;
    start: number;
    end: number;
  };
  colors?: {
    win: string;
    loss: string;
    draw: string;
  };
}

const LEAGUE_LOGOS: Record<string, string> = {
  L: "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png",
  PP: "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png",
};

export class MatchesCard extends LitElement {
  @property({ attribute: false }) hass: any;
  @property({ attribute: false }) config!: MatchesCardConfig;

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

  setConfig(config: MatchesCardConfig) {
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
    if (!entity) {
      return html`<ha-card>Brak danych dla encji: ${this.config.entity}</ha-card>`;
    }

    const matches: MatchItem[] = entity.attributes.matches || [];
    const showHeader = this.config.show_name && (this.config.name || "90minut Matches");

    return html`
      <ha-card header="${showHeader ? this.config.name : nothing}">
        <table>
          ${matches.map((m) => this.renderRow(m))}
        </table>
      </ha-card>
    `;
  }

  renderRow(match: MatchItem) {
    const cfg = this.config;
    const dateObj = match.date ? new Date(match.date.replace(" ", "T")) : null;
    const date = dateObj ? dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" }) : "-";
    const time = match.finished ? "KONIEC" : dateObj ? dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }) : "";

    const color = cfg.colors?.[match.result ?? ""] || "rgba(0,0,0,0)";
    const background =
      cfg.fill === "gradient"
        ? `background: linear-gradient(to right, rgba(0,0,0,0) ${cfg.gradient?.start}%, ${this.hexToRgba(
            color,
            cfg.gradient?.alpha ?? 0.5
          )} ${cfg.gradient?.end}%);`
        : cfg.fill === "zebra"
        ? `background: rgba(0,0,0,0.05);`
        : "";

    const leagueLogo = LEAGUE_LOGOS[match.league ?? ""] ?? null;
    const [scoreHome, scoreAway] = (match.score || "-").split("-");

    const winClass = match.result === "win" ? "bold" : match.result === "loss" ? "dim" : "";
    const lossClass = match.result === "loss" ? "bold" : match.result === "win" ? "dim" : "";

    return html`
      <tr style="${background}">
        <td>
          <div style="font-size:${cfg.font_size?.date}em">${date}</div>
          <div style="font-size:${cfg.font_size?.status}em">${time}</div>
        </td>
        <td>
          ${leagueLogo
            ? html`<img src="${leagueLogo}" height="${cfg.icon_size?.league}" style="display:block;margin:auto;" />`
            : match.league ?? "-"}
        </td>
        ${cfg.show_logos
          ? html`
              <td>
                <img src="${match.logo_home}" height="${cfg.icon_size?.crest}" style="background:white;border-radius:6px;padding:2px;display:block;margin:auto;" />
                <img src="${match.logo_away}" height="${cfg.icon_size?.crest}" style="background:white;border-radius:6px;padding:2px;display:block;margin:auto;" />
              </td>
            `
          : nothing}
        <td class="team-cell">
          <div class="team-row ${winClass}" style="font-size:${cfg.font_size?.teams}em">${match.home}</div>
          <div class="team-row ${lossClass}" style="font-size:${cfg.font_size?.teams}em">${match.away}</div>
        </td>
        <td>
          <div class="${winClass}" style="font-size:${cfg.font_size?.score}em">${scoreHome}</div>
          <div class="${lossClass}" style="font-size:${cfg.font_size?.score}em">${scoreAway}</div>
        </td>
        <td>
          ${cfg.show_result_symbol && match.result
            ? html`<div
                class="result-circle"
                style="width:${cfg.icon_size?.result}px;height:${cfg.icon_size?.result}px;background:${cfg.colors?.[match.result]}"
              >
                ${match.result.charAt(0).toUpperCase()}
              </div>`
            : nothing}
        </td>
      </tr>
    `;
  }

  hexToRgba(hex: string, alpha: number) {
    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})` : hex;
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("matches-card", MatchesCard);
