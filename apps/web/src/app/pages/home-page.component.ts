import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <img class="hero-logo" src="/BagTag-Logo-Large.png" alt="BagTag luggage tag logo" />
        <p class="eyebrow">Current MVP shape</p>
        <h1>Lost bag reporting without exposing the owner.</h1>
        <p class="lede">
          BagTag splits the product into two clear experiences: a public tag page for whoever finds
          a bag, and a private owner area for managing tags and scan activity.
        </p>

        <div class="actions">
          <a class="primary" routerLink="/t/demo-tag">Try public tag flow</a>
          <a class="secondary" routerLink="/owner">Open owner dashboard</a>
        </div>
      </div>

      <aside class="hero-panel">
        <h2>First vertical slice</h2>
        <ul>
          <li>Health endpoint is live in the API</li>
          <li>Magic-link request and consume endpoints exist as in-memory stubs</li>
          <li>Owner and public routes now exist in the Angular app</li>
        </ul>
      </aside>
    </section>

    <section class="grid">
      <article class="card">
        <span class="label">Public</span>
        <h2>Scanned a bag tag?</h2>
        <p>
          The public flow should let someone report the bag location without exposing the owner's
          email or phone number.
        </p>
        <a routerLink="/t/demo-tag">Open demo tag</a>
      </article>

      <article class="card">
        <span class="label">Owner</span>
        <h2>Manage your tags</h2>
        <p>
          The owner area will become the authenticated dashboard for tag creation, scan history, and
          incoming messages.
        </p>
        <a routerLink="/owner">View owner placeholder</a>
      </article>

      <article class="card">
        <span class="label">Auth</span>
        <h2>Magic-link login</h2>
        <p>
          The API now exposes a stubbed auth flow so the frontend can be wired to a stable contract
          before persistence lands.
        </p>
        <a routerLink="/login">View login placeholder</a>
      </article>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
      gap: 1.2rem;
      margin-bottom: 1.2rem;
    }

    .hero-copy,
    .hero-panel,
    .card {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-soft);
    }

    .hero-copy {
      padding: 2rem;
    }

    .hero-logo {
      display: block;
      width: min(280px, 58vw);
      margin-bottom: 1.25rem;
      object-fit: contain;
      filter: drop-shadow(0 18px 36px rgba(91, 52, 17, 0.14));
    }

    .eyebrow,
    .label {
      display: inline-flex;
      padding: 0.35rem 0.65rem;
      border-radius: 999px;
      background: rgba(201, 107, 44, 0.12);
      color: var(--accent-deep);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    h1 {
      margin-top: 1rem;
      max-width: 11ch;
      font-size: clamp(3rem, 8vw, 5.6rem);
      line-height: 0.95;
      letter-spacing: -0.05em;
    }

    .lede {
      max-width: 52ch;
      margin-top: 1rem;
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.4rem;
    }

    .actions a,
    .card a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-height: 2.8rem;
      padding: 0.8rem 1rem;
      border-radius: 999px;
      color: inherit;
      text-decoration: none;
      font-weight: 600;
    }

    .primary {
      background: var(--accent);
      color: #fffaf2;
    }

    .secondary,
    .card a {
      border: 1px solid var(--line);
      background: var(--surface-strong);
    }

    .hero-panel {
      padding: 1.5rem;
    }

    .hero-panel h2,
    .card h2 {
      margin-bottom: 0.8rem;
      font-size: 1.3rem;
    }

    .hero-panel ul {
      margin: 0;
      padding-left: 1.2rem;
      color: var(--muted);
      line-height: 1.7;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      padding: 1.5rem;
    }

    .card p {
      color: var(--muted);
      line-height: 1.6;
      flex: 1;
    }

    @media (max-width: 900px) {
      .hero,
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class HomePageComponent {}
