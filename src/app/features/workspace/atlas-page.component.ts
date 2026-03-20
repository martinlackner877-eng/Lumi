import { Component } from '@angular/core';

@Component({
  selector: 'app-atlas-page',
  standalone: true,
  template: `
    <section class="page-shell">
      <header class="page-hero">
        <div>
          <p class="section-eyebrow">Atlas</p>
          <h1 class="page-title">Research Atlas</h1>
          <p class="page-copy">
            Placeholder route for future maps, knowledge graphs and networked theory modules.
          </p>
        </div>

        <div class="hero-chip">
          <p class="hero-chip__label">Module Status</p>
          <p class="hero-chip__value">Reserved for step 2</p>
        </div>
      </header>

      <div class="page-grid">
        <article class="page-card page-card--wide">
          <h2 class="page-card__title">Connected Nodes</h2>
          <p class="page-card__copy">
            This route is ready for datasets, graph views and exploratory navigation patterns.
          </p>

          <div class="data-list">
            <div class="data-row">
              <span class="data-row__label">Knowledge Layer</span>
              <span class="data-row__value">Pending</span>
            </div>
            <div class="data-row">
              <span class="data-row__label">Topology</span>
              <span class="data-row__value">Awaiting data model</span>
            </div>
            <div class="data-row">
              <span class="data-row__label">Interaction</span>
              <span class="data-row__value">Route scaffolded</span>
            </div>
          </div>
        </article>

        <article class="page-card page-card--narrow">
          <h2 class="page-card__title">Readiness</h2>
          <div class="kpi-grid">
            <div class="kpi-tile">
              <p class="kpi-tile__label">Surface</p>
              <p class="kpi-tile__value">Glass</p>
            </div>
            <div class="kpi-tile">
              <p class="kpi-tile__label">State</p>
              <p class="kpi-tile__value">Standalone</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class AtlasPageComponent {}
