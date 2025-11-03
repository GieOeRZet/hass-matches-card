import {LitElement, html, css} from "lit";

export class MatchesCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {attribute: false},
      _config: {attribute: false}
    };
  }

  hass: any;
  private _config: any;

  static styles = css`
    .card-config { display:flex; flex-direction:column; gap:10px; }
    ha-switch, ha-select, ha-textfield { width:100%; }
  `;

  setConfig(config: any) {
    this._config = {...config};
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor z meczami"
          .hass=${this.hass}
          .value=${this._config.entity}
          @value-changed=${this._change("entity")}
        ></ha-entity-picker>

        <ha-textfield label="Nazwa" .value=${this._config.name || ""} @input=${this._change("name")}></ha-textfield>

        <ha-select
          label="Wypełnienie wierszy"
          .value=${this._config.fill || "gradient"}
          @selected=${this._change("fill")}
        >
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Brak</mwc-list-item>
        </ha-select>

        <ha-switch .checked=${!!this._config.show_name} @change=${this._change("show_name")}>Pokaż nazwę</ha-switch>
        <ha-switch .checked=${!!this._config.show_logos} @change=${this._change("show_logos")}>Pokaż loga</ha-switch>
        <ha-switch .checked=${!!this._config.show_result_symbol} @change=${this._change("show_result_symbol")}>Pokaż symbol wyniku</ha-switch>
      </div>
    `;
  }

  private _change(field: string) {
    return (ev: any) => {
      const val = (ev && ev.target && "checked" in ev.target) ? ev.target.checked : (ev?.detail?.value ?? ev?.target?.value);
      this._config = {...this._config, [field]: val};
      const event = new Event("config-changed", {bubbles: true, composed: true});
      (event as any).detail = {config: this._config};
      this.dispatchEvent(event);
    };
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
