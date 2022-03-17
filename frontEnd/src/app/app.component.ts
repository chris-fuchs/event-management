import { Component } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontEnd';
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showAddEvent = false;
  showOrganizerBoard = false;
  showUserBoard = false;
  username?: string;
  constructor(private tokenStorageService: TokenStorageService) { }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = (this.roles.includes('ROLE_MODERATOR') && !this.roles.includes('ROLE_ADMIN'));
      this.showModeratorBoard = (this.roles.includes('ROLE_MODERATOR'));
      this.showAddEvent = this.roles.includes('ROLE_ORGANIZER');
      this.showOrganizerBoard = this.roles.includes('ROLE_ORGANIZER');
      this.showUserBoard = this.roles.includes('ROLE_USER');
      this.username = user.username;
    }
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
