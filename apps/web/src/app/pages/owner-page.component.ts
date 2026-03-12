import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthFacadeService } from '../core/auth/auth-facade.service';

@Component({
  selector: 'app-owner-page',
  imports: [RouterLink],
  template: `
    <section class="owner-layout">
      <article class="hero">
        <p class="eyebrow">Owner area</p>
        @if (loading) {
          <h1>Checking your session...</h1>
          <p>BagTag is confirming the browser session with the API.</p>
        } @else if (sessionState().data?.authenticated) {
          <h1>Welcome back, {{ currentUserEmail }}</h1>
          <p>
            The frontend is now connected to <code>GET /api/auth/me</code> and
            <code>POST /api/auth/logout</code>. This is the starting point for the private owner
            dashboard.
          </p>
          <div class="actions">
            <button type="button" (click)="logout()">Log out</button>
          </div>
        } @else {
          <h1>Owner sign-in required</h1>
          <p>
            No active owner session was found in this browser. Request a magic link to continue into
            the private dashboard.
          </p>
          <div class="actions">
            <a routerLink="/login">Go to login</a>
          </div>
        }

        @if (sessionState().error) {
          <p class="notice error">{{ sessionState().error }}</p>
        }
      </article>

      <article class="stack">
        <div class="card">
          <h2>Connected now</h2>
          <ul>
            <li>Magic-link consume flow redirects here after login</li>
            <li>Session token is stored in local storage</li>
            <li>Owner auth state is fetched from the backend on page load</li>
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
      display: grid;
      gap: 1rem;
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
      font-size: clamp(2.5rem, 5vw, 4.2rem);
      line-height: 0.96;
    }

    p,
    li {
      color: var(--muted);
      line-height: 1.7;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .actions a,
    .actions button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-height: 2.8rem;
      padding: 0.8rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--surface-strong);
      color: inherit;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }

    .notice {
      padding: 0.9rem 1rem;
      border-radius: 18px;
    }

    .notice.error {
      background: rgba(156, 53, 35, 0.12);
      color: #7a3324;
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
export class OwnerPageComponent implements OnInit {
  protected readonly sessionState = inject(AuthFacadeService).sessionState;

  protected get currentUserEmail(): string {
    return this.authFacade.currentUserEmail();
  }

  protected get loading(): boolean {
    return this.sessionState().loading;
  }

  private readonly authFacade = inject(AuthFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.authFacade
      .loadSession()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => undefined,
      });
  }

  logout(): void {
    this.authFacade
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login']);
        },
      });
  }
}
