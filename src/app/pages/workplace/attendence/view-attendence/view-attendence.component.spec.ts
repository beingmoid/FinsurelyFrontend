import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttendenceComponent } from './view-attendence.component';

describe('ViewAttendenceComponent', () => {
  let component: ViewAttendenceComponent;
  let fixture: ComponentFixture<ViewAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAttendenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
