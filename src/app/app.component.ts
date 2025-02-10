import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { QrCodeComponent } from '@app/utils/qr-code/qr-code/qr-code.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/firebase/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgForOf, AsyncPipe, QrCodeComponent, FormsModule, RouterLink, NgIf],
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
