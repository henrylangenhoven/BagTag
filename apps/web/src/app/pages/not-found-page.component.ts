import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="panel">
      <p class="code">404</p>
      <h1>That route does not exist.</h1>
      <p>
        The app currently exposes a small set of bootstrap routes while the first product flows are
        being built out.
      </p>
      <a routerLink="/">Return home</a>
    </section>
  `,
  styles: `
    .panel {
      display: grid;
      gap: 0.9rem;
      justify-items: start;
      padding: 1.8rem;
      border-radius: var(--radius-xl);
      border: 1px solid var(--line);
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    .code {
      color: var(--accent-deep);
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    h1 {
      font-size: clamp(2.4rem, 5vw, 4rem);
      line-height: 0.96;
    }

    p {
      color: var(--muted);
      line-height: 1.7;
    }

    a {
      display: inline-flex;
      padding: 0.8rem 1rem;
      border-radius: 999px;
      background: var(--accent);
      color: #fffaf2;
      text-decoration: none;
      font-weight: 600;
    }
  `,
})
export class NotFoundPageComponent {}
