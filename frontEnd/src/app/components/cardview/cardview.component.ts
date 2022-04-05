import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Event } from 'src/app/models/event.model';
import { User } from 'src/app/models/user.model';
import { EventService } from 'src/app/services/event.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.scss']
})
export class CardviewComponent implements OnInit {

  events?: Event[];
  allEvents?: Event[];
  currentEvent: Event = {};
  currentIndex = -1;
  title = '';
  currentUser!: User;
  favEvents?: String[];
  isLoggedIn = false;
  keywords = new Set(['free', 'kid-friendly', 'disabled-friendly']);
  formControl = new FormControl(['angular']);

  // foods: any = [
  //   {value: 'all', viewValue: 'All'},
  //   {value: 'pizza-1', viewValue: 'Pizza'},
  //   {value: 'tacos-2dddddd', viewValue: 'Tacoddddddds'},
  // ];
  categories?: any;
  foods: any = ["pizza","bla","tacos"];



  constructor(private eventService: EventService, private tokenstorageService: TokenStorageService, private userService: UserService) { }
  ngOnInit(): void {
    this.currentUser = this.tokenstorageService.getUser()
    this.isLoggedIn = !!this.tokenstorageService.getToken();
    this.getAllEvents();
    if(this.isLoggedIn) {
      this.getFavEventsList();
    }
    this.eventService.getCategories().subscribe(data => {
      console.log("categories: ",data);
      this.categories = data
      this.categories = ["all"].concat(this.categories);
    });
    // console.log("this.currentUser: ",this.currentUser);
  }

  getAllEvents(): void {
    this.eventService.getAll()
    .subscribe({
      next: (data) => {
        this.allEvents = data;
        this.events = this.allEvents;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  getFavEventsList(): void {
    this.userService.getFavouriteEventList(this.currentUser.id).subscribe({
      next: (data) => {
        // console.log("favEvents: ",data);
        this.favEvents = data;
      },
      error: (e) => console.error(e)
    });
  }


  deleteEvent(eventid: any) {
    this.eventService.delete(eventid)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.getFavEventsList()
        },
        error: (e) => console.error(e)
      });
  }
  addFavEvent(eventid: any) {
    this.userService.addFavEvent(eventid)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.getFavEventsList()
        },
        error: (e) => console.error(e)
      });
      // this.ngOnInit();
  }

  removeFavEvent(eventid: any) {
    this.userService.removeFavEvent(eventid)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.getFavEventsList()
        },
        error: (e) => console.error(e)
      });
      // this.ngOnInit();
  }


  checkFavStatus(eventid: any) {
    // console.log("user: ",this.currentUser);
    // console.log("favEvents: ", this.currentUser.favEvents)
    if(this.favEvents?.includes(eventid)) {
      // console.log("eventid: ",eventid, " is in favEvents");
      return true;
    } else {
      // console.log("eventid: ",eventid, " is NOT in favEvents");
      return false;
    }
  }

  showSharing(eventIndex: any) {
    console.log(eventIndex)
    var x = document.getElementById(eventIndex);
    if(x) {
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }
  }

  changeCategory(value: any){
    console.log(value);
    // if(this.allEvents) {
    //   this.events = this.allEvents.filter(event => {
    //   if(event.category?.includes(value)) {
    //     return event;
    //   }
    // })
    // }
  }
}
