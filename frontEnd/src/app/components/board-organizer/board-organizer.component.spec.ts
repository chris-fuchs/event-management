import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOrganizerComponent } from './board-organizer.component';

describe('BoardOrganizerComponent', () => {
  let component: BoardOrganizerComponent;
  let fixture: ComponentFixture<BoardOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardOrganizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
