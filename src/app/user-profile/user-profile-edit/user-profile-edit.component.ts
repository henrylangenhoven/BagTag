import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserProfile } from '@models/user-profile';
import { UserProfileService } from '@app/user-profile/user-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-edit',
  imports: [FormsModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.scss',
})
export class UserProfileEditComponent {
  user: UserProfile = {};

  constructor(
    private router: Router,
    private userService: UserProfileService
  ) {
    this.user = this.userService.getUser();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.userService.updateUser(form.value);
      alert('Profile updated successfully!');
      this.router.navigate(['/profile']);
    }
  }
}
