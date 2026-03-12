import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';
import { AuthFacadeService } from '../core/auth/auth-facade.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="panel">
      <div class="copy">
        <p class="kicker">Owner sign-in</p>
        <h1>Magic-link login starts here.</h1>
        <p>
          Enter your email address and BagTag will send a sign-in link. When the link opens on this
          page, the frontend exchanges it for a session and redirects you to the owner area.
        </p>

        <form class="magic-link-form" [formGroup]="form" (submit)="requestMagicLink($event)">
          <label for="email">Email address</label>
          <input id="email" type="email" formControlName="email" placeholder="owner@example.com" />
          <button type="submit" [disabled]="loading || form.invalid">
            {{ loading ? 'Sending link...' : 'Send magic link' }}
          </button>
        </form>

        @if (requestState().message) {
          <p class="notice success">{{ requestState().message }}</p>
        }

        @if (previewUrl) {
          <p class="notice">
            Resend is not configured for this environment. Use the local preview link:
            <a [routerLink]="['/login']" [queryParams]="{ token: previewToken }">consume token</a>
          </p>
        }

        @if (requestState().error || sessionState().error) {
          <p class="notice error">{{ requestState().error || sessionState().error }}</p>
        }
      </div>

      <div class="example">
        <h2>Current API flow</h2>
        <ol>
          <li>Submit an email to request a magic link.</li>
          <li>BagTag emails a one-time link through Resend when configured.</li>
          <li>Local development still exposes a preview token fallback.</li>
          <li>After consumption, the session token is stored in the browser.</li>
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
      display: grid;
      gap: 1rem;
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
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      line-height: 1;
    }

    p,
    li,
    code {
      color: var(--muted);
      line-height: 1.7;
    }

    .magic-link-form {
      display: grid;
      gap: 0.8rem;
      margin-top: 0.4rem;
    }

    label {
      font-weight: 600;
    }

    input {
      min-height: 3rem;
      padding: 0.85rem 1rem;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.7);
      color: var(--ink);
    }

    button {
      min-height: 3rem;
      width: fit-content;
      padding: 0.8rem 1.2rem;
      border: 0;
      border-radius: 999px;
      background: var(--accent);
      color: #fffaf2;
      cursor: pointer;
      font-weight: 700;
    }

    button:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    .notice {
      padding: 0.9rem 1rem;
      border-radius: 18px;
      background: rgba(77, 53, 32, 0.06);
    }

    .notice.success {
      background: rgba(46, 106, 79, 0.12);
      color: #244f3b;
    }

    .notice.error {
      background: rgba(156, 53, 35, 0.12);
      color: #7a3324;
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
export class LoginPageComponent implements OnInit {
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected readonly requestState = inject(AuthFacadeService).requestState;
  protected readonly sessionState = inject(AuthFacadeService).sessionState;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authFacade = inject(AuthFacadeService);

  protected get loading(): boolean {
    return this.requestState().loading || this.sessionState().loading;
  }

  protected get previewToken(): string | null {
    return this.requestState().previewToken;
  }

  protected get previewUrl(): string | null {
    return this.previewToken ? `/login?token=${this.previewToken}` : null;
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        mapToToken(),
        filter((token): token is string => Boolean(token)),
        distinctUntilChanged(),
        tap(() => this.authFacade.clearRequestState()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((token) => {
        this.authFacade
          .consumeMagicLink(token)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              void this.router.navigate(['/owner']);
            },
          });
      });
  }

  requestMagicLink(event?: Event): void {
    event?.preventDefault();

    if (this.form.invalid || this.loading) {
      return;
    }

    this.authFacade
      .requestMagicLink(this.form.controls.email.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}

function mapToToken() {
  return map((params: import('@angular/router').ParamMap) => params.get('token'));
}
