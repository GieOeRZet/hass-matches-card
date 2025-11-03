import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "./fire-event";
import { CARD_EDITOR_NAME } from "./const";
import type { MatchesCardConfig } from "./types";

@customElement(CARD_EDITOR_NAME)
export class MatchesCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @state() private config!: MatchesCardConfig;

  static styles = css`
    .card-config { display:flex; flex-direction:column; gap:10px; }
    ha-switch, ha-select, ha-textfield { width:100%; }
  `;

  public setConfig(config: MatchesCardConfig) {
    this.config = { ...config };
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    return html`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor z meczami"
          .hass=${this.hass}
          .value=${this.config.entity}
          @value-changed=${this._change("entity")}
        ></ha-entity-picker>

        <ha-textfield label="Nazwa" .value=${this.config.name || ""} @input=${this._change("name")}></ha-textfield>

        <ha-select
          label="Wypełnienie wierszy"
          .value=${this.config.fill || "gradient"}
          @selected=${this._change("fill")}
        >
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Brak</mwc-list-item>
        </ha-select>

        <ha-switch .checked=${this.config.show_name} @change=${this._change("show_name")}>Pokaż nazwę</ha-switch>
        <ha-switch .checked=${this.config.show_logos} @change=${this._change("show_logos")}>Pokaż loga</ha-switch>
        <ha-switch .checked=${this.config.show_result_symbol} @change=${this._change("show_result_symbol")}>Pokaż symbol wyniku</ha-switch>
      </div>
    `;
  }

  private _change(field: keyof MatchesCardConfig) {
    return (e: any) => {
      const value =
        e.target.checked !== undefined ? e.target.checked : e.detail?.value ?? e.target.value;
      this.config = { ...this.config, [field]: value };
      fireEvent(this, "config-changed", { config: this.config });
    };
  }
}
