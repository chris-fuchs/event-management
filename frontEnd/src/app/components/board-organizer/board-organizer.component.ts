import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';


import { Event } from 'src/app/models/event.model';
import { User } from 'src/app/models/user.model';
import { EventService } from 'src/app/services/event.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
@Component({
  selector: 'app-board-organizer',
  templateUrl: './board-organizer.component.html',
  styleUrls: ['./board-organizer.component.scss']
})
export class BoardOrganizerComponent implements OnInit {
  content?: string;
  events?: Event[]
  currentUser!: User;
  constructor(private userService: UserService, private eventService: EventService, private tokenstorageService: TokenStorageService) { }
  ngOnInit(): void {
    this.currentUser = this.tokenstorageService.getUser()
    this.retrieveEvents();
  }

  private retrieveEvents() {
    this.userService.getOrganizerBoard().subscribe({
      next: data => {
        console.log(data);
        this.events = data;
      },
      error: err => {
        this.content = JSON.parse(err.error).message;
      }
    });
  }

  deleteEvent(eventid: any) {
    this.eventService.delete(eventid)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.retrieveEvents();
        },
        error: (e) => console.error(e)
      });
  }

}
