import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { StyleManagerService } from 'src/app/services/style-manager.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  @HostBinding('class') public cssClass: string | undefined;
  isDark = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showAddEvent = false;
  username?: string;
  profilePicURL?: string;
  constructor(private tokenStorageService: TokenStorageService, private userService: UserService, private styleManager: StyleManagerService) { }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = (this.roles.includes('ROLE_MODERATOR'));
      this.showAddEvent = this.roles.includes('ROLE_ORGANIZER');
      this.username = user.username;
      this.userService.getProfilePicture(user.id).subscribe(
        data => {
          this.profilePicURL = data;
        }
      );
    }
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.href = '/';
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  toggleDarkTheme() {
    this.styleManager.toggleDarkTheme();
    this.isDark = !this.isDark;
  }
}
