import { Component } from '@angular/core';

@Component({
  selector: 'app-archive-page',
  standalone: true,
  template: `
    <section class="page-shell">
      <header class="page-hero">
        <div>
          <p class="section-eyebrow">Archive</p>
          <h1 class="page-title">Codex Archive</h1>
          <p class="page-copy">
            Placeholder route for manuscripts, timelines and structured records inside the
            LUMI shell.
          </p>
        </div>

        <div class="hero-chip">
          <p class="hero-chip__label">Archive State</p>
          <p class="hero-chip__value">Cold storage standby</p>
        </div>
      </header>

      <div class="page-grid">
        <article class="page-card page-card--wide">
          <h2 class="page-card__title">Vault Entries</h2>
          <p class="page-card__copy">
            Use this route later for document streams, session history or saved luminous
            artifacts.
          </p>

          <div class="data-list">
            <div class="data-row">
              <span class="data-row__label">Chronicles</span>
              <span class="data-row__value">0 indexed volumes</span>
            </div>
            <div class="data-row">
              <span class="data-row__label">Retention</span>
              <span class="data-row__value">Ready for persistence layer</span>
            </div>
            <div class="data-row">
              <span class="data-row__label">Visual State</span>
              <span class="data-row__value">Theme aligned</span>
            </div>
          </div>
        </article>

        <article class="page-card page-card--narrow">
          <h2 class="page-card__title">Codex Metrics</h2>
          <div class="kpi-grid">
            <div class="kpi-tile">
              <p class="kpi-tile__label">Records</p>
              <p class="kpi-tile__value">Prototype</p>
            </div>
            <div class="kpi-tile">
              <p class="kpi-tile__label">Schema</p>
              <p class="kpi-tile__value">To define</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class ArchivePageComponent {}
