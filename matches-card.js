// 90minut Matches Card v0.1.008 – layout stabilny (bez GUI)

// pobranie klas z frontend HA
const LitBase = window.LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitBase.prototype.html;
const css  = LitBase.prototype.css;

class MatchesCard extends LitBase {
  static getConfigElement() { return null; }
  static getStubConfig() {
    return {
      type: "custom:matches-card",
      entity: "sensor.90minut_gornik_zabrze_matches",
      name: "90minut Matches"
    };
  }

  static get properties() {
    return { hass: {}, config: { type: Object }, _rows: { type: Array } };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error("Entity is required");
    this.config = {
      name: config.name || "90minut Matches",
      show_logos: config.show_logos ?? true,
      colors: { win: "#3ba55d", loss: "#e23b3b", draw: "#468cd2" },
      ...config
    };
  }

  set hass(hass) {
    const prev = this._hass;
    this._hass = hass;
    if (!this.config?.entity) return;
    const st = hass.states[this.config.entity];
    if (!st) return;
    this._rows = st.attributes.matches || [];
    if (prev !== hass) this.requestUpdate();   // ✅ wymuszenie renderu po zmianie
  }

  getCardSize() { return 4; }

  _rgb(hex) {
    const c = (hex || "").replace("#","");
    const r = parseInt(c.substring(0,2)||"00",16);
    const g = parseInt(c.substring(2,4)||"00",16);
    const b = parseInt(c.substring(4,6)||"00",16);
    return `${r},${g},${b}`;
  }
  _resColor(r) {
    const c = this.config.colors;
    return r==="win"?c.win:r==="loss"?c.loss:c.draw;
  }
  _letter(r){return r==="win"?"W":r==="loss"?"P":r==="draw"?"R":"";}
  _date(d){const dt=new Date(d);return dt.toLocaleDateString("pl-PL",{day:"2-digit",month:"2-digit",year:"2-digit"});}
  _time(d){const dt=new Date(d);return dt.toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"});}

  render() {
    const rows=this._rows||[], c=this.config;
    return html`
      <ha-card header="${c.name}">
        <div class="table">
          ${rows.map((m,i)=>{
            const color=this._resColor(m.result);
            const grad=`linear-gradient(to right, rgba(${this._rgb(color)},0.0) 0%, rgba(${this._rgb(color)},0.5) 80%)`;
            const zebra=i%2===0?"var(--stripeA)":"var(--stripeB)";
            return html`
              <div class="row" style="background:${zebra},${grad}">
                <div class="cell date">
                  <div class="top">${this._date(m.date)}</div>
                  <div class="bottom">${m.finished?"Koniec":this._time(m.date)}</div>
                </div>
                <div class="cell league">
                  <img class="league-icon" src="${m.league_icon}" alt="league">
                </div>
                <div class="cell crest">
                  ${c.show_logos&&m.logo_home?html`<img class="crest-img" src="${m.logo_home}" alt="">`:html``}
                </div>
                <div class="cell teams">
                  <div class="team ${m.result==="win"?"bold":""}">${m.home}</div>
                  <div class="team ${m.result==="loss"?"dim":""}">${m.away}</div>
                </div>
                <div class="cell score">
                  <div class="team ${m.result==="win"?"bold":""}">${(m.score||"").split("-")[0]||"-"}</div>
                  <div class="team ${m.result==="loss"?"dim":""}">${(m.score||"").split("-")[1]||"-"}</div>
                </div>
                <div class="cell res">${this._letter(m.result)}</div>
              </div>`;
          })}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host{display:block;}
      .table{display:flex;flex-direction:column;
        --stripeA:rgba(255,255,255,0.02);
        --stripeB:rgba(255,255,255,0.06);}
      @media(prefers-color-scheme:light){
        .table{--stripeA:rgba(0,0,0,0.02);--stripeB:rgba(0,0,0,0.04);}
      }
      .row{display:grid;
        grid-template-columns:12% 10% 10% auto 10% 8%;
        align-items:center;padding:6px 8px;gap:4px;}
      .cell{display:flex;flex-direction:column;align-items:center;justify-content:center;}
      .date .top{font-weight:600;font-size:0.9em;}
      .date .bottom{font-size:0.8em;opacity:0.8;}
      .league-icon{height:26px;}
      .crest-img{height:24px;background:#fff;border-radius:4px;padding:2px;}
      .teams{align-items:flex-start;text-align:left;}
      .team.bold{font-weight:700;}
      .team.dim{opacity:0.9;}
      .score{text-align:center;}
      .res{font-weight:700;font-size:1.1em;}
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type:"matches-card",
  name:"90minut Matches Card",
  preview:true,
  description:"Custom match list card with gradient and zebra background"
});
customElements.define("matches-card",MatchesCard);