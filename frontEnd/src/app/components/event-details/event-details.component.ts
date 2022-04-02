import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  currentUser!: User;
  @Input() viewMode = true;
  @Input() currentEvent: Event = {
    title: '',
    description: '',
    imageURL: '',
    published: false
  };

  message = '';
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService) { }
  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      console.log("hello")
      console.log(["id"])
      this.getEvent(this.route.snapshot.params["id"]);
    } else {
      this.message = '';
      console.log("hello")
      console.log(["id"])
      this.getEvent(this.route.snapshot.params["id"]);
    }
    this.currentUser = this.tokenStorageService.getUser()
    console.log("this.currentUser: ",this.currentUser.id);
  }
  getEvent(id: string): void {
    this.eventService.get(id)
      .subscribe({
        next: (data) => {
          this.currentEvent = data;
          console.log(data);
          console.log("creator id", this.currentEvent.creator)
        },
        error: (e) => console.error(e)
      });
  }
  updatePublished(status: boolean): void {
    const data = {
      title: this.currentEvent.title,
      description: this.currentEvent.description,
      imageURL: this.currentEvent.imageURL,
      category: this.currentEvent.category,
      published: status
    };
    this.message = '';
    this.eventService.update(this.currentEvent._id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentEvent.published = status;
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  updateEvent(): void {
    this.message = '';
    this.eventService.update(this.currentEvent._id, this.currentEvent)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This event was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  deleteEvent(): void {
    this.eventService.delete(this.currentEvent._id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/events']);
        },
        error: (e) => console.error(e)
      });
  }

  changeToEditMode(): void {
    this.viewMode = false;
    // window.location.reload();
  }
}
