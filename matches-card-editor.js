// ============================================================================
//  Matches Card (90minut) – Edytor GUI v0.3.004
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
    this.render();
  }

  render() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });

    const c = this._config;
    const html = `
      <style>
        .form-group { margin-bottom: 1em; }
        .section { border-top: 1px solid #ccc; margin-top: 1em; padding-top: 1em; }
        label { font-weight: 600; display:block; margin-bottom: 0.3em; }
        input[type="number"] { width: 80px; }
        select, input, ha-entity-picker {
          width: 100%;
          box-sizing: border-box;
        }
      </style>

      <div class="form-group">
        <label>Encja sensora</label>
        <ha-entity-picker .value=${c.entity || ""} allow-custom-entity entity-type="sensor" configValue="entity"></ha-entity-picker>
      </div>

      <div class="form-group">
        <label>Nazwa karty</label>
        <input type="text" value="${c.name || ""}" placeholder="np. Górnik Zabrze" configValue="name">
      </div>

      <div class="section">
        <label>Wygląd tabeli</label>
        <select configValue="fill">
          <option value="system" ${c.fill === "system" ? "selected" : ""}>Systemowy</option>
          <option value="zebra" ${c.fill === "zebra" ? "selected" : ""}>Zebra</option>
          <option value="gradient" ${c.fill === "gradient" ? "selected" : ""}>Gradient</option>
        </select>
      </div>

      <div class="form-group">
        <label>Pokaż znaczek W/P/R</label>
        <ha-switch ?checked=${c.show_symbols !== false} configValue="show_symbols"></ha-switch>
      </div>

      <div class="section">
        <label>Gradient</label>
        <div class="form-group">
          <label>Początek (%)</label>
          <input type="number" min="0" max="100" value="${c.gradient_start || 35}" configValue="gradient_start">
        </div>
        <div class="form-group">
          <label>Przezroczystość</label>
          <input type="number" min="0" max="1" step="0.1" value="${c.gradient_alpha || 0.5}" configValue="gradient_alpha">
        </div>
      </div>

      <div class="section">
        <label>Czcionki</label>
        <div class="form-group"><label>Data</label><input type="number" value="${c.font_size_date || 0.9}" step="0.1" configValue="font_size_date"></div>
        <div class="form-group"><label>Status</label><input type="number" value="${c.font_size_status || 0.8}" step="0.1" configValue="font_size_status"></div>
        <div class="form-group"><label>Drużyny</label><input type="number" value="${c.font_size_teams || 1.0}" step="0.1" configValue="font_size_teams"></div>
        <div class="form-group"><label>Wyniki</label><input type="number" value="${c.font_size_score || 1.0}" step="0.1" configValue="font_size_score"></div>
      </div>

      <div class="section">
        <label>Ikony</label>
        <div class="form-group"><label>Herby</label><input type="number" value="${c.icon_size_crest || 24}" step="1" configValue="icon_size_crest"></div>
        <div class="form-group"><label>Liga</label><input type="number" value="${c.icon_size_league || 26}" step="1" configValue="icon_size_league"></div>
        <div class="form-group"><label>W/P/R</label><input type="number" value="${c.icon_size_result || 26}" step="1" configValue="icon_size_result"></div>
      </div>

      <div class="section">
        <label>Opcje nazw drużyn</label>
        <div class="form-group">
          <label>Pełne nazwy</label>
          <ha-switch ?checked=${c.full_team_names !== false} configValue="full_team_names"></ha-switch>
        </div>
        <div class="form-group">
          <label>Pokaż herby</label>
          <ha-switch ?checked=${c.show_logos !== false} configValue="show_logos"></ha-switch>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = html;
    this._bindEvents();
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[configValue]").forEach(el => {
      el.addEventListener("change", ev => {
        const value = ev.target.type === "checkbox" || ev.target.tagName === "HA-SWITCH" ? ev.target.checked : ev.target.value;
        this._config = { ...this._config, [ev.target.getAttribute("configValue")]: value };
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
      });
    });
  }

  get value() {
    return this._config;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);