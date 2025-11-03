// SPDX-License-Identifier: MIT
// Matches Card – Editor (ha-form schema), v0.3.2.002

import { LitElement, html, css, nothing } from "lit";

const EDITOR_TAG = "matches-card-editor";
const CARD_TAG = "matches-card";

class MatchesCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _schema: { state: true },
      _showAdvanced: { state: true },
    };
  }

  setConfig(config) {
    this._config = { ...config };
    this._showAdvanced = true; // pokaż od razu pełne opcje
    this._schema = this._computeSchema();
  }

  // Lovelace ładuje to globalnie – nie musimy importować 'ha-form'
  render() {
    if (!this.hass) return nothing;

    return html`
      <div class="header">
        <div class="title">Matches Card – Edytor</div>
        <div class="sub">Wersja edytora: 0.3.2.002</div>
      </div>

      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        @value-changed=${this._onValueChanged}
      ></ha-form>
    `;
  }

  _onValueChanged(ev) {
    ev.stopPropagation();
    const detail = ev.detail;
    if (!detail) return;

    const newConfig = { ...this._config, ...detail.value };
    this._config = newConfig;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  _computeSchema() {
    // Schemat oparty o selektory HA – nie używa mwc-*
    return [
      {
        name: "entity",
        selector: { entity: { domain: ["sensor"] } },
        required: true,
      },
      { name: "title", selector: { text: {} } },
      { name: "show_badge", selector: { boolean: {} }, default: true },

      {
        name: "font_family",
        selector: { text: {} },
      },
      {
        name: "font_size",
        selector: { number: { min: 0.6, max: 2.0, step: 0.05, mode: "box" } },
        default: 1.0,
      },

      {
        name: "fill_type",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { label: "Gradient (RGBA)", value: "gradient" },
              { label: "Zebra (pasy)", value: "zebra" },
              { label: "Jednolity (solid)", value: "solid" },
              { label: "Brak", value: "none" },
            ],
          },
        },
        default: "gradient",
      },

      // — Gradient
      {
        type: "grid",
        name: "gradient_group",
        schema: [
          {
            name: "gradient_angle",
            selector: { number: { min: 0, max: 360, step: 1, mode: "slider" } },
          },
          { name: "gradient_start", selector: { text: {} } }, // RGBA
          {
            name: "gradient_stop1",
            selector: { number: { min: 0, max: 100, step: 1, mode: "slider" } },
          },
          { name: "gradient_mid", selector: { text: {} } }, // RGBA
          {
            name: "gradient_stop2",
            selector: { number: { min: 0, max: 100, step: 1, mode: "slider" } },
          },
          { name: "gradient_end", selector: { text: {} } }, // RGBA
        ],
        visible: (data) => data?.fill_type === "gradient",
      },

      // — Zebra
      {
        type: "grid",
        name: "zebra_group",
        schema: [
          {
            name: "zebra_size",
            selector: { number: { min: 2, max: 80, step: 1, mode: "box" } },
          },
          {
            name: "zebra_gap",
            selector: { number: { min: 2, max: 80, step: 1, mode: "box" } },
          },
          { name: "zebra_color", selector: { text: {} } }, // RGBA
        ],
        visible: (data) => data?.fill_type === "zebra",
      },

      // — Solid
      {
        name: "solid_color",
        selector: { text: {} }, // RGBA
        visible: (data) => data?.fill_type === "solid",
      },

      // — Card layout
      {
        type: "grid",
        name: "layout_group",
        schema: [
          {
            name: "border_radius",
            selector: { number: { min: 0, max: 32, step: 1, mode: "slider" } },
          },
          {
            name: "card_padding",
            selector: { number: { min: 0, max: 40, step: 1, mode: "slider" } },
          },
        ],
      },
    ];
  }

  static get styles() {
    return css`
      .header { margin-bottom: 8px; }
      .title { font-weight: 800; }
      .sub { opacity: .7; font-size: .9em; }
      ha-form { margin-top: 8px; }
    `;
  }
}

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, MatchesCardEditor);
}
