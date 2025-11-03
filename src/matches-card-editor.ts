// ============================================================================
//  Matches Card Editor – v0.3.100
//  Edytor wizualny dla karty "matches-card" (GUI w Lovelace)
// ============================================================================

import { html, LitElement, TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "custom-card-helpers";

@customElement("matches-card-editor")
export class MatchesCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config: any = {};

  // ===============================
  //  Ustawienia przekazane z karty
  // ===============================
  public setConfig(config: any): void {
    this._config = { ...config };
  }

  // ===============================
  //  Szablon GUI edytora
  // ===============================
  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;

    const c = this._config || {};

    return html`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor z meczami"
          .hass=${this.hass}
          .value=${c.entity || ""}
          @value-changed=${this._valueChanged("entity")}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-textfield
          label="Nazwa karty"
          .value=${c.name || ""}
          @input=${this._valueChanged("name")}
        ></ha-textfield>

        <ha-select
          label="Styl wypełnienia"
          .value=${c.fill || "gradient"}
          @selected=${this._valueChanged("fill")}
        >
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Brak</mwc-list-item>
        </ha-select>

        <div class="switches">
          <ha-switch
            .checked=${c.show_name ?? true}
            @change=${this._toggleChanged("show_name")}
          ></ha-switch>
          <label>Pokaż nazwę karty</label>

          <ha-switch
            .checked=${c.show_logos ?? true}
            @change=${this._toggleChanged("show_logos")}
          ></ha-switch>
          <label>Pokaż loga drużyn</label>

          <ha-switch
            .checked=${c.show_result_symbol ?? true}
            @change=${this._toggleChanged("show_result_symbol")}
          ></ha-switch>
          <label>Pokaż symbol wyniku (W/L/D)</label>
        </div>
      </div>
    `;
  }

  // ===============================
  //  Obsługa zmian w polach tekstowych
  // ===============================
  private _valueChanged(key: string) {
    return (ev: Event): void => {
      const target = ev.target as any;
      const value =
        target.value !== undefined
          ? target.value
          : target.detail?.value ?? "";

      this._config = { ...this._config, [key]: value };
      this._fireChange();
    };
  }

  // ===============================
  //  Obsługa zmian przełączników
  // ===============================
  private _toggleChanged(key: string) {
    return (ev: Event): void => {
      const target = ev.target as any;
      const value = !!target.checked;
      this._config = { ...this._config, [key]: value };
      this._fireChange();
    };
  }

  // ===============================
  //  Emituj zdarzenie config-changed
  // ===============================
  private _fireChange(): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = [
    css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
      }

      ha-select,
      ha-textfield,
      ha-entity-picker {
        width: 100%;
      }

      .switches {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 6px 12px;
        margin-top: 12px;
      }

      label {
        font-size: 0.9em;
        color: var(--primary-text-color);
      }
    `,
  ];
}