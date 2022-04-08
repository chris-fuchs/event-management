import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  currentUser?: any

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    content: [''],
    category: ['', Validators.required]
  })

  submitted = false;
  isLoggedIn = false;
  showAddEvent = false;
  categories?: any

  constructor(private fb: FormBuilder, private eventService: EventService, private tokenStorageService: TokenStorageService) { }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.currentUser = this.tokenStorageService.getUser()
      const roles = this.currentUser.roles;
      this.showAddEvent = roles.includes('ROLE_ORGANIZER');
    }

    this.eventService.getCategories().subscribe(data => {
      console.log("categories: ",data);
      this.categories = data
    });
  }

  get f(){
    return this.form.controls;
  }

  onFileChange(event:any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        content: file
      });
    }
  }

  saveEvent(): void {
    const formData = new FormData();
    formData.append('title',this.form.get('title')?.value)
    formData.append('description',this.form.get('description')?.value)
    formData.append('file', this.form.get('content')?.value)
    console.log("currentUserID: ",this.currentUser.id)
    formData.append('creator', this.currentUser.id)
    formData.append('category', this.form.get('category')?.value)


    console.log('category', this.form.get('category')?.value)
    this.eventService.create(formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          let url = `/events/${res._id}`;
          console.log("url: ",url);
          window.location.href = url;
        },
        error: (e) => console.error(e)
      });
  }
}
