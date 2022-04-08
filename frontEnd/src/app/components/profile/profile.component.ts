import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  form = new FormGroup( {
    title: new FormControl(''),
    description: new FormControl(''),
    content: new FormControl('')
  })
  constructor(private token: TokenStorageService, private userService: UserService) { }
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }
  onFileChange(event:any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        content: file
      });
    }
  }

  updateProfile(): void {
    const formData = new FormData();
    formData.append('file', this.form.get('content')?.value)
    this.userService.updateUser(this.currentUser.id, formData)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => console.error(e)
      });
  }
}
