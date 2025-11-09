import{LitElement as e,nothing as t,html as a,css as o}from"lit";const s={title:"Matches",show_logos:!0,show_league:!0,max_rows:12,bg_color:"#1e1e1e",bg_alpha:.95,text_color:"#ffffff",accent_color:"#03a9f4",name_col_width:60,score_col_width:15,meta_col_width:15,logo_col_width:10,matches:[{team_home:"Górnik Zabrze",team_away:"Ruch Chorzów",result:"2:1",date:"2025-11-09 18:00",league:"Ekstraklasa",live:!1}]};function c(e){if(!e)return"";const t=e.toLowerCase().replace(/[^a-z0-9]/g,"_"),a=`/hacsfiles/matches-card/logo/${t}.png`,o=`https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/${t}.png`,s=new Image;return s.src=a,s.onerror=()=>s.src=o,s.src}customElements.define("matches-card",class extends e{static get properties(){return{hass:{},_config:{attribute:!1}}}static getConfigElement(){return document.createElement("matches-card-editor")}static getStubConfig(){return{...s}}setConfig(e){this._config={...s,...e||{}}}getCardSize(){const e=Math.min(this._config?.matches?.length||1,this._config?.max_rows||s.max_rows);return 1+Math.max(1,Math.floor(.7*e))}render(){if(!this._config)return t;const e=this._config,o=function(e,t=1){let a=e.replace("#","");3===a.length&&(a=[...a].map(e=>e+e).join(""));const o=parseInt(a,16);return`rgba(${o>>16&255}, ${o>>8&255}, ${255&o}, ${t})`}(e.bg_color,e.bg_alpha),c=e.text_color||s.text_color,i=e.accent_color||s.accent_color,r=[e.show_logos?`${e.logo_col_width||s.logo_col_width}%`:null,`${e.name_col_width||s.name_col_width}%`,`${e.score_col_width||s.score_col_width}%`,`${e.meta_col_width||s.meta_col_width}%`].filter(Boolean).join(" "),l=Array.isArray(e.matches)?e.matches:[];return a`
        <ha-card style=${`--mc-bg:${o};--mc-fg:${c};--mc-accent:${i};`}>
          <div class="header">
            <div class="title">${e.title||s.title}</div>
          </div>
          <div class="table">
            ${0===l.length?a`<div class="empty">Brak meczów</div>`:l.slice(0,e.max_rows).map((e,t)=>this._renderRow(e,t,r))}
          </div>
        </ha-card>
      `}_renderRow(e,o,s){const i=(e.status||"").toString().toUpperCase().includes("LIVE")||!0===e.live,r=e.team_home||e.home||"",l=e.team_away||e.away||"",n=e.result??(null!=e.home_score&&null!=e.away_score?`${e.home_score}:${e.away_score}`:"-"),d=e.date||e.when||"",g=e.league||"",h=this._config.show_logos?c(r):"",m=this._config.show_logos?c(l):"";return a`
        <div class="row ${i?"live":""}" style="grid-template-columns:${s};">
          ${this._config.show_logos?a`
                <div class="cell logos">
                  ${h?a`<img src="${h}" alt="${r}" />`:a`<div class="fallback">${g}</div>`}
                  ${m?a`<img src="${m}" alt="${l}" />`:a`<div class="fallback">${g}</div>`}
                </div>
              `:t}

          <div class="cell teams" title="${r} vs ${l}">
            ${i?a`<span class="live-dot"></span>`:t}
            <span class="team">${r}</span>
            <span class="vs">vs</span>
            <span class="team">${l}</span>
          </div>

          <div class="cell score">${n}</div>
          <div class="cell meta">${d}${this._config.show_league&&g?` • ${g}`:""}</div>
        </div>
      `}static get styles(){return o`
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
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
      `}});
