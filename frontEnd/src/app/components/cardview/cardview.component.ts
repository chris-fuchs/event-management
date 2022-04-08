import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { MatChip, MatChipList } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Event } from 'src/app/models/event.model';
import { User } from 'src/app/models/user.model';
import { EventService } from 'src/app/services/event.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.scss']
})
export class CardviewComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource!: MatTableDataSource<Event>

  @ViewChild(MatChipList)
  chipList!: MatChipList;

  @Input() options: string[] = [];

  value: string[] = [];

  onChange!: (value: string[]) => void;
  onTouch: any;

  disabled = false;


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


  categories?: any;
  foods: any = ["pizza","bla","tacos"];

  applyNameFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  constructor(private changeDetectorRef: ChangeDetectorRef, private eventService: EventService, private tokenstorageService: TokenStorageService, private userService: UserService) { }

  writeValue(value: string[]): void {
    if (this.chipList && value) {
      this.selectChips(value);
    } else if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


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
  }


  ngAfterViewInit() {
    this.selectChips(this.value);

    this.chipList.chipSelectionChanges
      .pipe(
        map((event) => event.source)
      )
      .subscribe((chip) => {
        if (chip.selected) {
          this.value = [...this.value, chip.value];
        } else {
          this.value = this.value.filter((o) => o !== chip.value);
        }
        console.log(this.value)

        this.propagateChange(this.value);
      });
  }


  propagateChange(value: string[]) {
    if (this.onChange) {
      this.onChange(value);
    }
    this.filterTags(value)
  }

  selectChips(value: string[]) {
    this.chipList.chips.forEach((chip) => chip.deselect());

    const chipsToSelect = this.chipList.chips.filter((c) =>
      value.includes(c.value)
    );

    chipsToSelect.forEach((chip) => chip.select());
  }

  toggleSelection(chip: MatChip) {
    if (!this.disabled) chip.toggleSelected();
  }

  getAllEvents(): void {
    this.eventService.getAll()
    .subscribe({
      next: (data) => {
        this.allEvents = data;
        this.events = this.allEvents;
        console.log(data);
        this.changeDetectorRef.detectChanges();
        this.dataSource = new MatTableDataSource(this.events);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource)
        this.obs = this.dataSource.connect();
      },
      error: (e) => console.error(e)
    });
  }

  getFavEventsList(): void {
    this.userService.getFavouriteEventList(this.currentUser.id).subscribe({
      next: (data) => {
        this.favEvents = data;
      },
      error: (e) => console.error(e)
    });
  }


  deleteEvent(eventid: any) {
    this.eventService.delete(eventid)
      .subscribe({
        next: (data) => {
          this.getFavEventsList()
        },
        error: (e) => console.error(e)
      });
  }
  addFavEvent(eventid: any) {
    this.userService.addFavEvent(eventid)
      .subscribe({
        next: (data) => {
          this.getFavEventsList()
        },
        error: (e) => console.error(e)
      });
  }

  removeFavEvent(eventid: any) {
    this.userService.removeFavEvent(eventid)
      .subscribe({
        next: (data) => {
          this.getFavEventsList()
        },
        error: (e) => console.error(e)
      });
  }


  checkFavStatus(eventid: any) {
    if(this.favEvents?.includes(eventid)) {
      return true;
    } else {
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
    console.log("category value: ",value);
    if(this.allEvents) {
      if(value === "all") {
        this.events = this.allEvents;
      } else {
        this.events = this.allEvents.filter(event => event.category?.toLowerCase() === value.toLowerCase());
      }
      this.dataSource = new MatTableDataSource(this.events);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    }
  }
  filterTags(value: String[]) {
    console.log("filterTags with value: ",value);
    if(this.allEvents) {
      if(value.length === 0) {
        this.events = this.allEvents;
      } else {
        this.events = this.allEvents.filter(event => {
          let eventTags = event.tags as string[];
          eventTags = eventTags.map(tag => tag.toLowerCase());
          let valueTags = value.map(tag => tag.toLowerCase());

          let result = eventTags.filter(tag => valueTags.includes(tag));
          return result.length === valueTags.length;
        });
      }
      this.dataSource = new MatTableDataSource(this.events);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    }
  }
}
