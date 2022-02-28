import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  //content?: string;
  completeUserList?: User[];
  userList?: User[];
  moderatorList?: User[];
  organizerList?: User[];



  constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
      next: data => {
        this.completeUserList = data.users;
        this.userList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('user'));
        this.moderatorList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('moderator'));
        this.organizerList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('organizer'));
        console.log(data)
        console.log("-----")
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
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }

}
