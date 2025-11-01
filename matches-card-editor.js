class MatchesCardEditor extends HTMLElement {
  setConfig(config) { this.config = config; this.render(); }

  render() {
    this.innerHTML = `
      <style>
        .form-row { margin: 8px 0; display: flex; flex-direction: column; }
        ha-textfield { width: 100%; }
      </style>

      <ha-form>
        <div class="form-row">
          <ha-entity-picker label="Encja (sensor z meczami)" .value="${this.config.entity || ''}" ></ha-entity-picker>
        </div>

        <div class="form-row">
          <ha-textfield type="text" label="Nazwa karty" .value="${this.config.name || ''}"></ha-textfield>
        </div>

        <div class="form-row">
          <ha-select label="Tryb wypełnienia" .value="${this.config.fill_mode || 'gradient'}">
            <mwc-list-item value="gradient">Gradient</mwc-list-item>
            <mwc-list-item value="zebra">Zebra</mwc-list-item>
            <mwc-list-item value="none">Brak</mwc-list-item>
          </ha-select>
        </div>

        <div class="form-row">
          <ha-textfield type="number" min="30" max="80" step="1"
            label="Wysokość wiersza (px)" .value="${this.config.row_height || 48}"></ha-textfield>
        </div>
      </ha-form>
    `;
  }

  get value() { return this.config; }
}

customElements.define("matches-card-editor", MatchesCardEditor);