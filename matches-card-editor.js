// ============================================================================
//   Matches Card – Visual Editor (modern, collapsible, debounced)
//   Works with v0.3.001-MOD
// ============================================================================

class MatchesCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._debouncers = {};
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config));
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  // ---------------------------------------------------------
  //     DEBOUNCE – 500 ms OR ONLY ON BLUR (for typing)
  // ---------------------------------------------------------
  _debounce(key, fn, delay = 500) {
    if (this._debouncers[key]) clearTimeout(this._debouncers[key]);
    this._debouncers[key] = setTimeout(() => fn(), delay);
  }

  // ---------------------------------------------------------
  //     CONFIG UPDATE (but NOT immediately refreshing UI)
  // ---------------------------------------------------------
  _updateConfig(key, value) {
    this._config[key] = value;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _updateNested(root, key, value) {
    this._config[root] = this._config[root] || {};
    this._config[root][key] = value;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  // ---------------------------------------------------------
  //     HELPER COMPONENT GENERATORS
  // ---------------------------------------------------------
  _numInput(label, root, key, min, max, step = 1) {
    const value = this._config[root]?.[key] ?? "";
    const id = `${root}-${key}`;

    return `
      <div class="field">
        <label for="${id}">${label}</label>
        <input 
          id="${id}" 
          type="number" 
          min="${min}" 
          max="${max}" 
          step="${step}" 
          value="${value}"
        />
      </div>
    `;
  }

  _colorInput(label, root, key) {
    const value = this._config[root]?.[key] ?? "#000000";
    const id = `${root}-${key}`;

    return `
      <div class="field">
        <label for="${id}">${label}</label>
        <input type="color" id="${id}" value="${value}">
      </div>
    `;
  }

  _switch(label, key) {
    const val = this._config[key] ?? true;
    const id = `switch-${key}`;

    return `
      <div class="field">
        <label for="${id}">${label}</label>
        <input type="checkbox" id="${id}" ${val ? "checked" : ""}>
      </div>
    `;
  }

  _fillModeSelector() {
    const val = this._config.fill_mode || "gradient";

    return `
      <div class="field">
        <label>Fill mode</label>
        <select id="fill_mode">
          <option value="gradient" ${val === "gradient" ? "selected" : ""}>Gradient</option>
          <option value="zebra" ${val === "zebra" ? "selected" : ""}>Zebra</option>
          <option value="clear" ${val === "clear" ? "selected" : ""}>Clear</option>
        </select>
      </div>
    `;
  }

  // ---------------------------------------------------------
  //     MAIN RENDER
  // ---------------------------------------------------------
  render() {
    this.innerHTML = `
      <style>
        .section {
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .section-header {
          padding: 10px;
          background: var(--ha-card-background, #f2f2f2);
          cursor: pointer;
          font-weight: bold;
        }
        .section-body {
          padding: 10px 14px;
          display: none;
        }
        .field {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0;
        }
        input[type="number"] {
          width: 80px;
        }
        input[type="color"] {
          width: 60px;
          height: 28px;
          padding: 0;
          border: none;
        }
      </style>

      <div class="editor">

        <!-- GENERAL -->
        <div class="section" id="sec-general">
          <div class="section-header">General</div>
          <div class="section-body">
            ${this._switch("Show card name", "show_name")}
            ${this._switch("Show team logos", "show_logos")}
            ${this._switch("Show full team names", "full_team_names")}
          </div>
        </div>

        <!-- FILL MODE -->
        <div class="section" id="sec-fill">
          <div class="section-header">Fill mode</div>
          <div class="section-body">
            ${this._fillModeSelector()}
            ${this._colorInput("Zebra color", "", "zebra_color")}
          </div>
        </div>

        <!-- GRADIENT -->
        <div class="section" id="sec-gradient">
          <div class="section-header">Gradient colors (WIN / DRAW / LOSS)</div>
          <div class="section-body">
            ${this._colorInput("Win color", "colors", "win")}
            ${this._colorInput("Draw color", "colors", "draw")}
            ${this._colorInput("Loss color", "colors", "loss")}
            ${this._numInput("Gradient alpha", "gradient", "alpha", 0, 1, 0.05)}
          </div>
        </div>

        <!-- TEXT SIZES -->
        <div class="section" id="sec-fonts">
          <div class="section-header">Font sizes</div>
          <div class="section-body">
            ${this._numInput("Date size", "font_size", "date", 0.5, 2, 0.1)}
            ${this._numInput("Status size", "font_size", "status", 0.5, 2, 0.1)}
            ${this._numInput("Team name size", "font_size", "teams", 0.5, 2, 0.1)}
            ${this._numInput("Score font size", "font_size", "score", 0.5, 2, 0.1)}
          </div>
        </div>

        <!-- ICON SIZES -->
        <div class="section" id="sec-icons">
          <div class="section-header">Icon sizes</div>
          <div class="section-body">
            ${this._numInput("League icon", "icon_size", "league", 10, 60)}
            ${this._numInput("Team crest", "icon_size", "crest", 10, 60)}
            ${this._numInput("Result circle", "icon_size", "result", 10, 60)}
          </div>
        </div>

      </div>
    `;

    // ACTIVATE ACCORDIONS
    this.querySelectorAll(".section").forEach(sec => {
      sec.querySelector(".section-header").addEventListener("click", () => {
        const body = sec.querySelector(".section-body");
        body.style.display = body.style.display === "block" ? "none" : "block";
      });
    });

    // LISTENERS
    this._attachListeners();
  }

  // ---------------------------------------------------------
  //     LISTENERS WITH DEBOUNCE + BLUR APPLY
  // ---------------------------------------------------------
  _attachListeners() {
    // NUMBER INPUTS
    this.querySelectorAll("input[type=number]").forEach(el => {
      const [root, key] = el.id.split("-");
      el.addEventListener("input", () => {
        this._debounce(el.id, () => {
          this._updateNested(root, key, Number(el.value));
        });
      });

      el.addEventListener("blur", () => {
        this._updateNested(root, key, Number(el.value));
      });
    });

    // COLOR INPUTS
    this.querySelectorAll("input[type=color]").forEach(el => {
      const [root, key] = el.id.split("-");
      el.addEventListener("input", () => {
        this._debounce(el.id, () => {
          this._updateNested(root, key, el.value);
        });
      });
      el.addEventListener("blur", () => {
        this._updateNested(root, key, el.value);
      });
    });

    // SWITCHES
    this.querySelectorAll("input[type=checkbox]").forEach(el => {
      const key = el.id.replace("switch-", "");
      el.addEventListener("change", () => {
        this._updateConfig(key, el.checked);
      });
    });

    // SELECTS
    this.querySelectorAll("select").forEach(el => {
      el.addEventListener("change", () => {
        if (el.id === "fill_mode") {
          this._updateConfig("fill_mode", el.value);
        }
      });
    });
  }
}

customElements.define("matches-card-editor", MatchesCardEditor);
