import { Injectable, signal } from '@angular/core';

const SESSION_STORAGE_KEY = 'bagtag.session-token';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly sessionToken = signal<string | null>(window.localStorage.getItem(SESSION_STORAGE_KEY));

  getSessionToken(): string | null {
    return this.sessionToken();
  }

  setSessionToken(sessionToken: string): void {
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);
    this.sessionToken.set(sessionToken);
  }

  clearSessionToken(): void {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    this.sessionToken.set(null);
  }
}
