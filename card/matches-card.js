// Matches Card – non-accordion stable (v0.3.018)
// HACS path: hacsfiles/matches-card/card/matches-card.js
// Works with HA modern frontend (Lit 2). No bundler required.

import { css, html, LitElement, nothing } from 'lit';

const CARD_VERSION = '0.3.018';

// HACS card registry (shows pretty name in "Add card" dialog)
if (!window.customCards) window.customCards = [];
window.customCards.push({
  type: 'matches-card',
  name: 'Matches Card',
  description: 'Displays football matches (no accordion) with logos, scores, and live indicator.',
  preview: true,
});

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

const asPct = (v, def) => {
  if (v === undefined || v === null || v === '') return def;
  const n = Number(v);
  if (Number.isNaN(n)) return def;
  return `${n}%`;
};

// Default logos resolver — keep your repo images, no external fetch
const logoUrl = (file) =>
  file?.startsWith('/') ? file : `/local/community/matches-card/logo/${file ?? 'default.png'}`;

class MatchesCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { attribute: false },
    };
  }

  static get styles() {
    return css`
      :host {
        --mc-bg: var(--card-background-color);
        --mc-fg: var(--primary-text-color);
        --mc-accent: var(--primary-color);
      }
      ha-card {
        background: var(--mc-bg);
        color: var(--mc-fg);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        font-weight: 600;
      }
      .subtitle {
        opacity: 0.7;
        font-weight: 500;
        font-size: 0.9em;
      }
      .table {
        display: grid;
        row-gap: 8px;
        padding: 8px 12px 12px;
      }
      .row {
        display: grid;
        align-items: center;
        gap: 8px;
        border-radius: 10px;
        padding: 6px 8px;
      }
      .row:is(.live) {
        outline: 2px solid var(--mc-accent);
      }
      .cell {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .team {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .score {
        justify-content: center;
        font-weight: 700;
      }
      .meta {
        justify-content: flex-end;
        opacity: 0.8;
        font-variant-numeric: tabular-nums;
      }
      .logo {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        object-fit: contain;
        background: rgba(0,0,0,.05);
      }
      .live-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mc-accent);
        margin-right: 6px;
        animation: pulse 1.2s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0.7; }
      }
    `;
  }

  static getConfigElement() {
    // editor is a separate file in /card/
    return import('./matches-card-editor.js').then(() =>
      document.createElement('matches-card-editor')
    );
  }

  static getStubConfig(hass) {
    const anyEntity = Object.keys(hass?.states ?? {}).find((e) =>
      e.startsWith('sensor.')
    );
    return {
      entity: anyEntity || '',
      show_logos: true,
      name_col_width: 60,
      logo_col_width: 10,
      score_col_width: 15,
      meta_col_width: 15,
      bg_color: '',
      text_color: '',
      accent_color: '',
      title: 'Matches',
      subtitle: '',
      max_rows: 8,
    };
  }

  setConfig(config) {
    if (!config) throw new Error('No config');
    if (!config.entity) {
      // allow empty during editor creation; validation will happen in editor
      config.entity = '';
    }
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

  getCardSize() {
    // approximate rows + header
    const rows = Math.min(this._getMatches().length, this._config.max_rows ?? 8);
    return 1 + Math.max(1, Math.floor(rows * 0.9));
  }

  render() {
    if (!this._config) return nothing;

    const bg = this._config.bg_color?.trim()
      ? this._config.bg_color
      : getComputedStyle(this).getPropertyValue('--card-background-color') || '#1f1f1f';

    const fg = this._config.text_color?.trim()
      ? this._config.text_color
      : getComputedStyle(this).getPropertyValue('--primary-text-color') || '#fff';

    const acc = this._config.accent_color?.trim()
      ? this._config.accent_color
      : getComputedStyle(this).getPropertyValue('--primary-color') || '#03a9f4';

    const gridTemplate = [
      this._config.show_logos ? asPct(this._config.logo_col_width, '10%') : null,
      asPct(this._config.name_col_width, '60%'),
      asPct(this._config.score_col_width, '15%'),
      asPct(this._config.meta_col_width, '15%'),
    ]
      .filter(Boolean)
      .join(' ');

    const rows = this._getMatches();

    return html`
      <ha-card style=${`--mc-bg:${bg};--mc-fg:${fg};--mc-accent:${acc}`}>
        ${this._renderHeader()}
        <div class="table">
          ${rows.length === 0
            ? html`<div class="row" style=${`display:flex;justify-content:center;color:rgba(255,255,255,.6)`}>
                ${this._t('No matches')}
              </div>`
            : rows.slice(0, this._config.max_rows).map((m, idx) =>
                this._renderRow(m, idx, gridTemplate)
              )}
        </div>
      </ha-card>
    `;
  }

  _renderHeader() {
    const title = this._config.title || 'Matches';
    const subtitle = this._config.subtitle || '';
    return html`
      <div class="header">
        <div>${title}</div>
        ${subtitle ? html`<div class="subtitle">${subtitle}</div>` : nothing}
      </div>
    `;
  }

  _renderRow(m, idx, gridTemplate) {
    const showLogos = !!this._config.show_logos;

    const isLive =
      (m.status || '').toString().toUpperCase().includes('LIVE') ||
      (m.live === true);

    const home = m.home || m.home_team || '';
    const away = m.away || m.away_team || '';
    const score =
      m.score ??
      m.result ??
      (m.home_score != null && m.away_score != null
        ? `${m.home_score}–${m.away_score}`
        : (m.time || ''));

    const when =
      m.when ??
      [m.date, m.time].filter(Boolean).join(' ') ||
      m.kickoff ||
      '';

    const hLogo = showLogos ? (m.home_logo || `${(home || 'home').toLowerCase()}.png`) : null;
    const aLogo = showLogos ? (m.away_logo || `${(away || 'away').toLowerCase()}.png`) : null;

    return html`
      <div
        class="row ${isLive ? 'live' : ''}"
        style=${`grid-template-columns:${gridTemplate}; background: ${idx % 2 ? 'rgba(0,0,0,.04)' : 'transparent'}`}
      >
        ${showLogos
          ? html`
              <div class="cell">
                <img class="logo" src="${logoUrl(hLogo)}" alt="H" />
                <img class="logo" src="${logoUrl(aLogo)}" alt="A" />
              </div>
            `
          : nothing}
        <div class="cell team" title="${home} vs ${away}">
          ${isLive ? html`<span class="live-dot"></span>` : nothing}
          <span class="team">${home}</span>
          <span style="opacity:.6;margin:0 6px;">vs</span>
          <span class="team">${away}</span>
        </div>
        <div class="cell score">${score || '-'}</div>
        <div class="cell meta">${when}</div>
      </div>
    `;
  }

  _t(s) {
    return s;
  }

  _getMatches() {
    const entityId = this._config.entity;
    const st = entityId ? this.hass?.states?.[entityId] : undefined;
    if (!st) return [];
    // Supported shapes:
    // attributes.matches: [{home,away,home_logo,away_logo,score,status,date,time,when,live}]
    // OR state as JSON string (failsafe)
    let items = [];
    const a = st.attributes || {};
    if (Array.isArray(a.matches)) items = a.matches;
    else if (a.last_matches && Array.isArray(a.last_matches)) items = a.last_matches;
    else if (a.next_matches && Array.isArray(a.next_matches)) items = a.next_matches;
    else {
      try {
        const parsed = JSON.parse(st.state);
        if (Array.isArray(parsed)) items = parsed;
      } catch (e) {
        // ignore
      }
    }
    // Normalize a bit
    return (items || []).map((m) => ({
      home: m.home ?? m.home_team ?? m.h,
      away: m.away ?? m.away_team ?? m.a,
      home_logo: m.home_logo ?? m.h_logo,
      away_logo: m.away_logo ?? m.a_logo,
      score: m.score ?? m.result,
      status: m.status,
      date: m.date,
      time: m.time,
      when: m.when,
      live: m.live,
      home_score: m.home_score,
      away_score: m.away_score,
      league: m.league,
    }));
  }
}

customElements.define('matches-card', MatchesCard);