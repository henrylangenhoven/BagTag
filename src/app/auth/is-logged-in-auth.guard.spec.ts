import { TestBed } from '@angular/core/testing';
import { AuthService } from '@app/firebase/auth/auth.service';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isLoggedInAuthGuard } from '@app/auth/is-logged-in-auth.guard';

describe('isLoggedInAuthGuard', () => {
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      currentUser$: of(null), // Default to no user logged in
      redirectToLogin: jasmine.createSpy('redirectToLogin'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });
  });

  it('should allow access if a user is logged in', done => {
    authServiceMock.currentUser$ = of({ uid: '12345' }); // Simulate logged-in user

    const result = TestBed.runInInjectionContext(() =>
      isLoggedInAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ) as Observable<boolean>;

    result.subscribe(result => {
      expect(result).toBeTrue();
      expect(authServiceMock.redirectToLogin).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login if no user is logged in', done => {
    // Setup for this specific test
    authServiceMock.currentUser$ = of(null); // No user logged in

    const result = TestBed.runInInjectionContext(() =>
      isLoggedInAuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ) as Observable<boolean>;

    result.subscribe(result => {
      expect(result).toBeFalse();
      expect(authServiceMock.redirectToLogin).toHaveBeenCalled();
      done();
    });
  });
});
