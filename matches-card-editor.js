// ============================================================================
//  Matches Card Editor – v0.3.001
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
  }

  _update(e) {
    if (!this._config) return;
    const target = e.target;
    const value =
      target.type === "checkbox" ? target.checked : target.value;
    this._config = { ...this._config, [target.name]: value };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this._config) return;
    return `
      <div class="card-config">
        <paper-input label="Encja" name="entity" value="${
          this._config.entity || ""
        }" oninput="_update(event)"></paper-input>
        <paper-input label="Nazwa" name="name" value="${
          this._config.name || ""
        }" oninput="_update(event)"></paper-input>

        <ha-select label="Wypełnienie" name="fill" value="${
          this._config.fill || "gradient"
        }" onchange="_update(event)">
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Bez wypełnienia</mwc-list-item>
        </ha-select>

        <ha-formfield label="Pokaż loga">
          <ha-switch name="show_logos" ${
            this._config.show_logos ? "checked" : ""
          } onchange="_update(event)"></ha-switch>
        </ha-formfield>

        <ha-formfield label="Pokaż symbole W/P/R">
          <ha-switch name="show_result_symbol" ${
            this._config.show_result_symbol ? "checked" : ""
          } onchange="_update(event)"></ha-switch>
        </ha-formfield>

        <paper-input
          label="Gradient start (%)"
          name="gradient.start"
          type="number"
          value="${this._config.gradient?.start || 35}"
          oninput="_update(event)"
        ></paper-input>
        <paper-input
          label="Gradient alpha (0–1)"
          name="gradient.alpha"
          type="number"
          value="${this._config.gradient?.alpha || 0.5}"
          oninput="_update(event)"
        ></paper-input>
      </div>
    `;
  }

  connectedCallback() {
    this.innerHTML = this.render();
  }
}
customElements.define("matches-card-editor", MatchesCardEditor);