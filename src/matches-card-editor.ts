import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("matches-card-editor")
export class MatchesCardEditor extends LitElement {
  @property({ attribute: false }) hass;
  @state() config;

  setConfig(config) {
    this.config = config;
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

        <ha-switch
          .checked=${this.config.show_logos}
          @change=${this._change("show_logos")}
          >Pokaż loga</ha-switch
        >
      </div>
    `;
  }

  _change(field) {
    return (ev) => {
      const value =
        ev.target.checked !== undefined
          ? ev.target.checked
          : ev.detail?.value ?? ev.target.value;
      this.config = { ...this.config, [field]: value };
      this.dispatchEvent(
        new CustomEvent("config-changed", { detail: { config: this.config } })
      );
    };
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    ha-switch,
    ha-textfield {
      width: 100%;
    }
  `;
}
