import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEventViewComponent } from './single-event-view.component';

describe('SingleEventViewComponent', () => {
  let component: SingleEventViewComponent;
  let fixture: ComponentFixture<SingleEventViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleEventViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleEventViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
