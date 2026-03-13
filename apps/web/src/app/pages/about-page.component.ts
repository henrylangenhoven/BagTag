import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HealthResponse } from '@bagtag-api/models';
import { HealthControllerService } from '@bagtag-api/services';
import webPackage from '../../../package.json';

type BackendStatus = {
  loading: boolean;
  connected: boolean;
  health: HealthResponse | null;
  error: string;
};

@Component({
  selector: 'app-about-page',
  template: `
    <section class="about-layout">
      <article class="hero">
        <p class="eyebrow">About</p>
        <h1>Build info and backend status</h1>
        <p>
          This page shows the current frontend version, the backend version exposed by the API, and
          whether the frontend can reach the backend health endpoint.
        </p>

        <div class="actions">
          <a href="https://github.com/henrylangenhoven/BagTag" target="_blank" rel="noreferrer"
            >GitHub repository</a
          >
          <button type="button" (click)="loadBackendHealth()" [disabled]="backendStatus().loading">
            {{ backendStatus().loading ? 'Checking...' : 'Refresh status' }}
          </button>
        </div>
      </article>

      <section class="grid">
        <article class="card">
          <span class="label">Frontend</span>
          <h2>Angular app</h2>
          <p class="value">{{ frontendVersion }}</p>
          <div class="meta">
            <p>Source: <code>apps/web/package.json</code></p>
            <p>Bundle: Angular SPA served through the web container.</p>
          </div>
        </article>

        <article class="card">
          <span class="label">Backend</span>
          <h2>Spring Boot API</h2>
          <p class="value" [class.ok]="isBackendConnected()" [class.error]="!isBackendConnected()">
            {{ isBackendConnected() ? 'Connected' : 'Unavailable' }}
          </p>
          <div class="meta">
            @if (backendStatus().health) {
              <p>
                Service: <strong>{{ backendStatus().health?.service }}</strong>
              </p>
              <p>
                Version: <strong>{{ backendStatus().health?.version }}</strong>
              </p>
              <p>
                Status: <strong>{{ backendStatus().health?.status }}</strong>
              </p>
            } @else if (backendStatus().error) {
              <p>{{ backendStatus().error }}</p>
            } @else {
              <p>No backend status loaded yet.</p>
            }
          </div>
        </article>

        <article class="card">
          <span class="label">Health</span>
          <h2>Last check</h2>
          <p class="value">{{ lastCheckedAt() }}</p>
          <div class="meta">
            <p>Endpoint: <code>/api/health</code></p>
            <p>The frontend updates signal-based state from the observable response.</p>
          </div>
        </article>
      </section>
    </section>
  `,
  styles: `
    .about-layout {
      display: grid;
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

    .eyebrow,
    .label {
      display: inline-flex;
      width: fit-content;
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
      font-size: clamp(2.4rem, 5vw, 4rem);
      line-height: 0.98;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
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

    .value {
      font-size: clamp(1.6rem, 4vw, 2.5rem);
      font-weight: 700;
      line-height: 1;
    }

    .value.ok {
      color: var(--success);
    }

    .value.error {
      color: #9c3523;
    }

    .meta {
      display: grid;
      gap: 0.35rem;
      align-content: start;
      min-height: 5.5rem;
    }

    p,
    code {
      color: var(--muted);
      line-height: 1.7;
    }

    code {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.92em;
    }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class AboutPageComponent {
  protected readonly frontendVersion = webPackage.version;
  protected readonly backendStatus = signal<BackendStatus>({
    loading: true,
    connected: false,
    health: null,
    error: '',
  });

  protected readonly isBackendConnected = computed(() => this.backendStatus().connected);
  protected readonly lastCheckedAt = computed(() => {
    const timestamp = this.backendStatus().health?.timestamp;
    return timestamp ? formatTimestamp(timestamp) : 'No successful check yet';
  });

  private readonly healthApi = inject(HealthControllerService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.loadBackendHealth();
  }

  loadBackendHealth(): void {
    this.backendStatus.update((state) => ({
      ...state,
      loading: true,
      error: '',
    }));

    this.healthApi
      .health()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (health) => {
          this.backendStatus.set({
            loading: false,
            connected: true,
            health,
            error: '',
          });
        },
        error: () => {
          this.backendStatus.set({
            loading: false,
            connected: false,
            health: null,
            error: 'The frontend could not reach the backend health endpoint.',
          });
        },
      });
  }
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  const parts = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return `${values['year']}-${values['month']}-${values['day']} ${values['hour']}:${values['minute']}:${values['second']}`;
}
