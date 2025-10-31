class MatchesCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    this.innerHTML = `
      <ha-form
        .schema=${[
          { name: "entity", selector: { entity: { domain: "sensor" } } },
          { name: "name", selector: { text: {} } },
          { name: "show_logos", selector: { boolean: {} } },
          { name: "full_team_names", selector: { boolean: {} } }
        ]}
        .data=${this._config}
        @value-changed=${(ev) => this._updateConfig(ev.detail.value)}
      ></ha-form>
    `;
  }

  _updateConfig(value) {
    this._config = { ...this._config, ...value };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  get value() {
    return this._config;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);