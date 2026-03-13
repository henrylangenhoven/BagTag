import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { MeResponse } from '@bagtag-api/models';
import { AuthService } from '@bagtag-api/services';
import { SessionService } from './session.service';

type RequestState = {
  loading: boolean;
  message: string;
  error: string;
  previewToken: string | null;
};

type SessionState = {
  loading: boolean;
  error: string;
  data: MeResponse | null;
};

type ProfileState = {
  loading: boolean;
  error: string;
  message: string;
};

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authApi = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  readonly requestState = signal<RequestState>({
    loading: false,
    message: '',
    error: '',
    previewToken: null,
  });

  readonly sessionState = signal<SessionState>({
    loading: false,
    error: '',
    data: null,
  });

  readonly profileState = signal<ProfileState>({
    loading: false,
    error: '',
    message: '',
  });

  readonly isAuthenticated = computed(() => this.sessionState().data?.authenticated ?? false);
  readonly currentUserEmail = computed(() => this.sessionState().data?.user?.email ?? 'owner');
  readonly currentUserDisplayName = computed(
    () => this.sessionState().data?.user?.displayName ?? '',
  );
  readonly currentUserLabel = computed(() => {
    const displayName = this.currentUserDisplayName().trim();
    return displayName || this.currentUserEmail();
  });

  requestMagicLink(email: string) {
    this.requestState.set({
      loading: true,
      message: '',
      error: '',
      previewToken: null,
    });

    return this.authApi
      .requestMagicLink({
        body: {
          email,
        },
      })
      .pipe(
        tap((response) => {
          this.requestState.set({
            loading: false,
            message: `If ${response.email} is registered, a sign-in link is ready.`,
            error: '',
            previewToken: response.previewToken ?? null,
          });
        }),
        catchError((error) => {
          this.requestState.update((state) => ({
            ...state,
            loading: false,
            error: this.describeError(error, 'Magic link request failed.'),
          }));
          return throwError(() => error);
        }),
      );
  }

  consumeMagicLink(token: string) {
    this.sessionState.set({
      loading: true,
      error: '',
      data: null,
    });

    return this.authApi
      .consumeMagicLink({
        body: {
          token,
        },
      })
      .pipe(
        tap((response) => {
          this.sessionService.setSessionToken(response.sessionToken);
          this.sessionState.set({
            loading: false,
            error: '',
            data: {
              authenticated: true,
              user: response.user,
            },
          });
        }),
        catchError((error) => {
          this.sessionState.set({
            loading: false,
            error: this.describeError(error, 'Magic link could not be consumed.'),
            data: null,
          });
          return throwError(() => error);
        }),
      );
  }

  loadSession() {
    const sessionToken = this.sessionService.sessionToken();
    if (!sessionToken) {
      this.sessionState.set({
        loading: false,
        error: '',
        data: {
          authenticated: false,
        },
      });
      return of(this.sessionState().data);
    }

    this.sessionState.update((state) => ({
      ...state,
      loading: true,
      error: '',
    }));

    return this.authApi
      .getAuthMe({
        'X-BagTag-Session': sessionToken,
      })
      .pipe(
        tap((response) => {
          this.sessionState.set({
            loading: false,
            error: '',
            data: response,
          });
        }),
        catchError((error) => {
          this.sessionService.clearSessionToken();
          this.sessionState.set({
            loading: false,
            error: this.describeError(error, 'Owner session lookup failed.'),
            data: {
              authenticated: false,
            },
          });
          return throwError(() => error);
        }),
      );
  }

  logout() {
    const sessionToken = this.sessionService.sessionToken();

    return this.authApi
      .logoutAuthSession(
        sessionToken
          ? {
              'X-BagTag-Session': sessionToken,
            }
          : undefined,
      )
      .pipe(
        catchError(() => of({ loggedOut: false })),
        tap(() => {
          this.sessionService.clearSessionToken();
          this.sessionState.set({
            loading: false,
            error: '',
            data: {
              authenticated: false,
            },
          });
        }),
      );
  }

  saveDisplayName(displayName: string) {
    const sessionToken = this.sessionService.sessionToken();
    if (!sessionToken) {
      this.profileState.set({
        loading: false,
        error: 'No active session was found for this browser.',
        message: '',
      });
      return throwError(() => new Error('No active session.'));
    }

    this.profileState.set({
      loading: true,
      error: '',
      message: '',
    });

    return this.authApi
      .updateAuthProfile({
        'X-BagTag-Session': sessionToken,
        body: {
          displayName,
        },
      })
      .pipe(
        tap((response) => {
          this.sessionState.update((state) => ({
            ...state,
            data:
              state.data == null
                ? {
                    authenticated: true,
                    user: response.user,
                  }
                : {
                    ...state.data,
                    user: response.user,
                  },
          }));
          this.profileState.set({
            loading: false,
            error: '',
            message: response.user.displayName
              ? 'Display name saved.'
              : 'Display name cleared. Email will be shown instead.',
          });
        }),
        catchError((error) => {
          this.profileState.set({
            loading: false,
            error: this.describeError(error, 'Profile update failed.'),
            message: '',
          });
          return throwError(() => error);
        }),
      );
  }

  clearRequestState(): void {
    this.requestState.set({
      loading: false,
      message: '',
      error: '',
      previewToken: null,
    });
  }

  clearProfileState(): void {
    this.profileState.set({
      loading: false,
      error: '',
      message: '',
    });
  }

  private describeError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message ?? fallback;
    }

    return fallback;
  }
}
