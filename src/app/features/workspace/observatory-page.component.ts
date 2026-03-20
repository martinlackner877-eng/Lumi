import { Component } from '@angular/core';

@Component({
  selector: 'app-observatory-page',
  standalone: true,
  template: `
    <section class="page-shell">
      <header class="page-hero">
        <div>
          <p class="section-eyebrow">Observatory</p>
          <h1 class="page-title">Quantum Control Deck</h1>
          <p class="page-copy">
            The first workspace view is in place: dark-glass surfaces, neon structure and a
            routing shell ready for real modules.
          </p>
        </div>

        <div class="hero-chip">
          <p class="hero-chip__label">Current State</p>
          <p class="hero-chip__value">Core layout online</p>
        </div>
      </header>

      <div class="page-grid">
        <article class="page-card page-card--wide">
          <h2 class="page-card__title">Signal Matrix</h2>
          <p class="page-card__copy">
            This area is ready for the primary dashboard, live telemetry and luminous
            intelligence surfaces.
          </p>

          <div class="kpi-grid">
            <div class="kpi-tile">
              <p class="kpi-tile__label">Shell</p>
              <p class="kpi-tile__value">Authenticated</p>
            </div>
            <div class="kpi-tile">
              <p class="kpi-tile__label">Routing</p>
              <p class="kpi-tile__value">3 live nodes</p>
            </div>
            <div class="kpi-tile">
              <p class="kpi-tile__label">Theme</p>
              <p class="kpi-tile__value">Quantum Academia</p>
            </div>
            <div class="kpi-tile">
              <p class="kpi-tile__label">Persistence</p>
              <p class="kpi-tile__value">Local storage</p>
            </div>
          </div>
        </article>

        <article class="page-card page-card--narrow">
          <h2 class="page-card__title">Luminous Channels</h2>
          <p class="page-card__copy">
            Navigation routes are live and the shell can now host actual feature modules.
          </p>

          <div class="data-list">
            <div class="data-row">
              <span class="data-row__label">Sidebar</span>
              <span class="data-row__value">Collapsible</span>
            </div>
            <div class="data-row">
              <span class="data-row__label">Auth Gate</span>
              <span class="data-row__value">Signals based</span>
            </div>
            <div class="data-row">
              <span class="data-row__label">Visual Layer</span>
              <span class="data-row__value">Glow ready</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class ObservatoryPageComponent {}
