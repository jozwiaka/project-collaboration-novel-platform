import { Component, NgModule, OnInit } from '@angular/core';
import { UserDTO } from 'src/app/core/api/user.api';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent {
  user: User | undefined;
  newUserName: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    if (this.authService.user) {
      this.user = this.authService.user;
      this.newUserName = this.user.name;
    }
  }

  updateUserName() {
    if (this.user) {
      this.user.name = this.newUserName;
      const userData: UserDTO = {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
      };
      this.userService.update(userData).subscribe({
        next: () => {
          this.authService.editName(userData.name);
        },
      });
    }
  }
}
