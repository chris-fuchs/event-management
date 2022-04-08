import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { StyleManagerService } from 'src/app/services/style-manager.service';
import { ThemeService } from 'src/app/services/theme.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  @HostBinding('class') public cssClass: string | undefined;
  private roles: string[] = [];
  isDark = false;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showAddEvent = false;
  username?: string;
  constructor(private tokenStorageService: TokenStorageService, private themeService: ThemeService, private overlayContainer: OverlayContainer, private styleManager: StyleManagerService) { }
  ngOnInit(): void {
    this.themeService.theme.subscribe((theme: string) => {
      this.cssClass = theme;
    });
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = (this.roles.includes('ROLE_MODERATOR'));
      this.showAddEvent = this.roles.includes('ROLE_ORGANIZER');
      this.username = user.username;
    }
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('dark-theme');
    }
  }

  toggleDarkTheme() {
    this.styleManager.toggleDarkTheme();
    this.isDark = !this.isDark;
  }
}
