import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  template: `
    <section class="panel">
      <div class="copy">
        <p class="kicker">Auth placeholder</p>
        <h1>Magic-link login starts here.</h1>
        <p>
          The API now exposes <code>POST /api/auth/magic-link/request</code>,
          <code>POST /api/auth/magic-link/consume</code>, <code>GET /api/auth/me</code>, and
          <code>POST /api/auth/logout</code>.
        </p>
      </div>

      <div class="example">
        <h2>Current stub behavior</h2>
        <ol>
          <li>Submit an email to request a magic link.</li>
          <li>The API returns a preview token for local development.</li>
          <li>Consume that token to receive a session token.</li>
          <li>
            Pass the session token in <code>X-BagTag-Session</code> for <code>/api/auth/me</code>.
          </li>
        </ol>
      </div>
    </section>
  `,
  styles: `
    .panel {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr);
      gap: 1rem;
    }

    .copy,
    .example {
      padding: 1.6rem;
      border-radius: var(--radius-xl);
      border: 1px solid var(--line);
      background: var(--surface);
      box-shadow: var(--shadow-soft);
    }

    .kicker {
      color: var(--accent-deep);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 0.82rem;
    }

    h1 {
      margin: 0.8rem 0;
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      line-height: 1;
    }

    p,
    li,
    code {
      color: var(--muted);
      line-height: 1.7;
    }

    code {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.92em;
    }

    ol {
      margin: 0;
      padding-left: 1.2rem;
    }

    @media (max-width: 900px) {
      .panel {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class LoginPageComponent {}
