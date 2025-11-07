// Editor for Matches Card – stable (no BIND issues)
// Clean change handlers + config-changed events.

import { css, html, LitElement } from 'lit';

const fireEvent = (node, type, detail = {}, options = {}) => {
  const event = new Event(type, {
    bubbles: options.bubbles ?? true,
    cancelable: options.cancelable ?? false,
    composed: options.composed ?? true,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

class MatchesCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { attribute: false },
      _helpers: { attribute: false },
    };
  }

  static styles = css`
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .label { font-weight: 600; opacity: .8; }
    .inline { display: flex; gap: 10px; align-items: center; }
    input[type="number"] { width: 110px; }
    input[type="color"] { width: 42px; height: 32px; padding: 0; border: none; background: none; }
    input[type="text"], input[type="number"] {
      min-height: 36px;
      box-sizing: border-box;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, rgba(0,0,0,.2));
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .switch { display:flex; align-items:center; gap:10px; }
  `;

  setConfig(config) {
    this._config = {
      show_logos: true,
      name_col_width: 60,
      logo_col_width: 10,
      score_col_width: 15,
      meta_col_width: 15,
      max_rows: 20,
      ...config,
    };
  }

  get value() {
    return this._config;
  }

  // HA calls this if needed; not strictly required but helps when HA loads helpers
  async loadCardHelpers() {
    if (!this._helpers) this._helpers = await (window.loadCardHelpers?.() || Promise.resolve(undefined));
  }

  render() {
    if (!this.hass) return html``;
    const c = this._config ?? {};
    return html`
      <div class="row">
        <div class="field">
          <div class="label">Entity (sensor with matches)</div>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${c.entity || ''}
            .configValue=${'entity'}
            @value-changed=${this._onHaValue}
            allow-custom-entity
          ></ha-entity-picker>
        </div>
        <div class="field">
          <div class="label">Title</div>
          <input type="text" .value=${c.title ?? ''} data-key="title" @input=${this._onText} placeholder="Matches" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <div class="label">Subtitle</div>
          <input type="text" .value=${c.subtitle ?? ''} data-key="subtitle" @input=${this._onText} placeholder="e.g. Ekstraklasa / Round 12" />
        </div>

        <div class="field switch">
          <ha-switch
            .checked=${!!c.show_logos}
            @change=${(e) => this._update({ show_logos: e.currentTarget.checked })}
          ></ha-switch>
          <div class="label">Show logos</div>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <div class="label">Max rows</div>
          <input type="number" min="1" max="50" .value=${Number(c.max_rows ?? 20)} data-key="max_rows" @input=${this._onNumber} />
        </div>
        <div class="field">
          <div class="label">Column widths (%) — Name / Score / Meta</div>
          <div class="inline">
            <input type="number" min="10" max="90" .value=${Number(c.name_col_width ?? 60)} data-key="name_col_width" @input=${this._onNumber} />
            <input type="number" min="5" max="50" .value=${Number(c.score_col_width ?? 15)} data-key="score_col_width" @input=${this._onNumber} />
            <input type="number" min="5" max="50" .value=${Number(c.meta_col_width ?? 15)} data-key="meta_col_width" @input=${this._onNumber} />
          </div>
          ${c.show_logos ? html`
            <div style="margin-top:8px;">
              <div class="label">Logo column width (%)</div>
              <input type="number" min="5" max="30" .value=${Number(c.logo_col_width ?? 10)} data-key="logo_col_width" @input=${this._onNumber} />
            </div>
          ` : html``}
        </div>
      </div>

      <div class="row">
        <div class="field">
          <div class="label">Background color</div>
          <div class="inline">
            <input type="color" .value=${this._toColor(c.bg_color)} @input=${(e)=>this._onColor(e,'bg_color')} />
            <input type="text" .value=${c.bg_color ?? ''} data-key="bg_color" @input=${this._onText} placeholder="#1f1f1f or linear-gradient(...)" />
          </div>
          <small>Accepts HEX (e.g. #1f1f1f) or CSS gradient (linear-gradient(...)).</small>
        </div>
        <div class="field">
          <div class="label">Text color</div>
          <div class="inline">
            <input type="color" .value=${this._toColor(c.text_color)} @input=${(e)=>this._onColor(e,'text_color')} />
            <input type="text" .value=${c.text_color ?? ''} data-key="text_color" @input=${this._onText} placeholder="#ffffff" />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <div class="label">Accent color (LIVE dot / outline)</div>
          <div class="inline">
            <input type="color" .value=${this._toColor(c.accent_color)} @input=${(e)=>this._onColor(e,'accent_color')} />
            <input type="text" .value=${c.accent_color ?? ''} data-key="accent_color" @input=${this._onText} placeholder="#03a9f4" />
          </div>
        </div>
      </div>
    `;
  }

  _toColor(v) {
    // If it's a gradient or empty, default the color picker to a safe HEX
    if (!v || typeof v !== 'string' || v.includes('gradient')) return '#1f1f1f';
    // Ensure starts with '#'
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v;
    return '#1f1f1f';
  }

  _onText = (e) => {
    const key = e.currentTarget?.dataset?.key;
    if (!key) return;
    const val = e.currentTarget.value;
    this._update({ [key]: val });
  };

  _onNumber = (e) => {
    const key = e.currentTarget?.dataset?.key;
    if (!key) return;
    const raw = e.currentTarget.value;
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    this._update({ [key]: num });
  };

  _onColor(e, key) {
    const val = e.currentTarget.value; // HEX from input[type=color]
    this._update({ [key]: val });
  }

  _onHaValue = (e) => {
    // ha-entity-picker fires {detail: {value}}
    const key = e.currentTarget?.configValue || 'entity';
    const val = e.detail?.value ?? e.target?.value ?? '';
    this._update({ [key]: val });
  };

  _update(partial) {
    // merge + emit 'config-changed'
    this._config = { ...(this._config || {}), ...partial };
    fireEvent(this, 'config-changed', { config: this._config });
  }
}

customElements.define('matches-card-editor', MatchesCardEditor);