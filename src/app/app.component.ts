import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/firebase/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentUserId: string | undefined;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.pipe(takeUntilDestroyed()).subscribe(user => {
      this.currentUserId = user?.uid;
    });
  }
}
