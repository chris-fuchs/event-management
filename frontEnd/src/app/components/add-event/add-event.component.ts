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

  // form = new FormGroup( {
  //   title: new FormControl(''),
  //   description: new FormControl(''),
  //   content: new FormControl('')
  // })

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




    //console.log("ngOnInit fired..")
    /*this.form = new FormGroup({
      'title': new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
      'description': new FormControl(null, {validators: [Validators.required]}),
      'content': new FormControl(null, {validators: [Validators.required]})
    });*/
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

/*
import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  event: Event = {
    title: '',
    description: '',
    image: '',
    published: false
  };
  submitted = false;
  constructor(private eventService: EventService) { }
  ngOnInit(): void {
  }
  saveEvent(): void {
    const data = {
      title: this.event.title,
      description: this.event.description,
      image: this.event.image
    };
    console.log(this.event.title);
    console.log(this.event.description);
    console.log(this.event.image);
    this.eventService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }
  newEvent(): void {
    this.submitted = false;
    this.event = {
      title: '',
      description: '',
      image: '',
      published: false
    };
  }

}
*/
