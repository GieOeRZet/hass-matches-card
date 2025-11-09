import{LitElement as e,html as t,css as i,nothing as a}from"lit";const o={title:"Matches",show_logos:!0,show_league:!0,max_rows:12,bg_color:"#1e1e1e",bg_alpha:.95,text_color:"#ffffff",accent_color:"#03a9f4",name_col_width:60,score_col_width:15,meta_col_width:15,logo_col_width:10};customElements.define("matches-card-editor",class extends e{static get properties(){return{hass:{},config:{}}}setConfig(e){this.config={...o,...e||{}}}_emit(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}_onText=e=>{const t=e.currentTarget?.dataset?.key;if(!t)return;const i=e.currentTarget.value;this.config[t]!==i&&(this.config={...this.config,[t]:i},this._emit())};_onNumber=e=>{const t=e.currentTarget?.dataset?.key;if(!t)return;const i=Number(e.currentTarget.value);Number.isNaN(i)||this.config[t]===i||(this.config={...this.config,[t]:i},this._emit())};_onSwitch=e=>{const t=e.currentTarget?.dataset?.key;if(!t)return;const i=!!e.currentTarget.checked;this.config[t]!==i&&(this.config={...this.config,[t]:i},this._emit())};_onColor=e=>{const t=e.currentTarget?.dataset?.key;if(!t)return;const i=e.currentTarget.value;this.config[t]!==i&&(this.config={...this.config,[t]:i},this._emit())};_onAlpha=e=>{const t=Number(e.currentTarget.value),i=Math.max(0,Math.min(100,t))/100;this.config.bg_alpha!==i&&(this.config={...this.config,bg_alpha:i},this._emit())};_reset=()=>{const e={matches:this.config.matches,entity:this.config.entity};this.config={...o,...e},this._emit()};_previewStyle(e,t=1){const i="string"==typeof e&&e.startsWith("#")?e:"#1e1e1e";return`background: linear-gradient(45deg,#bbb 25%, transparent 25%), \n                         linear-gradient(-45deg,#bbb 25%, transparent 25%),\n                         linear-gradient(45deg, transparent 75%, #bbb 75%),\n                         linear-gradient(-45deg, transparent 75%, #bbb 75%),\n                         ${this._hexToRgba(i,t)};\n            background-size:10px 10px,10px 10px,10px 10px,10px 10px,100% 100%;\n            background-position:0 0,0 5px,5px -5px,-5px 0,0 0;`}_hexToRgba(e,t=1){let i=e?.replace("#","")||"1e1e1e";3===i.length&&(i=[...i].map(e=>e+e).join(""));const a=parseInt(i,16);return`rgba(${a>>16&255}, ${a>>8&255}, ${255&a}, ${Math.max(0,Math.min(1,t))})`}render(){if(!this.config)return t``;const e=this.config;return t`
      <div class="form">
        <div class="head">
          <div class="title">Matches Card – konfiguracja</div>
          <mwc-button dense outlined @click=${this._reset}>Reset</mwc-button>
        </div>

        <ha-textfield
          label="Tytuł"
          .value=${e.title||""}
          data-key="title"
          @input=${this._onText}
        ></ha-textfield>

        <div class="row2">
          <div class="field">
            <div class="label">Pokaż loga</div>
            <ha-switch
              .checked=${e.show_logos??!0}
              data-key="show_logos"
              @change=${this._onSwitch}
            ></ha-switch>
          </div>
          <div class="field">
            <div class="label">Pokaż ligę</div>
            <ha-switch
              .checked=${e.show_league??!0}
              data-key="show_league"
              @change=${this._onSwitch}
            ></ha-switch>
          </div>
          <div class="field">
            <div class="label">Maks. wierszy</div>
            <ha-number-input
              min="1" max="50" step="1"
              .value=${Number(e.max_rows??o.max_rows)}
              data-key="max_rows"
              @input=${this._onNumber}
            ></ha-number-input>
          </div>
        </div>

        <div class="section">Kolory</div>

        <div class="row3">
          <div class="field col">
            <div class="label">Tło (HEX)</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(e.bg_color,e.bg_alpha)}></div>
              <input type="color" .value=${e.bg_color||o.bg_color} data-key="bg_color" @input=${this._onColor} />
              <input type="text" .value=${e.bg_color||""} data-key="bg_color" @input=${this._onText} placeholder="#1e1e1e" />
            </div>
            <div class="alpha">
              <span>Przezroczystość: ${Math.round(100*(e.bg_alpha??o.bg_alpha))}%</span>
              <input type="range" min="0" max="100" .value=${Math.round(100*(e.bg_alpha??o.bg_alpha))} @input=${this._onAlpha} />
            </div>
          </div>

          <div class="field col">
            <div class="label">Tekst</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(e.text_color,1)}></div>
              <input type="color" .value=${e.text_color||o.text_color} data-key="text_color" @input=${this._onColor} />
              <input type="text" .value=${e.text_color||""} data-key="text_color" @input=${this._onText} placeholder="#ffffff" />
            </div>
          </div>

          <div class="field col">
            <div class="label">Akcent</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(e.accent_color,1)}></div>
              <input type="color" .value=${e.accent_color||o.accent_color} data-key="accent_color" @input=${this._onColor} />
              <input type="text" .value=${e.accent_color||""} data-key="accent_color" @input=${this._onText} placeholder="#03a9f4" />
            </div>
          </div>
        </div>

        <div class="section">Szerokości kolumn (%)</div>
        <div class="row4">
          <div class="mini">
            <div class="mini-label">Logo</div>
            <ha-number-input min="5" max="30" step="1" .value=${Number(e.logo_col_width??10)} data-key="logo_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Nazwa</div>
            <ha-number-input min="20" max="80" step="1" .value=${Number(e.name_col_width??60)} data-key="name_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Wynik</div>
            <ha-number-input min="5" max="40" step="1" .value=${Number(e.score_col_width??15)} data-key="score_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Meta</div>
            <ha-number-input min="5" max="40" step="1" .value=${Number(e.meta_col_width??15)} data-key="meta_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
        </div>
      </div>
    `}static get styles(){return i`
      .form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .title {
        font-weight: 700;
      }
      .section {
        margin-top: 8px;
        font-weight: 600;
        opacity: .9;
      }
      .row2, .row3, .row4 {
        display: grid;
        gap: 12px;
      }
      .row2 { grid-template-columns: repeat(3, 1fr); }
      .row3 { grid-template-columns: repeat(3, 1fr); }
      .row4 { grid-template-columns: repeat(4, 1fr); }

      .field { display: flex; flex-direction: column; gap: 8px; }
      .label { font-weight: 600; opacity: .85; }

      .inline {
        display: grid;
        grid-template-columns: 24px 46px 1fr;
        gap: 8px;
        align-items: center;
      }

      .swatch {
        width: 24px; height: 24px; border-radius: 6px;
        border: 1px solid rgba(0,0,0,.2);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.15);
      }

      .alpha {
        display: flex; align-items: center; gap: 10px;
      }
      .alpha input[type="range"] { width: 100%; }

      .mini { display: flex; flex-direction: column; gap: 6px; }
      .mini-label { font-size: .9em; opacity: .8; }

      ha-textfield, ha-number-input, ha-select { width: 100%; }
      mwc-button[outlined] { --mdc-theme-primary: var(--primary-color); }
    `}});const s=(e,t=1)=>{const{r:i,g:a,b:o}=(e=>{if(!e||"string"!=typeof e)return{r:31,g:31,b:31};let t=e.trim().replace("#","");3===t.length&&(t=[...t].map(e=>e+e).join(""));const i=parseInt(t,16);return Number.isNaN(i)?{r:31,g:31,b:31}:{r:i>>16&255,g:i>>8&255,b:255&i}})(e);return`rgba(${i}, ${a}, ${o}, ${"number"==typeof t?Math.min(1,Math.max(0,t)):1})`},n={title:"Matches",show_logos:!0,show_league:!0,max_rows:12,bg_color:"#1e1e1e",bg_alpha:.95,text_color:"#ffffff",accent_color:"#03a9f4",name_col_width:60,score_col_width:15,meta_col_width:15,logo_col_width:10,matches:[{team_home:"Górnik Zabrze",team_away:"Ruch Chorzów",result:"2:1",date:"2025-11-09 18:00",league:"Ekstraklasa",live:!1}]};customElements.define("matches-card",class extends e{static get properties(){return{hass:{},_config:{attribute:!1}}}static getConfigElement(){return document.createElement("matches-card-editor")}static getStubConfig(){return{...n}}setConfig(e){this._config={...n,...e||{}}}getCardSize(){const e=Math.min(this._config?.matches?.length||1,this._config?.max_rows||n.max_rows);return 1+Math.max(1,Math.floor(.7*e))}render(){if(!this._config)return a;const e=this._config,i=s(e.bg_color,e.bg_alpha),o=e.text_color||n.text_color,l=e.accent_color||n.accent_color,c=[e.show_logos?`${e.logo_col_width||n.logo_col_width}%`:null,`${e.name_col_width||n.name_col_width}%`,`${e.score_col_width||n.score_col_width}%`,`${e.meta_col_width||n.meta_col_width}%`].filter(Boolean).join(" "),r=Array.isArray(e.matches)?e.matches:[];return t`
      <ha-card style=${`--mc-bg:${i};--mc-fg:${o};--mc-accent:${l};`}>
        ${this._renderHeader(e)}
        <div class="table">
          ${0===r.length?t`<div class="empty">No matches</div>`:r.slice(0,e.max_rows).map((e,t)=>this._renderRow(e,t,c))}
        </div>
      </ha-card>
    `}_renderHeader(e){return t`
      <div class="header">
        <div class="title">${e.title||n.title}</div>
      </div>
    `}_renderRow(e,i,o){const s=(e.status||"").toString().toUpperCase().includes("LIVE")||!0===e.live,n=e.team_home||e.home||"",l=e.team_away||e.away||"",c=e.result??(null!=e.home_score&&null!=e.away_score?`${e.home_score}–${e.away_score}`:"-"),r=e.date||e.when||"";return t`
      <div
        class="row ${s?"live":""}"
        style=${`grid-template-columns:${o};`}
      >
        ${this._config.show_logos?t`<div class="cell logos">
              <div class="logo-blob"></div>
              <div class="logo-blob"></div>
            </div>`:a}

        <div class="cell teams" title="${n} vs ${l}">
          ${s?t`<span class="live-dot"></span>`:a}
          <span class="team">${n}</span>
          <span class="vs">vs</span>
          <span class="team">${l}</span>
        </div>

        <div class="cell score">${c}</div>
        <div class="cell meta">${r}${this._config.show_league&&e.league?` • ${e.league}`:""}</div>
      </div>
    `}static get styles(){return i`
      :host {
        --mc-bg: #1e1e1e;
        --mc-fg: #ffffff;
        --mc-accent: #03a9f4;
      }
      ha-card {
        background: var(--mc-bg);
        color: var(--mc-fg);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
      }
      .title {
        font-weight: 700;
      }
      .table {
        display: grid;
        gap: 8px;
        padding: 10px 12px 12px;
      }
      .empty {
        opacity: 0.7;
        text-align: center;
        padding: 12px 8px;
      }
      .row {
        display: grid;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 10px;
      }
      .row.live {
        outline: 2px solid var(--mc-accent);
      }
      .cell {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 8px;
      }
      .logos {
        gap: 6px;
      }
      .logo-blob {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.18);
      }
      .teams .team {
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .teams .vs {
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
        margin-right: 6px;
        animation: pulse 1.2s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0.7; }
      }
    `}});
