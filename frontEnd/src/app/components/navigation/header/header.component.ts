import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
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
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showAddEvent = false;
  showOrganizerBoard = false;
  showUserBoard = false;
  username?: string;
  profilePicURL?: string;
  constructor(private tokenStorageService: TokenStorageService, private themeService: ThemeService, private userService: UserService) { }
  ngOnInit(): void {
    this.themeService.theme.subscribe((theme: string) => {
      this.cssClass = theme;
    });
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
      this.userService.getProfilePicture(user.id).subscribe(
        data => {
          this.profilePicURL = data;
          // console.log("profilepic: ",this.profilePicURL)
        }
      );
    }
  }
  logout(): void {
    this.tokenStorageService.signOut();
    //window.location.reload();
    window.location.href = '/';
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
