import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-page',
  template: `
    <section class="owner-layout">
      <article class="hero">
        <p class="eyebrow">Owner area</p>
        <h1>Private dashboard placeholder</h1>
        <p>
          This route represents the authenticated owner experience. It will become the place to
          create tags, review scan history, and read public messages.
        </p>
      </article>

      <article class="stack">
        <div class="card">
          <h2>Coming next</h2>
          <ul>
            <li>Tag list endpoint</li>
            <li>Create tag flow</li>
            <li>Scan and message history</li>
          </ul>
        </div>

        <div class="card accent">
          <h2>Boundary</h2>
          <p>
            Public reporting and owner management stay separate. Owners should never need the public
            finder flow to manage their own tags.
          </p>
        </div>
      </article>
    </section>
  `,
  styles: `
    .owner-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
      gap: 1rem;
    }

    .hero,
    .card {
      padding: 1.6rem;
      border-radius: var(--radius-xl);
      border: 1px solid var(--line);
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    .eyebrow {
      color: var(--accent-deep);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0.85rem 0;
      font-size: clamp(2.5rem, 5vw, 4.2rem);
      line-height: 0.96;
    }

    p,
    li {
      color: var(--muted);
      line-height: 1.7;
    }

    .stack {
      display: grid;
      gap: 1rem;
    }

    .accent {
      background: linear-gradient(180deg, rgba(201, 107, 44, 0.14), rgba(255, 248, 239, 0.9));
    }

    ul {
      margin: 0;
      padding-left: 1.2rem;
    }

    @media (max-width: 900px) {
      .owner-layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class OwnerPageComponent {}
