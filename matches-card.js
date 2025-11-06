class MatchesCard extends HTMLElement {
  setConfig(config) {
    if (!config || !config.entity)
      throw new Error("Entity is required (np. sensor.90minut_gornik_zabrze_matches)");
    this.config = {
      name: "90minut Matches",
      show_name: true,
      show_logos: true,
      full_team_names: true,
      show_result_symbols: true,
      fill_mode: "gradient",
      theme_mode: "auto",
      font_size: { date: 0.9, status: 0.8, teams: 1.0, score: 1.0 },
      icon_size: { league: 26, crest: 24, result: 26 },
      gradient: { alpha: 0.5, start: 35, end: 100 },
      columns_pct: { date: 10, league: 10, crest: 10, score: 10, result: 8 },
      colors: { win: "#3ba55d", draw: "#468cd2", loss: "#e23b3b" },
      ...config,
    };
    if (!this._root) this._buildStatic();
    else this._rebuildColgroup();
  }

  _buildStatic() {
    this._root = document.createElement("div");
    const style = document.createElement("style");
    style.textContent = `
      ha-card{padding:8px;font-family:"Sofascore Sans",Arial,sans-serif;
        background:var(--card-background-color)}
      table{width:100%;border-collapse:collapse;table-layout:fixed}
      td{text-align:center;vertical-align:middle;padding:2px 4px;
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      tr{border-bottom:1px solid rgba(0,0,0,0.1)}
      .team-cell{text-align:left;padding-left:4px}
      .team-row{line-height:1.25em}
      .bold{font-weight:600}.dim{opacity:.8}
      .result-circle{border-radius:50%;width:${this.config.icon_size.result}px;
        height:${this.config.icon_size.result}px;color:#fff;display:flex;
        justify-content:center;align-items:center;font-weight:bold;margin:0 auto}
    `;
    this._card = document.createElement("ha-card");
    this._table = document.createElement("table");
    this._colgroup = document.createElement("colgroup");
    this._tbody = document.createElement("tbody");
    this._table.append(this._colgroup, this._tbody);
    this._card.appendChild(this._table);
    this._root.append(style, this._card);
    this.appendChild(this._root);
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this.config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) return;

    const dark =
      this.config.theme_mode === "dark" ||
      (this.config.theme_mode === "auto" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const rowSep = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)";
    const zebraBg = dark ? "rgba(255,255,255,0.06)" : "rgba(240,240,240,0.4)";
    const zebraCSS =
      this.config.fill_mode === "zebra"
        ? `tr:nth-child(even){background-color:${zebraBg};}`
        : "";

    if (!this._dynamicStyle) {
      this._dynamicStyle = document.createElement("style");
      this._root.appendChild(this._dynamicStyle);
    }
    this._dynamicStyle.textContent = `tr{border-bottom:1px solid ${rowSep}}${zebraCSS}`;
    this._rebuildColgroup();

    const matches = stateObj.attributes.matches || [];
    this._tbody.innerHTML = matches.map((m) => this._rowHtml(m)).join("");
  }

  _rebuildColgroup() {
    const pct = this.config.columns_pct || {};
    const showLogos = !!this.config.show_logos;
    this._colgroup.innerHTML = "";
    let total = 0;
    const addCol = (w, visible = true) => {
      if (!visible || w <= 0) return;
      const c = document.createElement("col");
      c.style.width = `${w}%`;
      this._colgroup.appendChild(c);
      total += w;
    };
    addCol(pct.date);
    addCol(pct.league);
    if (showLogos) addCol(pct.crest);
    addCol(pct.score);
    addCol(pct.result);
    const teamWidth = Math.max(0, 100 - total);
    const teamCol = document.createElement("col");
    teamCol.style.width = `${teamWidth}%`;
    const insertIndex = showLogos ? 3 : 2;
    this._colgroup.insertBefore(teamCol, this._colgroup.children[insertIndex] || null);
  }

  _rowHtml(match) {
    const d = match.date ? new Date(match.date.replace(" ", "T")) : null;
    const dateStr = d ? d.toLocaleDateString("pl-PL") : "-";
    const timeStr = match.finished
      ? "KONIEC"
      : d
      ? d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
      : "";

    const homeBold = match.result === "win" ? "bold" : match.result === "loss" ? "dim" : "";
    const awayBold = match.result === "loss" ? "bold" : match.result === "win" ? "dim" : "";
    const [homeScore, awayScore] = (match.score || "-").split("-");
    const colorHex = this.config.colors[match.result] || "#000000";
    const rgbaColor = this.hexToRgba(colorHex, this.config.gradient.alpha);
    const gradientCSS =
      this.config.fill_mode === "gradient" && match.result
        ? `background:linear-gradient(to right,rgba(0,0,0,0) ${this.config.gradient.start}%,${rgbaColor} ${this.config.gradient.end}%);`
        : "";

    const leagueIcon =
      match.league === "L"
        ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png"
        : match.league === "PP"
        ? "https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png"
        : null;

    const crestTd = this.config.show_logos
      ? `<td><img src="${match.logo_home || ""}" height="${this.config.icon_size.crest}">
           <br><img src="${match.logo_away || ""}" height="${this.config.icon_size.crest}"></td>`
      : "";

    const homeTeam = this.config.full_team_names
      ? match.home || ""
      : (match.home || "").split(" ")[0] || "";
    const awayTeam = this.config.full_team_names
      ? match.away || ""
      : (match.away || "").split(" ")[0] || "";

    return `
      <tr style="${gradientCSS}">
        <td><div style="font-size:${this.config.font_size.date}em;">${dateStr}</div>
            <div style="font-size:${this.config.font_size.status}em;">${timeStr}</div></td>
        <td>${leagueIcon
          ? `<img src="${leagueIcon}" height="${this.config.icon_size.league}" style="display:block;margin:auto;">`
          : `<div style="opacity:.8;">${match.league ?? ""}</div>`}</td>
        ${crestTd}
        <td class="team-cell">
          <div class="team-row ${homeBold}" style="font-size:${this.config.font_size.teams}em;">${homeTeam}</div>
          <div class="team-row ${awayBold}" style="font-size:${this.config.font_size.teams}em;">${awayTeam}</div>
        </td>
        <td><div class="${homeBold}" style="font-size:${this.config.font_size.score}em;">${homeScore}</div>
            <div class="${awayBold}" style="font-size:${this.config.font_size.score}em;">${awayScore}</div></td>
        <td>${this.config.show_result_symbols && match.result
          ? `<div class="result-circle" style="background:${colorHex}">${match.result.charAt(0).toUpperCase()}</div>`
          : ""}</td>
      </tr>
    `;
  }

  hexToRgba(hex, alpha = 1) {
    let c = String(hex || "#000000").replace("#", "");
    if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255,
      g = (bigint >> 8) & 255,
      b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }

  static getStubConfig() {
    return { entity: "sensor.90minut_gornik_zabrze_matches" };
  }
}

customElements.define("matches-card", MatchesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matches-card",
  name: "Matches Card (90minut)",
  description: "Karta pokazująca mecze z sensora 90minut.pl",
  version: "0.3.009",
});