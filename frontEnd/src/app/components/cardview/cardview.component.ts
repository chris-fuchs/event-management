import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { User } from 'src/app/models/user.model';
import { EventService } from 'src/app/services/event.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.css']
})
export class CardviewComponent implements OnInit {
  events?: Event[];
  currentEvent: Event = {};
  currentIndex = -1;
  title = '';
  currentUser!: User;
  constructor(private eventService: EventService, private tokenstorageService: TokenStorageService, private userService: UserService) { }
  ngOnInit(): void {
    this.retrieveEvents();
    this.currentUser = this.tokenstorageService.getUser()
    console.log("this.currentUser: ",this.currentUser);
  }
  retrieveEvents(): void {
    this.eventService.getAll()
      .subscribe({
        next: (data) => {
          this.events = data;
          console.log(data);
        },
        error: (e) => console.error(e)
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
  favouriteEvent(eventid: any) {
    this.userService.favoriteEvent(eventid)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  checkFavStatus(eventid: any) {
    console.log("user: ",this.currentUser);
    console.log("favEvents: ", this.currentUser.favEvents)
    if(this.currentUser.favEvents?.includes(eventid)) {
      console.log("eventid: ",eventid, " is in favEvents");
      return true;
    } else {
      console.log("eventid: ",eventid, " is NOT in favEvents");
      return false;
    }
  }
}
