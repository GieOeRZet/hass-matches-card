// ============================================================================
//  Matches Card (90minut) – v0.9.40
//  Autor: GieOeRZet
//  Repozytorium: https://github.com/GieOeRZet/matches-card
//  Zgodność: Home Assistant 2024.8+ (LitElement + GUI Editor)
// ============================================================================

import { LitElement, html, css } from "lit";
import "./matches-card-editor.js";

class MatchesCard extends LitElement {
  static get properties() {
    return { hass: {}, config: {} };
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "sensor.90minut_gornik_zabrze_matches",
      show_name: true,
      show_logos: true,
      fill_mode: "gradient",
      show_result_symbols: true,
      full_team_names: true
    };
  }

  setConfig(config) {
    if (!config?.entity)
      throw new Error("Entity is required (np. sensor.90minut_gornik_zabrze_matches)");
    this.config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient", // gradient | zebra | none
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config
    };
  }

  // Convert #rrggbb to rgba(...)
  _rgba(hex, alpha) {
    try {
      const h = (hex || "#000000").replace("#", "");
      const n = h.length === 3 ? h.split("").map(x => x + x).join("") : h;
      const num = parseInt(n, 16);
      const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
      return `rgba(${r}, ${g}, ${b}, ${isNaN(alpha) ? 1 : Math.max(0, Math.min(1, alpha))})`;
    } catch {
      return `rgba(0,0,0,${alpha || 1})`;
    }
  }

  // Lokalnie z HACS + fallback online (raw GitHub) — działa offline, a gdy brak pliku: online.
  _leagueLogoUrl(code) {
    const map = { L: "ekstraklasa.png", PP: "puchar.png", "1L": "1liga.png" };
    const file = map[code];
    if (!file) return null;
    const local = `/hacsfiles/matches-card/logo/${file}`;
    const online = `https://raw.githubusercontent.com/GieOeRZet/matches-card/refs/heads/main/logo/${file}`;
    // Używamy <img srcset> w renderze, by przeglądarka sama wybrała lokalny/online.
    return { local, online };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    const stateObj = this.hass.states[this.config.entity];
    if (!stateObj) {
      return html`<ha-card><div class="pad">Brak encji: ${this.config.entity}</div></ha-card>`;
    }
    const matches = stateObj.attributes.matches || [];
    const header =
      this.config.show_name ? (this.config.name || stateObj.attributes.friendly_name || "90minut Matches") : "";

    return html`
      <ha-card .header=${header}>
        <table>
          ${matches.map((m, i) => this._row(m, i === matches.length - 1))}
        </table>
      </ha-card>
    `;
  }

  _row(match, isLast) {
    const rawDate = match.date ? match.date.replace(" ", "T") : null;
    const dateObj = rawDate ? new Date(rawDate) : null;
    const dateStr = dateObj
      ? dateObj.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "-";
    const timeStr = match.finished
      ? "KONIEC"
      : dateObj
      ? dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
      : "";

    const res = match.result; // "win" | "loss" | "draw" | undefined
    const homeBold = res === "win" ? "bold" : res === "loss" ? "dim" : "";
    const awayBold = res === "loss" ? "bold" : res === "win" ? "dim" : "";

    const [homeScore, awayScore] = (match.score || "-").split("-");
    const logos = this._leagueLogoUrl(match.league);

    // Gradient RGBA (naprawa: NIE hex+alfa)
    const gradient =
      this.config.fill_mode === "gradient" && res
        ? `background: linear-gradient(to right,
             rgba(0,0,0,0) ${this.config.gradient.start}%,
             ${this._rgba(this.config.colors[res], this.config.gradient.alpha)} ${this.config.gradient.end}%);`
        : "";

    // Zebra
    const zebra = this.config.fill_mode === "zebra" ? " zebra" : "";

    return html`
      <tr class="${zebra}" style="${gradient}${isLast ? "border-bottom:none;" : ""}">
        <td class="col-date" style="width:${this.config.columns_pct.date}%">
          <div class="date" style="font-size:${this.config.font_size.date}em">${dateStr}</div>
          <div class="status" style="font-size:${this.config.font_size.status}em">${timeStr}</div>
        </td>

        <td class="col-league" style="width:${this.config.columns_pct.league}%">
          ${logos
            ? html`<img
                src="${logos.local}"
                srcset="${logos.local}, ${logos.online} 2x"
                height="${this.config.icon_size.league}"
                alt="${match.league || ""}"
                loading="lazy"
              />`
            : html`<div class="league-code">${match.league ?? ""}</div>`}
        </td>

        ${this.config.show_logos
          ? html`
              <td class="col-crests" style="width:${this.config.columns_pct.crest}%">
                <img class="crest" src="${match.logo_home}" alt="" />
                <img class="crest" src="${match.logo_away}" alt="" />
              </td>
            `
          : ""}

        <td class="col-teams">
          <div class="team ${homeBold}" style="font-size:${this.config.font_size.teams}em">
            ${this.config.full_team_names ? match.home : (match.home || "").split(" ")[0]}
          </div>
          <div class="team ${awayBold}" style="font-size:${this.config.font_size.teams}em">
            ${this.config.full_team_names ? match.away : (match.away || "").split(" ")[0]}
          </div>
        </td>

        <td class="col-score" style="width:${this.config.columns_pct.score}%">
          <div class="${homeBold}" style="font-size:${this.config.font_size.score}em">${homeScore ?? ""}</div>
          <div class="${awayBold}" style="font-size:${this.config.font_size.score}em">${awayScore ?? ""}</div>
        </td>

        <td class="col-result" style="width:${this.config.columns_pct.result}%">
          ${this.config.show_result_symbols && res
            ? html`<div
                class="result-circle"
                style="width:${this.config.icon_size.result}px;height:${this.config.icon_size.result}px;background:${this.config.colors[res]}"
              >
                ${res.charAt(0).toUpperCase()}
              </div>`
            : ""}
        </td>
      </tr>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        padding: 10px 0;
        font-family: "Sofascore Sans", Arial, sans-serif;
      }
      .pad {
        padding: 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      tr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      td {
        text-align: center;
        vertical-align: middle;
        padding: 4px 6px;
      }
      tr.zebra:nth-child(even) {
        background-color: rgba(240, 240, 240, 0.12);
      }

      .col-crests {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
      }
      .crest {
        background: #fff;
        border-radius: 6px;
        width: 24px;
        height: 24px;
        padding: 2px;
        object-fit: contain;
      }
      .league-code {
        font-size: 0.9em;
        opacity: 0.8;
      }
      .col-teams {
        text-align: left;
        padding-left: 8px;
      }
      .team {
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
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        margin: 0 auto;
      }
    `;
  }
}

customElements.define("matches-card", MatchesCard);

// Rejestracja w przeglądarce kart Lovelace
window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  description: "Karta pokazująca mecze z sensora 90minut.pl"
});