// matches-card-editor.js  v0.3.010
// Minimalny, stabilny edytor bez podglądu demo. Działa od HA 2024.6+ (ha-form).

/* eslint-disable no-undef */
import { LitElement, html, css } from "lit";

const DEFAULTS = {
  entity: "",
  fill: "gradient",            // "gradient" | "zebra" | "none"
  gradient_enabled: true,      // dodatkowy toggle – można go zostawić na przyszłość
  gradient_left: "rgba(0,0,0,0.0)",
  gradient_right: "rgba(0,0,0,0.35)",
  zebra_even: "rgba(0,0,0,0.00)",
  zebra_odd: "rgba(0,0,0,0.06)",
  zebra_opacity: 0.06
};

class MatchesCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
    };
  }

  static get styles() {
    return css`
      .section { margin: 16px 0 8px; font-weight: 600; }
      .hint { color: var(--secondary-text-color); font-size: 0.88em; }
      ha-form { --spacing: 12px; }
    `;
  }

  setConfig(config) {
    // scalamy z domyślnymi (nic nie nadpisujemy jeśli przyjdzie z YAML)
    this._config = { ...DEFAULTS, ...config };
  }

  // --- SCHEMAT HA-FORM (to wcześniej brakowało i stąd był błąd "map of undefined") ---
  _schema() {
    return [
      {
        name: "entity",
        selector: { entity: { domain: "sensor" } },
        required: true,
      },
      {
        name: "fill",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "gradient", label: "Gradient" },
              { value: "zebra", label: "Zebra" },
              { value: "none", label: "Brak" },
            ],
          },
        },
      },
      {
        name: "gradient_enabled",
        selector: { boolean: {} },
        context: { nested: "gradient" },
      },
      // Kolory gradientu (pokazuj sensownie dla fill=gradient)
      {
        name: "gradient_left",
        selector: { color: {} },
        context: { show_if: { fill: "gradient" } },
      },
      {
        name: "gradient_right",
        selector: { color: {} },
        context: { show_if: { fill: "gradient" } },
      },
      // Zebra
      {
        name: "zebra_even",
        selector: { color: {} },
        context: { show_if: { fill: "zebra" } },
      },
      {
        name: "zebra_odd",
        selector: { color: {} },
        context: { show_if: { fill: "zebra" } },
      },
      {
        name: "zebra_opacity",
        selector: { number: { min: 0, max: 1, step: 0.01, mode: "box" } },
        context: { show_if: { fill: "zebra" } },
      },
    ];
  }

  // HA woła to po polsku sam; jak chcesz twarde polskie etykiety — poniżej:
  _label = (schema) => {
    const map = {
      entity: "Encja (sensor)",
      fill: "Wypełnienie tła",
      gradient_enabled: "Włącz gradient tła",
      gradient_left: "Gradient — kolor lewy",
      gradient_right: "Gradient — kolor prawy",
      zebra_even: "Zebra — kolor parzystych",
      zebra_odd: "Zebra — kolor nieparzystych",
      zebra_opacity: "Zebra — krycie (0–1)",
    };
    return map[schema.name] ?? schema.name;
  };

  render() {
    if (!this._config) return html``;

    // prosty nagłówek + ha-form
    return html`
      <div class="section">Podstawowe</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        @value-changed=${this._valueChanged}>
      </ha-form>

      <p class="hint">
        Pola odzwierciedlają YAML: <code>entity</code>, <code>fill</code>,
        <code>gradient_left/right</code>, <code>zebra_even/odd</code>, <code>zebra_opacity</code>.
      </p>
    `;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    const newVal = ev.detail?.value ?? {};

    // prosta zależność: jeśli fill ≠ gradient, wyłącz przełącznik gradientu
    if (newVal.fill && newVal.fill !== "gradient") {
      newVal.gradient_enabled = false;
    }
    // scal z istniejącą konfiguracją
    const merged = { ...this._config, ...newVal };

    // emituje standardowe zdarzenie wymagane przez HA
    this._config = merged;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: merged } })
    );
  }

  // Przydatne dla Lovelace GUI – widoczny tytuł
  static getStubConfig() {
    return { ...DEFAULTS, entity: "" };
  }
}

// Rejestracja elementu (bez błędu „already defined” przy hot-reload)
if (!customElements.get("matches-card-editor")) {
  customElements.define("matches-card-editor", MatchesCardEditor);
}