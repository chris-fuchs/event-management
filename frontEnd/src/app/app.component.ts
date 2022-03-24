import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontEnd';
  @HostBinding('class') public cssClass: string | undefined;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  // Top Toolbar
  @ViewChild(MatToolbar) public topnav!: MatToolbar;
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showAddEvent = false;
  showOrganizerBoard = false;
  showUserBoard = false;
  username?: string;
  constructor(private tokenStorageService: TokenStorageService, private themeService: ThemeService, private observer: BreakpointObserver) { }
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
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        // this.sidenav.mode = 'over';
        // this.sidenav.close();
        var topnav = Array.from(document.getElementsByClassName("top-nav-only") as HTMLCollectionOf<HTMLElement>)
        topnav.forEach(element => {
          element.style.display = "none";
        });
      } else {
        // this.topnav.
        var topnav = Array.from(document.getElementsByClassName("top-nav-only") as HTMLCollectionOf<HTMLElement>)
        topnav.forEach(element => {
          element.style.display = "block";
        });
        // this.sidenav.mode = 'side';
        // this.sidenav.open();
      }
    });
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
