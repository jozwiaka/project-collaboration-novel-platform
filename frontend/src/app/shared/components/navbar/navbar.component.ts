import { AuthService } from 'src/app/core/services/auth.service';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isDropdownOpen: boolean = false;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.isDropdownOpen = false;
    this.authService.logout();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
