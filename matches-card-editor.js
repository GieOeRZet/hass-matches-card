/* Matches Card – Visual Editor v0.3.011
 * Kompatybilny z Home Assistant 2025.10+
 * Pełny interfejs graficzny (ha-form) + przyciski: Przywróć domyślne / Zaawansowane
 * Autor: GieOeRZet
 */

(() => {
  const VER = "0.3.011";
  console.info(`[MatchesCardEditor] v${VER} loaded ✅`);

  const clone = (x) => JSON.parse(JSON.stringify(x));

  const DEFAULTS = {
    entity: "",
    title: "",
    team_name: "",
    show_logo: true,
    show_badges: true,
    date_format: "YYYY-MM-DD",
    fill: {
      type: "gradient",
      gradient: {
        angle: 135,
        start_color: "#1e3a8a",
        end_color: "#9333ea",
        start_opacity: 1,
        end_opacity: 1,
      },
      zebra: {
        stripe_color: "#000000",
        stripe_opacity: 0.06,
        stripe_width: 18,
        stripe_gap: 18,
        angle: 135,
      },
    },
    style: {
      radius: 16,
      padding: 12,
      border: "",
      typography: {
        font_family: "Inter, Segoe UI, Roboto, sans-serif",
        font_weight: "600",
        title_size: 1.1,
        meta_size: 0.9,
      },
    },
    advanced: {
      debug: false,
      card_mod: "",
    },
  };

  // utils
  const toInt = (v, def) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
  };
  const clamp = (n, a, b) => Math.min(Math.max(n, a), b);

  const fireConfigChanged = (el, cfg) => {
    el.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg } }));
  };

  const decodeToForm = (cfg) => {
    const c = clone(DEFAULTS);
    const m = (obj, key, def) => obj?.[key] ?? def;
    Object.assign(c, cfg);

    return {
      entity: cfg.entity || "",
      title: cfg.title || "",
      team_name: cfg.team_name || "",
      date_format: cfg.date_format || "YYYY-MM-DD",
      show_logo: !!cfg.show_logo,
      show_badges: !!cfg.show_badges,

      fill_type: m(cfg.fill, "type", "none"),
      gradient_angle: m(cfg.fill?.gradient, "angle", 135),
      gradient_start_color: m(cfg.fill?.gradient, "start_color", "#1e3a8a"),
      gradient_end_color: m(cfg.fill?.gradient, "end_color", "#9333ea"),
      gradient_start_opacity: m(cfg.fill?.gradient, "start_opacity", 1),
      gradient_end_opacity: m(cfg.fill?.gradient, "end_opacity", 1),

      zebra_color: m(cfg.fill?.zebra, "stripe_color", "#000000"),
      zebra_opacity: m(cfg.fill?.zebra, "stripe_opacity", 0.06),
      zebra_width: m(cfg.fill?.zebra, "stripe_width", 18),
      zebra_gap: m(cfg.fill?.zebra, "stripe_gap", 18),
      zebra_angle: m(cfg.fill?.zebra, "angle", 135),

      radius: m(cfg.style, "radius", 16),
      padding: m(cfg.style, "padding", 12),
      border: m(cfg.style, "border", ""),
      font_family: m(cfg.style?.typography, "font_family", "Inter, Segoe UI"),
      font_weight: m(cfg.style?.typography, "font_weight", "600"),
      title_size: m(cfg.style?.typography, "title_size", 1.1),
      meta_size: m(cfg.style?.typography, "meta_size", 0.9),

      debug: m(cfg.advanced, "debug", false),
      card_mod: m(cfg.advanced, "card_mod", ""),
    };
  };

  const encodeToConfig = (f) => ({
    entity: f.entity,
    title: f.title,
    team_name: f.team_name,
    date_format: f.date_format,
    show_logo: f.show_logo,
    show_badges: f.show_badges,
    fill: {
      type: f.fill_type,
      gradient: {
        angle: toInt(f.gradient_angle, 135),
        start_color: f.gradient_start_color,
        end_color: f.gradient_end_color,
        start_opacity: clamp(+f.gradient_start_opacity || 1, 0, 1),
        end_opacity: clamp(+f.gradient_end_opacity || 1, 0, 1),
      },
      zebra: {
        stripe_color: f.zebra_color,
        stripe_opacity: clamp(+f.zebra_opacity || 0.06, 0, 1),
        stripe_width: toInt(f.zebra_width, 18),
        stripe_gap: toInt(f.zebra_gap, 18),
        angle: toInt(f.zebra_angle, 135),
      },
    },
    style: {
      radius: toInt(f.radius, 16),
      padding: toInt(f.padding, 12),
      border: f.border,
      typography: {
        font_family: f.font_family,
        font_weight: f.font_weight,
        title_size: +f.title_size,
        meta_size: +f.meta_size,
      },
    },
    advanced: {
      debug: !!f.debug,
      card_mod: f.card_mod,
    },
  });

  class MatchesCardEditor extends HTMLElement {
    static get properties() {
      return { hass: {}, _config: {}, _form: {}, _schema: {}, _showAdvanced: {} };
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = clone(DEFAULTS);
      this._form = decodeToForm(this._config);
      this._schema = this._buildSchema(this._form.fill_type);
      this._showAdvanced = false;
    }

    setConfig(cfg) {
      this._config = cfg ? clone(cfg) : clone(DEFAULTS);
      this._form = decodeToForm(this._config);
      this._schema = this._buildSchema(this._form.fill_type);
      this._render();
    }

    set hass(h) {
      this._hass = h;
      if (this.isConnected) this._render();
    }

    connectedCallback() {
      this._render();
    }

    _onValueChanged(ev) {
      const { value } = ev.detail;
      if (!value) return;
      this._form = { ...this._form, ...value };

      if (value.fill_type !== undefined) {
        this._schema = this._buildSchema(this._form.fill_type);
      }

      const cfg = encodeToConfig(this._form);
      fireConfigChanged(this, cfg);
      this._render();
    }

    _onResetDefaults() {
      this._config = clone(DEFAULTS);
      this._form = decodeToForm(this._config);
      this._schema = this._buildSchema(this._form.fill_type);
      this._render();
      fireConfigChanged(this, this._config);
    }

    _onToggleAdvanced() {
      this._showAdvanced = !this._showAdvanced;
      this._render();
    }

    _buildSchema(fillType) {
      const base = [
        { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
        { name: "title", selector: { text: {} } },
        { name: "team_name", selector: { text: {} } },
        { name: "date_format", selector: { text: {} } },
        { name: "show_logo", selector: { boolean: {} } },
        { name: "show_badges", selector: { boolean: {} } },
        {
          name: "fill_type",
          selector: {
            select: {
              options: [
                { label: "Brak", value: "none" },
                { label: "Gradient", value: "gradient" },
                { label: "Zebra", value: "zebra" },
              ],
            },
          },
        },
      ];

      const gradient = [
        { name: "gradient_angle", selector: { number: { min: 0, max: 360, step: 1 } } },
        { name: "gradient_start_color", selector: { color_rgb: {} } },
        { name: "gradient_end_color", selector: { color_rgb: {} } },
        { name: "gradient_start_opacity", selector: { number: { min: 0, max: 1, step: 0.05 } } },
        { name: "gradient_end_opacity", selector: { number: { min: 0, max: 1, step: 0.05 } } },
      ];

      const zebra = [
        { name: "zebra_color", selector: { color_rgb: {} } },
        { name: "zebra_opacity", selector: { number: { min: 0, max: 1, step: 0.05 } } },
        { name: "zebra_width", selector: { number: { min: 2, max: 64, step: 1 } } },
        { name: "zebra_gap", selector: { number: { min: 2, max: 64, step: 1 } } },
        { name: "zebra_angle", selector: { number: { min: 0, max: 360, step: 1 } } },
      ];

      const style = [
        { name: "radius", selector: { number: { min: 0, max: 64, step: 1 } } },
        { name: "padding", selector: { number: { min: 0, max: 32, step: 1 } } },
        { name: "border", selector: { text: {} } },
      ];

      const typography = [
        { name: "font_family", selector: { text: {} } },
        {
          name: "font_weight",
          selector: {
            select: {
              options: ["400", "500", "600", "700", "800"].map((v) => ({
                label: v,
                value: v,
              })),
            },
          },
        },
        { name: "title_size", selector: { number: { min: 0.6, max: 2, step: 0.05 } } },
        { name: "meta_size", selector: { number: { min: 0.6, max: 1.6, step: 0.05 } } },
      ];

      const advanced = [
        { name: "debug", selector: { boolean: {} } },
        { name: "card_mod", selector: { text: { multiline: true } } },
      ];

      return [
        { type: "grid", name: "base", schema: base },
        ...(fillType === "gradient" ? [{ type: "grid", name: "gradient", schema: gradient }] : []),
        ...(fillType === "zebra" ? [{ type: "grid", name: "zebra", schema: zebra }] : []),
        { type: "grid", name: "style", schema: style },
        { type: "grid", name: "typography", schema: typography },
        ...(this._showAdvanced ? [{ type: "grid", name: "advanced", schema: advanced }] : []),
      ];
    }

    _label(s) {
      const L = {
        entity: "Encja (sensor wyników)",
        title: "Tytuł",
        team_name: "Drużyna (nadpisz)",
        date_format: "Format daty",
        show_logo: "Pokaż logo",
        show_badges: "Odznaki",
        fill_type: "Tło (fill)",
        gradient_angle: "Kąt (°)",
        gradient_start_color: "Kolor początkowy",
        gradient_end_color: "Kolor końcowy",
        gradient_start_opacity: "Krycie start",
        gradient_end_opacity: "Krycie koniec",
        zebra_color: "Kolor pasków",
        zebra_opacity: "Krycie pasków",
        zebra_width: "Szerokość paska",
        zebra_gap: "Odstęp pasków",
        zebra_angle: "Kąt pasków",
        radius: "Zaokrąglenie (px)",
        padding: "Odstęp (px)",
        border: "Obramowanie CSS",
        font_family: "Czcionka",
        font_weight: "Grubość",
        title_size: "Rozmiar tytułu (rem)",
        meta_size: "Rozmiar metadanych (rem)",
        debug: "Debug",
        card_mod: "CSS (card-mod)",
      };
      return L[s.name] || s.name;
    }

    _tpl() {
      return `
        <style>
          :host { display:block; }
          .head {
            display:flex;align-items:center;justify-content:space-between;
            padding:8px 4px;font-size:14px;
          }
          mwc-button {
            --mdc-theme-primary: var(--primary-color);
            font-size:13px;
          }
        </style>
        <div class="head">
          <div><b>Matches Card – Edytor</b> <span style="opacity:0.6">v${VER}</span></div>
          <div>
            <mwc-button dense @click=${() => this._onResetDefaults()}>Przywróć domyślne</mwc-button>
            <mwc-button dense @click=${() => this._onToggleAdvanced()}>
              ${this._showAdvanced ? "Ukryj" : "Pokaż"} zaawansowane
            </mwc-button>
          </div>
        </div>
        <ha-form
          .hass=${this._hass}
          .data=${this._form}
          .schema=${this._schema}
          .computeLabel=${(s) => this._label(s)}
        ></ha-form>
      `;
    }

    _render() {
      if (!this.shadowRoot) return;
      this.shadowRoot.innerHTML = this._tpl();

      const form = this.shadowRoot.querySelector("ha-form");
      if (form) form.addEventListener("value-changed", (e) => this._onValueChanged(e));
    }

    static get defaultConfig() {
      return clone(DEFAULTS);
    }
  }

  if (!customElements.get("matches-card-editor"))
    customElements.define("matches-card-editor", MatchesCardEditor);
})();