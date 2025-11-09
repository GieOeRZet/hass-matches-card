// ===================================================================
// Matches Card Editor - wersja 0.3.034
// Konfigurator karty dla Lovelace (działa z lit-element)
// ===================================================================

import { html, css, LitElement } from "lit";

class MatchesCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  setConfig(config) {
    this.config = config;
  }

  _valueChanged(ev) {
    if (!this.config || !this.hass) return;
    const target = ev.target;
    if (target.configValue) {
      this.config = {
        ...this.config,
        [target.configValue]: target.checked ?? target.value,
      };
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: this.config },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    if (!this.config) return html``;

    return html`
      <div class="form">
        <ha-textfield
          label="Tytuł"
          .value=${this.config.title || ""}
          .configValue=${"title"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <ha-switch
          .checked=${this.config.show_logos !== false}
          .configValue=${"show_logos"}
          @change=${this._valueChanged}
        >
          Pokaż loga
        </ha-switch>

        <ha-switch
          .checked=${this.config.show_league !== false}
          .configValue=${"show_league"}
          @change=${this._valueChanged}
        >
          Pokaż ligę
        </ha-switch>
      </div>
    `;
  }

  static get styles() {
    return css`
      .form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
      }
      ha-textfield {
        width: 100%;
      }
      ha-switch {
        margin-top: 4px;
      }
    `;
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
