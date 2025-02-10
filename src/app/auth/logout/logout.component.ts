import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@app/firebase/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-logout',
  imports: [NgIf],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent implements OnInit {
  private authService = inject(AuthService);
  logoutFailed: boolean = true;

  logOut() {
    this.authService
      .signOut()
      .then(() => this.authService.redirectToLogin())
      .catch((e: any) => console.error(e));
  }

  ngOnInit() {
    this.logOut();
  }
}
