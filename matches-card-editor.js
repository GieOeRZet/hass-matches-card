// ============================================================================
//  Matches Card Editor – v0.3.009
//  ✅ Kompatybilny z HACS i Home Assistant (frontend core)
//  ✅ Bez importów z @material / @polymer
//  ✅ Automatyczne ładowanie z matches-card.js (dynamic import)
//  ✅ Naprawia błąd „Cannot read properties of undefined (reading 'bind')”
// ============================================================================

console.info("%c[MatchesCardEditor] v0.3.009 loaded", "color: #1E90FF; font-weight: bold;");

class MatchesCardEditor extends HTMLElement {
  static get properties() {
    return { hass: {}, _config: {}, _showAdvanced: {} };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._showAdvanced = false;
  }

  setConfig(config) {
    this._config = config || {};
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  get hass() {
    return this._hass;
  }

  _onValueChanged(ev) {
    const target = ev.target;
    if (!this._config || !target) return;
    const newConfig = { ...this._config, [target.configValue]: target.value };
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: newConfig } }));
  }

  _toggleAdvanced() {
    this._showAdvanced = !this._showAdvanced;
    this.render();
  }

  _resetDefaults() {
    const defaults = { entity: "", show_gradient: true, team_badge: true };
    this._config = defaults;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: defaults } }));
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    // fallback – czekamy na komponenty HA
    if (!window.customElements.get("ha-textfield")) {
      this.shadowRoot.innerHTML = `<div style="padding:8px;">Ładowanie komponentów...</div>`;
      setTimeout(() => this.render(), 500);
      return;
    }

    const cfg = this._config;
    const adv = this._showAdvanced;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 8px 10px;
          color: var(--primary-text-color);
        }
        ha-textfield {
          display: block;
          margin-bottom: 12px;
        }
        .buttons {
          margin-top: 12px;
          display: flex;
          gap: 10px;
        }
        mwc-button {
          --mdc-theme-primary: var(--accent-color);
        }
        .adv {
          margin-top: 10px;
          padding: 10px;
          border-radius: 8px;
          background: rgba(130,130,130,0.1);
        }
      </style>

      <ha-textfield
        label="Encja (sensor)"
        .value="${cfg.entity || ""}"
        .configValue="entity"
        @input="${(e) => this._onValueChanged(e)}"
      ></ha-textfield>

      <ha-switch
        .checked="${cfg.show_gradient ?? true}"
        .configValue="show_gradient"
        @change="${(e) => this._onValueChanged({ target: { configValue: 'show_gradient', value: e.target.checked } })}"
      ></ha-switch>
      <label>Włącz gradient tła</label>

      <div class="buttons">
        <mwc-button @click="${() => this._toggleAdvanced()}">
          ${adv ? "Ukryj zaawansowane" : "Pokaż zaawansowane"}
        </mwc-button>
        <mwc-button @click="${() => this._resetDefaults()}">
          Przywróć domyślne
        </mwc-button>
      </div>

      ${adv ? `
        <div class="adv">
          <ha-switch
            .checked="${cfg.team_badge ?? true}"
            .configValue="team_badge"
            @change="${(e) => this._onValueChanged({ target: { configValue: 'team_badge', value: e.target.checked } })}"
          ></ha-switch>
          <label>Pokazuj logo drużyny</label>

          <ha-textfield
            label="Kolor gradientu (CSS)"
            .value="${cfg.gradient_color || 'linear-gradient(135deg, #1e3c72, #2a5298)'}"
            .configValue="gradient_color"
            @input="${(e) => this._onValueChanged(e)}"
          ></ha-textfield>
        </div>
      ` : ""}
    `;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
