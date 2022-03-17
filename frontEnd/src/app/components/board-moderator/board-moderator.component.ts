import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.scss']
})
export class BoardModeratorComponent implements OnInit {
  completeUserList?: User[];
  userList?: User[];
  organizerList?: User[];
  constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getModeratorBoard().subscribe({
      next: data => {
        this.completeUserList = data.users;
        this.userList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('user'));
        this.organizerList = data.users.filter((user: { roles: string | string[]; }) => user.roles.includes('organizer'));
        console.log(data)
        console.log("-----")
      },
      error: err => {
        //this.completeUserList = JSON.parse(err.error).message;
      }
    });
  }
}
