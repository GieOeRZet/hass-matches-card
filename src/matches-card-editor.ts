import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("matches-card-editor")
export class MatchesCardEditor extends LitElement {
  @property({ attribute: false }) public hass: any;
  @state() private config: any = {};

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    ha-switch, ha-select, ha-textfield {
      width: 100%;
    }
  `;

  setConfig(config: any) {
    this.config = { ...config };
  }

  render() {
    if (!this.hass || !this.config) return html``;
    return html`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor z meczami"
          .hass=${this.hass}
          .value=${this.config.entity}
          @value-changed=${this._change("entity")}
        ></ha-entity-picker>

        <ha-textfield
          label="Nazwa"
          .value=${this.config.name || ""}
          @input=${this._change("name")}
        ></ha-textfield>

        <ha-select
          label="Wypełnienie wierszy"
          .value=${this.config.fill || "gradient"}
          @selected=${this._change("fill")}
        >
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Brak</mwc-list-item>
        </ha-select>

        <ha-switch
          .checked=${this.config.show_name ?? true}
          @change=${this._change("show_name")}
          >Pokaż nazwę</ha-switch
        >
        <ha-switch
          .checked=${this.config.show_logos ?? true}
          @change=${this._change("show_logos")}
          >Pokaż loga drużyn</ha-switch
        >
        <ha-switch
          .checked=${this.config.show_result_symbol ?? true}
          @change=${this._change("show_result_symbol")}
          >Pokaż symbol wyniku</ha-switch
        >
      </div>
    `;
  }

  private _change(field: string) {
    return (ev: Event) => {
      const target = ev.target as any;
      const value = target.checked ?? target.value ?? target.detail?.value;
      this.config = { ...this.config, [field]: value };
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: this.config },
          bubbles: true,
          composed: true,
        })
      );
    };
  }
}
