import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '@models/user-profile';
import { UserProfileService } from '@app/user-profile/user-profile.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile-view',
  imports: [FormsModule, RouterLink],
  templateUrl: './user-profile-view.component.html',
  styleUrl: './user-profile-view.component.scss',
})
export class UserProfileViewComponent {
  user: UserProfile = {};

  constructor(private userService: UserProfileService) {
    this.user = this.userService.getUser();
  }
}
