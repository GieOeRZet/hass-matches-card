// ============================================================================
//  Matches Card Editor – v0.3.506 (restored stable version)
//  Author: GieOeRZet
//  Notes:
//    - Working color pickers
//    - Working zebra + gradient controls
//    - YAML sync OK
//    - This is the editor that worked before later refactors
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  render() {
    if (!this._config) return;

    this.innerHTML = `
      <style>
        .card-config {
          padding: 12px;
        }
        .card-config h4 {
          margin-top: 18px;
          margin-bottom: 6px;
        }
        .card-config input[type="color"] {
          width: 60px;
          height: 32px;
          border: none;
          background: none;
        }
      </style>

      <div class="card-config">
        <paper-input
          label="Nazwa karty"
          value="${this._config.name || ''}"
          configKey="name"></paper-input>

        <ha-entity-picker
          label="Encja"
          .hass="${window.hass}"
          value="${this._config.entity || ''}"
          configKey="entity"
          allow-custom-entity
        ></ha-entity-picker>

        <paper-dropdown-menu label="Tryb wypełnienia" configKey="fill_mode">
          <paper-listbox slot="dropdown-content" selected="${this._fillIndex()}">
            <paper-item>gradient</paper-item>
            <paper-item>zebra</paper-item>
            <paper-item>clear</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>

        <h4>Kolor zebra</h4>
        <input type="color" value="${this._config.zebra_color || '#f0f0f0'}" configKey="zebra_color" />

        <h4>Gradient – kolory</h4>
        <label>Wygrana</label>
        <input type="color" value="${this._config.gradient?.win || '#009900'}" configKey="gradient.win" />

        <label>Remis</label>
        <input type="color" value="${this._config.gradient?.draw || '#888888'}" configKey="gradient.draw" />

        <label>Porażka</label>
        <input type="color" value="${this._config.gradient?.loss || '#cc0000'}" configKey="gradient.loss" />

        <h4>Gradient – przezroczystość (alpha)</h4>
        <paper-slider
          min="0" max="1" step="0.01"
          value="${this._config.gradient?.alpha || 0.55}"
          configKey="gradient.alpha"
        ></paper-slider>
      </div>
    `;

    this.querySelectorAll('[configKey]').forEach(el => {
      el.addEventListener('value-changed', ev => this._updateConfig(el, ev.detail.value));
      el.addEventListener('change', ev => this._updateConfig(el, el.value));
    });
  }

  _fillIndex() {
    const mode = this._config.fill_mode || 'gradient';
    return ['gradient', 'zebra', 'clear'].indexOf(mode);
  }

  _updateConfig(el, value) {
    const key = el.getAttribute('configKey');
    if (!key) return;

    let obj = JSON.parse(JSON.stringify(this._config));

    if (key.includes('.')) {
      const [main, sub] = key.split('.');
      obj[main] = obj[main] || {};
      obj[main][sub] = value;
    } else {
      obj[key] = value;
    }

    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: obj }}));
  }

  static getConfigElement() {
    return document.createElement("matches-card-editor");
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
