// =============================================================================
//  Matches Card Editor – pełna wersja dla 0.3.001
//  Autor: GieOeRZet
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = JSON.parse(JSON.stringify(config || {}));
  }

  connectedCallback() {
    this.renderEditor();
  }

  _update(path, value) {
    const parts = path.split(".");
    let target = this.config;
    while (parts.length > 1) {
      const key = parts.shift();
      if (!(key in target)) target[key] = {};
      target = target[key];
    }
    target[parts[0]] = value;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config } }));
  }

  _reset() {
    if (!confirm("Na pewno zresetować wszystkie wartości do domyślnych?")) return;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: {} } }));
  }

  renderEditor() {
    if (!this.config) return;
    const c = this.config;

    this.innerHTML = `
      <style>
        .editor {
          display: grid;
          gap: 12px;
          padding: 12px;
          font-family: Arial, sans-serif;
        }
        .section {
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          padding: 10px;
          background: rgba(255,255,255,0.03);
        }
        .section h3 {
          margin: 0 0 6px;
          font-size: 1em;
          color: var(--primary-color);
        }
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 6px 0;
        }
        label { flex: 1; font-size: 0.9em; }
        input[type="color"],
        input[type="number"],
        select {
          width: 100px;
          text-align: right;
        }
        input[type="checkbox"] {
          transform: scale(1.2);
        }
        button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
        }
      </style>

      <div class="editor">

        <div class="section">
          <h3>⚙️ Ustawienia ogólne</h3>
          <div class="row">
            <label>Nazwa karty</label>
            <input type="text" value="${c.name || ''}"
              oninput="this.getRootNode().host._update('name', this.value)" />
          </div>
          <div class="row">
            <label>Pokaż nazwę</label>
            <input type="checkbox" ${c.show_name ? "checked" : ""}
              onchange="this.getRootNode().host._update('show_name', this.checked)" />
          </div>
          <div class="row">
            <label>Pełne nazwy drużyn</label>
            <input type="checkbox" ${c.full_team_names ? "checked" : ""}
              onchange="this.getRootNode().host._update('full_team_names', this.checked)" />
          </div>
        </div>

        <div class="section">
          <h3>🎨 Wygląd i kolory</h3>
          <div class="row">
            <label>Tryb wypełnienia</label>
            <select onchange="this.getRootNode().host._update('fill_mode', this.value)">
              ${['gradient','zebra','none'].map(m=>`<option value="${m}" ${c.fill_mode===m?'selected':''}>${m}</option>`).join('')}
            </select>
          </div>
          <div class="row">
            <label>Pokaż loga</label>
            <input type="checkbox" ${c.show_logos ? "checked" : ""}
              onchange="this.getRootNode().host._update('show_logos', this.checked)" />
          </div>
          <div class="row">
            <label>Symbole wyników</label>
            <input type="checkbox" ${c.show_result_symbols ? "checked" : ""}
              onchange="this.getRootNode().host._update('show_result_symbols', this.checked)" />
          </div>

          <div class="row">
            <label>Kolor wygranej</label>
            <input type="color" value="${c.colors?.win || '#3ba55d'}"
              onchange="this.getRootNode().host._update('colors.win', this.value)" />
          </div>
          <div class="row">
            <label>Kolor remisu</label>
            <input type="color" value="${c.colors?.draw || '#468cd2'}"
              onchange="this.getRootNode().host._update('colors.draw', this.value)" />
          </div>
          <div class="row">
            <label>Kolor porażki</label>
            <input type="color" value="${c.colors?.loss || '#e23b3b'}"
              onchange="this.getRootNode().host._update('colors.loss', this.value)" />
          </div>
        </div>

        <div class="section">
          <h3>📐 Gradient</h3>
          <div class="row">
            <label>Start (%)</label>
            <input type="number" min="0" max="100" value="${c.gradient?.start ?? 35}"
              oninput="this.getRootNode().host._update('gradient.start', parseInt(this.value))" />
          </div>
          <div class="row">
            <label>Koniec (%)</label>
            <input type="number" min="0" max="100" value="${c.gradient?.end ?? 100}"
              oninput="this.getRootNode().host._update('gradient.end', parseInt(this.value))" />
          </div>
          <div class="row">
            <label>Przezroczystość</label>
            <input type="number" min="0" max="1" step="0.05" value="${c.gradient?.alpha ?? 0.5}"
              oninput="this.getRootNode().host._update('gradient.alpha', parseFloat(this.value))" />
          </div>
        </div>

        <div class="section">
          <h3>🔠 Rozmiary czcionek</h3>
          ${["date","status","teams","score"].map(k=>`
            <div class="row">
              <label>${k}</label>
              <input type="number" step="0.1" value="${c.font_size?.[k] ?? 1}"
                oninput="this.getRootNode().host._update('font_size.${k}', parseFloat(this.value))" />
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>🏆 Rozmiary ikon</h3>
          ${["league","crest","result"].map(k=>`
            <div class="row">
              <label>${k}</label>
              <input type="number" step="1" value="${c.icon_size?.[k] ?? 24}"
                oninput="this.getRootNode().host._update('icon_size.${k}', parseInt(this.value))" />
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h3>📊 Proporcje kolumn (%)</h3>
          ${["date","league","crest","score","result"].map(k=>`
            <div class="row">
              <label>${k}</label>
              <input type="number" step="1" value="${c.columns_pct?.[k] ?? 10}"
                oninput="this.getRootNode().host._update('columns_pct.${k}', parseInt(this.value))" />
            </div>
          `).join('')}
        </div>

        <button onclick="this.getRootNode().host._reset()">🔄 Resetuj do domyślnych</button>
      </div>
    `;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);