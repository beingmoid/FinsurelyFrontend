import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBirthdayComponent } from './view-birthday.component';

describe('ViewBirthdayComponent', () => {
  let component: ViewBirthdayComponent;
  let fixture: ComponentFixture<ViewBirthdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBirthdayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
