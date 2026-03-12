import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthFacadeService } from '../core/auth/auth-facade.service';

@Component({
  selector: 'app-owner-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="owner-layout">
      <article class="hero">
        <p class="eyebrow">Owner area</p>
        @if (loading) {
          <h1>Checking your session...</h1>
          <p>BagTag is confirming the browser session with the API.</p>
        } @else if (sessionState().data?.authenticated) {
          <h1>Welcome back, {{ currentUserLabel }}</h1>
          <p>
            This owner session belongs to <strong>{{ currentUserEmail }}</strong
            >. If you set a display name, BagTag will show that first and fall back to your email
            address when it is empty.
          </p>

          <form class="profile-form" [formGroup]="profileForm" (submit)="saveDisplayName($event)">
            <label for="display-name">Display name</label>
            <div class="field-row">
              <input
                id="display-name"
                type="text"
                formControlName="displayName"
                placeholder="Henry"
                maxlength="120"
              />
              <button type="submit" [disabled]="profileLoading">
                {{ profileLoading ? 'Saving...' : 'Save name' }}
              </button>
            </div>
            <p class="helper">
              Leave this blank to use <code>{{ currentUserEmail }}</code> as the display label.
            </p>
          </form>

          @if (profileState().message) {
            <p class="notice success">{{ profileState().message }}</p>
          }

          @if (profileState().error) {
            <p class="notice error">{{ profileState().error }}</p>
          }
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
          <h2>Profile</h2>
          <ul>
            <li>Magic-link login redirects here after session creation</li>
            <li>Display name is stored in the backend user record</li>
            <li>Email remains the fallback label when no display name exists</li>
          </ul>
        </div>

        <div class="card accent">
          <h2>Session</h2>
          <p>
            Owner auth state is loaded from <code>GET /api/auth/me</code>, and profile changes are
            saved through <code>POST /api/auth/profile</code>.
          </p>
          <div class="actions">
            <button type="button" (click)="logout()">Log out</button>
          </div>
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
      min-width: 0;
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
      overflow-wrap: anywhere;
    }

    p,
    li {
      color: var(--muted);
      line-height: 1.7;
      overflow-wrap: anywhere;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .actions a,
    .actions button,
    .field-row button {
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

    .profile-form {
      display: grid;
      gap: 0.75rem;
    }

    label {
      font-weight: 700;
    }

    .field-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    input {
      flex: 1 1 16rem;
      min-width: 0;
      min-height: 2.8rem;
      padding: 0.8rem 1rem;
      border-radius: 18px;
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, 0.7);
      color: var(--ink);
      font: inherit;
    }

    .helper {
      font-size: 0.95rem;
    }

    .notice {
      padding: 0.9rem 1rem;
      border-radius: 18px;
    }

    .notice.success {
      background: rgba(46, 106, 79, 0.12);
      color: #244f3b;
    }

    .notice.error {
      background: rgba(156, 53, 35, 0.12);
      color: #7a3324;
    }

    .stack {
      display: grid;
      min-width: 0;
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
  protected readonly profileState = inject(AuthFacadeService).profileState;
  protected readonly profileForm = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)],
    }),
  });

  protected get currentUserEmail(): string {
    return this.authFacade.currentUserEmail();
  }

  protected get currentUserLabel(): string {
    return this.authFacade.currentUserLabel();
  }

  protected get loading(): boolean {
    return this.sessionState().loading;
  }

  protected get profileLoading(): boolean {
    return this.profileState().loading;
  }

  private readonly authFacade = inject(AuthFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const displayName = this.sessionState().data?.user?.displayName ?? '';
      if (this.profileForm.controls.displayName.value !== displayName) {
        this.profileForm.controls.displayName.setValue(displayName, {
          emitEvent: false,
        });
      }
    });
  }

  ngOnInit(): void {
    this.authFacade
      .loadSession()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => undefined,
      });
  }

  saveDisplayName(event?: Event): void {
    event?.preventDefault();

    if (this.profileForm.invalid || this.profileLoading) {
      return;
    }

    this.authFacade.clearProfileState();
    this.authFacade
      .saveDisplayName(this.profileForm.controls.displayName.getRawValue())
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
