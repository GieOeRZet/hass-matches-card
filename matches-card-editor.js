class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  connectedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this.innerHTML = `
      <style>
        .section { margin: 8px 0; padding: 6px 0; border-top: 1px solid rgba(0,0,0,0.1); }
        label { display:block; font-weight:500; margin-bottom:2px; }
        input[type="text"], input[type="number"] {
          width: 100%; padding: 4px; border-radius: 6px; border: 1px solid #ccc;
        }
      </style>
      <div class="card-config">
        <div class="section">
          <label>Encja (entity)</label>
          <input type="text" id="entity" value="${this.config.entity || ''}" />
        </div>
        <div class="section">
          <label>Nazwa karty</label>
          <input type="text" id="name" value="${this.config.name || '90minut Matches'}" />
        </div>
        <div class="section">
          <label>Pokaż logotypy</label>
          <input type="checkbox" id="show_logos" ${this.config.show_logos ? "checked" : ""}/>
        </div>
      </div>
    `;

    this.querySelectorAll("input").forEach(el =>
      el.addEventListener("change", ev => this._valueChanged(ev))
    );
  }

  _valueChanged(ev) {
    if (!this.config || !this._configChanged) return;
    const key = ev.target.id;
    const value = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
    this.config = { ...this.config, [key]: value };
    this._configChanged(this.config);
  }

  setConfigChangedCallback(cb) {
    this._configChanged = cb;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);