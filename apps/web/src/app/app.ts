import { Component, DestroyRef, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacadeService } from './core/auth/auth-facade.service';
import { SessionService } from './core/auth/session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly authFacade = inject(AuthFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  protected readonly showAboutLink = computed(
    () => this.authFacade.isAuthenticated() || Boolean(this.sessionService.sessionToken()),
  );
  protected readonly showLogout = computed(() => this.authFacade.isAuthenticated());

  ngOnInit(): void {
    if (!this.sessionService.sessionToken()) {
      return;
    }

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
