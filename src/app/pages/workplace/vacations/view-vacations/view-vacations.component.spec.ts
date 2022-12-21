import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVacationsComponent } from './view-vacations.component';

describe('ViewVacationsComponent', () => {
  let component: ViewVacationsComponent;
  let fixture: ComponentFixture<ViewVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVacationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
