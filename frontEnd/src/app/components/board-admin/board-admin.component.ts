import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {PageEvent} from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  //content?: string;
  completeUserList?: User[];
  userList?: User[];
  moderatorList?: User[];
  organizerList?: User[];
  panelOpenStateMod = false;
  panelOpenStateOrg = false;
  panelOpenStateUsr = false;
  isAdmin = false;
  isMod = false;

  lengthUsr?: number;
  pageSizeOptionsUsr: number[] = [1, 5, 10, 25, 100];
  pageEventUsr?: PageEvent;
  DataSourceUsr!: MatTableDataSource<User>;
  DataSourceOrg!: MatTableDataSource<User>;
  DataSourceMod!: MatTableDataSource<User>;
  // displayedColumns: string[] = ['username', 'email', 'roles', 'action'];
  displayedColumns: string[] = ['username', 'email', 'roles', 'actions'];

  @ViewChild("paginatorUsr")
  paginatorUsr!: MatPaginator;

  @ViewChild("paginatorOrg")
  paginatorOrg!: MatPaginator;

  @ViewChild("paginatorMod")
  paginatorMod!: MatPaginator;

  ngAfterViewInit() {
    //this.DataSourceUsr.paginator = this.paginator;
  }

  applyUserFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DataSourceUsr.filter = filterValue.trim().toLowerCase();

    if (this.DataSourceUsr.paginator) {
      this.DataSourceUsr.paginator.firstPage();
    }
  }

  applyOrgFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DataSourceOrg.filter = filterValue.trim().toLowerCase();

    if (this.DataSourceOrg.paginator) {
      this.DataSourceOrg.paginator.firstPage();
    }
  }

  applyModFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.DataSourceMod.filter = filterValue.trim().toLowerCase();

    // if (this.DataSourceMod.paginator) {
    //   this.DataSourceMod.paginator.firstPage();
    // }
  }

  constructor(private userService: UserService, private tokenStorageService: TokenStorageService) { }
  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    const roles = user.roles;
    if(roles) {
      this.isAdmin = roles.includes('ROLE_ADMIN');
      this.isMod = roles.includes('ROLE_MODERATOR');
    }
    this.userService.getAdminBoard().subscribe({
      next: data => {
        console.log(data)
        this.completeUserList = data.users;
        this.userList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('user'));
        this.lengthUsr = this.userList?.length;
        this.moderatorList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('moderator'));
        this.organizerList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('organizer'));
        console.log("userList: ", this.userList);
        console.log("-----")
        console.log("moderatorList: ", this.moderatorList);
        console.log("-----")
        console.log("organizerList: ", this.organizerList);
        console.log("-----")
        this.DataSourceUsr = new MatTableDataSource(this.userList);
        this.DataSourceUsr.paginator = this.paginatorUsr;
        this.DataSourceOrg = new MatTableDataSource(this.organizerList);
        this.DataSourceOrg.paginator = this.paginatorOrg;
        this.DataSourceMod = new MatTableDataSource(this.moderatorList);
        this.DataSourceMod.paginator = this.paginatorMod;

      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }

  refresh() {
    this.userService.getAdminBoard().subscribe({
      next: data => {
        this.completeUserList = data.users;
        this.userList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('user'));
        this.lengthUsr = this.userList?.length;
        this.moderatorList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('moderator'));
        this.organizerList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('organizer'));

        this.DataSourceUsr = new MatTableDataSource(this.userList);
        this.DataSourceUsr.paginator = this.paginatorUsr;
        this.DataSourceOrg = new MatTableDataSource(this.organizerList);
        this.DataSourceOrg.paginator = this.paginatorOrg;
        this.DataSourceMod = new MatTableDataSource(this.moderatorList);
        this.DataSourceMod.paginator = this.paginatorMod;
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }

  promoteUserToModerator(id:any) {
    console.log("board-admin.components.ts: promote: ", id);
    this.userService.promoteUserToModerator(id).subscribe({
      next: data => {
        console.log(data)
        console.log("-----")
        this.refresh()
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }
  promoteUserToOrganizer(id:any) {
    console.log("board-admin.components.ts: promote: ", id);
    this.userService.promoteUserToOrganizer(id).subscribe({
      next: data => {
        console.log(data)
        console.log("-----")
        this.refresh()
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }
  deleteUser(user: User) {
    this.userService.deleteUser(user).subscribe({
      next: data => {
        console.log(data)
        console.log("-----")
        this.refresh()
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }

  demoteModToUser(id:any) {
    console.log("board-admin.components.ts: demote: ", id);
    this.userService.demoteModToUser(id).subscribe({
      next: data => {
        console.log(data)
        console.log("-----")
        this.refresh()
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }

  demoteOrgToUser(id:any) {
    console.log("board-admin.components.ts: demote: ", id);
    this.userService.demoteOrgToUser(id).subscribe({
      next: data => {
        console.log(data)
        console.log("-----")
        this.refresh()
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });

  }

}
