import{LitElement as e,nothing as a,html as t,css as s}from"lit";const o={title:"Matches",show_logos:!0,show_league:!0,max_rows:12,bg_color:"#1e1e1e",bg_alpha:.95,text_color:"#ffffff",accent_color:"#03a9f4",name_col_width:60,score_col_width:15,meta_col_width:15,logo_col_width:10,matches:[{team_home:"Górnik Zabrze",team_away:"Ruch Chorzów",result:"2:1",date:"2025-11-09 18:00",league:"Ekstraklasa",live:!1}]};function i(e){if(!e)return"";const a=e.toLowerCase().replace(/[^a-z0-9]/g,"_"),t=`/hacsfiles/matches-card/logo/${a}.png`,s=`https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/${a}.png`,o=new Image;return o.src=t,o.onerror=()=>o.src=s,o.src}class c extends e{static properties={hass:{},_config:{attribute:!1}};static async getConfigElement(){return await import("../../../../../../hacsfiles/matches-card/matches-card-editor.js"),document.createElement("matches-card-editor")}static getStubConfig(){return{...o}}setConfig(e){this._config={...o,...e}}getCardSize(){const e=Math.min(this._config?.matches?.length||1,this._config?.max_rows||o.max_rows);return 1+Math.max(1,Math.floor(.7*e))}render(){if(!this._config)return a;const e=this._config,s=this.hexToRgba(e.bg_color,e.bg_alpha),i=e.text_color||o.text_color,c=e.accent_color||o.accent_color,r=[e.show_logos?`${e.logo_col_width}%`:null,`${e.name_col_width}%`,`${e.score_col_width}%`,`${e.meta_col_width}%`].filter(Boolean).join(" "),l=Array.isArray(e.matches)?e.matches:[];return t`
      <ha-card style="--mc-bg:${s};--mc-fg:${i};--mc-accent:${c};">
        <div class="header"><div class="title">${e.title||o.title}</div></div>
        <div class="table">
          ${0===l.length?t`<div class="empty">Brak meczów</div>`:l.slice(0,e.max_rows).map((e,a)=>this.renderRow(e,a,r))}
        </div>
      </ha-card>
    `}renderRow(e,s,o){const c=(e.status||"").toString().toUpperCase().includes("LIVE")||!0===e.live,r=e.team_home||e.home||"",l=e.team_away||e.away||"",n=e.result??(null!=e.home_score&&null!=e.away_score?`${e.home_score}:${e.away_score}`:"-"),d=e.date||e.when||"",g=e.league||"",h=this._config.show_logos?i(r):"",m=this._config.show_logos?i(l):"";return t`
      <div class="row ${c?"live":""}" style="grid-template-columns:${o};">
        ${this._config.show_logos?t`
              <div class="cell logos">
                ${h?t`<img src="${h}" alt="${r}" />`:t`<div class="fallback">${g}</div>`}
                ${m?t`<img src="${m}" alt="${l}" />`:t`<div class="fallback">${g}</div>`}
              </div>
            `:a}

        <div class="cell teams" title="${r} vs ${l}">
          ${c?t`<span class="live-dot"></span>`:a}
          <span class="team">${r}</span>
          <span class="vs">vs</span>
          <span class="team">${l}</span>
        </div>

        <div class="cell score">${n}</div>
        <div class="cell meta">${d}${this._config.show_league&&g?` • ${g}`:""}</div>
      </div>
    `}hexToRgba(e,a=1){if(!e)return"rgba(30,30,30,0.9)";let t=e.replace("#","");3===t.length&&(t=[...t].map(e=>e+e).join(""));const s=parseInt(t,16);return`rgba(${s>>16&255}, ${s>>8&255}, ${255&s}, ${a})`}static styles=s`
    :host {
      --mc-bg: #1e1e1e;
      --mc-fg: #fff;
      --mc-accent: #03a9f4;
    }
    ha-card {
      background: var(--mc-bg);
      color: var(--mc-fg);
      border-radius: 16px;
      overflow: hidden;
    }
    .header {
      padding: 10px 14px;
      font-weight: 700;
    }
    .table {
      display: grid;
      gap: 8px;
      padding: 10px 14px 14px;
    }
    .row {
      display: grid;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
    }
    .row.live {
      outline: 2px solid var(--mc-accent);
    }
    .cell {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .logos img {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.12);
      padding: 2px;
    }
    .fallback {
      font-size: 0.75em;
      opacity: 0.7;
      font-weight: 600;
    }
    .teams .team {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .vs {
      opacity: 0.6;
      margin: 0 6px;
    }
    .score {
      justify-content: center;
      font-weight: 800;
    }
    .meta {
      justify-content: flex-end;
      opacity: 0.85;
      font-variant-numeric: tabular-nums;
    }
    .live-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--mc-accent);
      animation: pulse 1.2s infinite ease-in-out;
    }
    @keyframes pulse {
      0% {
        transform: scale(0.9);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.15);
        opacity: 1;
      }
      100% {
        transform: scale(0.9);
        opacity: 0.7;
      }
    }
  `}customElements.define("matches-card",c);
