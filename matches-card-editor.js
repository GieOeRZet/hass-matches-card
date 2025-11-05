class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  connectedCallback() {
    if (this.isConnected && !this.innerHTML) this.render();
  }

  render() {
    const c = this._config || {};
    this.innerHTML = `
      <style>
        .editor { display:grid; gap:8px; padding:10px; }
        label { font-weight:500; margin-top:4px; display:block; }
        input[type="text"], input[type="number"] {
          width:100%; padding:4px; border-radius:6px; border:1px solid #ccc;
        }
        select { width:100%; padding:4px; border-radius:6px; border:1px solid #ccc; }
        .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      </style>

      <div class="editor">
        <label>Encja (entity)</label>
        <input id="entity" type="text" value="${c.entity || ''}" />

        <label>Nazwa karty</label>
        <input id="name" type="text" value="${c.name || '90minut Matches'}" />

        <div class="grid2">
          <label><input id="show_name" type="checkbox" ${c.show_name ? "checked" : ""}> Pokaż nagłówek</label>
          <label><input id="show_logos" type="checkbox" ${c.show_logos ? "checked" : ""}> Pokaż logotypy</label>
          <label><input id="full_team_names" type="checkbox" ${c.full_team_names ? "checked" : ""}> Pełne nazwy</label>
          <label><input id="show_result_symbols" type="checkbox" ${c.show_result_symbols ? "checked" : ""}> Symbole wyników</label>
        </div>

        <label>Tryb wypełnienia</label>
        <select id="fill_mode">
          <option value="gradient" ${c.fill_mode === "gradient" ? "selected" : ""}>Gradient</option>
          <option value="zebra" ${c.fill_mode === "zebra" ? "selected" : ""}>Zebra</option>
          <option value="none" ${c.fill_mode === "none" ? "selected" : ""}>Brak</option>
        </select>

        <label>Przezroczystość gradientu</label>
        <input id="gradient.alpha" type="number" min="0" max="1" step="0.1" value="${c.gradient?.alpha ?? 0.5}" />

        <label>Kolory wyników</label>
        <div class="grid2">
          <div><label>Wygrana</label><input id="colors.win" type="color" value="${c.colors?.win || '#3ba55d'}"></div>
          <div><label>Porażka</label><input id="colors.loss" type="color" value="${c.colors?.loss || '#e23b3b'}"></div>
          <div><label>Remis</label><input id="colors.draw" type="color" value="${c.colors?.draw || '#468cd2'}"></div>
        </div>
      </div>
    `;

    this.querySelectorAll("input,select").forEach(el =>
      el.addEventListener("change", (ev) => this._valueChanged(ev))
    );
  }

  _valueChanged(ev) {
    if (!this._configChanged) return;
    const key = ev.target.id;
    const value =
      ev.target.type === "checkbox" ? ev.target.checked :
      ev.target.type === "number" ? parseFloat(ev.target.value) :
      ev.target.value;

    const newConfig = { ...this._config };
    const parts = key.split(".");
    if (parts.length === 2) {
      newConfig[parts[0]] = { ...newConfig[parts[0]], [parts[1]]: value };
    } else {
      newConfig[key] = value;
    }

    this._config = newConfig;
    this._configChanged(this._config);
  }

  setConfigChangedCallback(cb) {
    this._configChanged = cb;
  }
}

if (!customElements.get("matches-card-editor")) {
  customElements.define("matches-card-editor", MatchesCardEditor);
}