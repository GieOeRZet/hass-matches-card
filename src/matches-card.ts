/**
 * MatchesCard — custom Lovelace card
 * Author: Roman (GieOeRZet)
 * Repo: https://github.com/GieOeRZet/matches-card
 *
 * No decorators used — compatible with HA's Lit runtime.
 */
import {LitElement, html, css} from "lit";

type MatchItem = {
  date?: string;
  finished?: boolean;
  league?: string;
  home?: string;
  away?: string;
  score?: string;
  result?: "win" | "loss" | "draw";
  logo_home?: string;
  logo_away?: string;
};

type CardConfig = {
  type: string;
  entity: string;
  name?: string;
  show_name?: boolean;
  show_logos?: boolean;
  fill?: "gradient"|"zebra"|"none";
  show_result_symbol?: boolean;
  font_size?: {date:number; status:number; teams:number; score:number};
  icon_size?: {league:number; crest:number; result:number};
  gradient?: {alpha:number; start:number; end:number};
  colors?: {win:string; loss:string; draw:string};
  logos_base?: string;
};

const DEFAULTS: Partial<CardConfig> = {
  name: "90minut Matches",
  show_name: true,
  show_logos: true,
  fill: "gradient",
  show_result_symbol: true,
  font_size: {date: 0.9, status: 0.8, teams: 1.0, score: 1.0},
  icon_size: {league: 26, crest: 24, result: 26},
  gradient: {alpha: 0.5, start: 35, end: 100},
  colors: {win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2"},
  logos_base: "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo"
};

function leagueLogo(base: string, code?: string): string | null {
  if (!code) return null;
  const map: Record<string,string> = {
    "L": `${base}/ekstraklasa.png`,
    "PP": `${base}/puchar.png`
  };
  return map[code] || null;
}

export class MatchesCard extends LitElement {
  static get properties() {
    return {
      hass: {attribute: false},
      _config: {attribute: false}
    };
  }

  hass: any;
  private _config: CardConfig | undefined;

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
    .team-cell { text-align: left; padding-left: 8px; }
    .team-row { display: flex; align-items: center; line-height: 1.3em; }
    .bold { font-weight: 600; }
    .dim { opacity: 0.8; }
    tr { border-bottom: 1px solid rgba(0,0,0,.1); }
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

  setConfig(config: CardConfig) {
    if (!config.entity) throw new Error("Entity is required");
    this._config = {...DEFAULTS, ...config};
  }

  getCardSize() { return 3; }

  render() {
    if (!this.hass || !this._config) return html``;
    const stateObj = this.hass.states?.[this._config.entity];
    const matches: MatchItem[] = stateObj?.attributes?.matches || [];
    const header = this._config.show_name ? (this._config.name || "") : "";

    return html`
      <ha-card header=${header}>
        <table>
          ${matches.map((m) => this._row(m))}
        </table>
      </ha-card>
    `;
  }

  private _row(m: MatchItem) {
    const cfg = this._config!;
    const dt = m.date ? new Date(m.date.replace(" ", "T")) : null;
    const day = dt ? dt.toLocaleDateString("pl-PL", {day: "2-digit", month: "2-digit"}) : "-";
    const timeOrStatus = m.finished ? "KONIEC" : (dt ? dt.toLocaleTimeString("pl-PL", {hour: "2-digit", minute:"2-digit"}) : "");

    const color = (cfg.colors as any)[m.result || ""] || "rgba(0,0,0,0)";
    const bg = cfg.fill === "gradient"
      ? `background: linear-gradient(to right, rgba(0,0,0,0) ${cfg.gradient!.start}%, ${this._hex2rgba(color, cfg.gradient!.alpha)} ${cfg.gradient!.end}%);`
      : (cfg.fill === "zebra" ? `background: repeating-linear-gradient(90deg, rgba(0,0,0,.04), rgba(0,0,0,.04) 8px, transparent 8px, transparent 16px);` : "");

    const leagueImg = leagueLogo(cfg.logos_base!, m.league || undefined);
    const [homeScore, awayScore] = (m.score || "-").split("-");
    const homeClass = m.result === "win" ? "bold" : (m.result === "loss" ? "dim" : "");
    const awayClass = m.result === "loss" ? "bold" : (m.result === "win" ? "dim" : "");

    return html`
      <tr style=${bg}>
        <td>
          <div style="font-size:${cfg.font_size!.date}em">${day}</div>
          <div style="font-size:${cfg.font_size!.status}em">${timeOrStatus}</div>
        </td>
        <td>
          ${leagueImg
            ? html`<img src="${leagueImg}" height="${cfg.icon_size!.league}" style="display:block;margin:auto" />`
            : (m.league || "-")}
        </td>
        ${cfg.show_logos ? html`
          <td>
            <img src="${m.logo_home}" height="${cfg.icon_size!.crest}" style="background:white;border-radius:6px;padding:2px;display:block;margin:auto" />
            <img src="${m.logo_away}" height="${cfg.icon_size!.crest}" style="background:white;border-radius:6px;padding:2px;display:block;margin:auto" />
          </td>
        ` : html``}
        <td class="team-cell">
          <div class="team-row ${homeClass}" style="font-size:${cfg.font_size!.teams}em">${m.home}</div>
          <div class="team-row ${awayClass}" style="font-size:${cfg.font_size!.teams}em">${m.away}</div>
        </td>
        <td>
          <div class="${homeClass}" style="font-size:${cfg.font_size!.score}em">${homeScore}</div>
          <div class="${awayClass}" style="font-size:${cfg.font_size!.score}em">${awayScore}</div>
        </td>
        <td>
          ${cfg.show_result_symbol && m.result ? html`
            <div class="result-circle" style="width:${cfg.icon_size!.result}px;height:${cfg.icon_size!.result}px;background:${(cfg.colors as any)[m.result]}">
              ${m.result.charAt(0).toUpperCase()}
            </div>
          ` : html``}
        </td>
      </tr>
    `;
  }

  private _hex2rgba(hex: string, alpha: number): string {
    const h = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_:string, r:string, g:string, b:string) => r+r+g+g+b+b);
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    if (!m) return hex;
    return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${alpha})`;
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }
}

customElements.define("matches-card", MatchesCard);
