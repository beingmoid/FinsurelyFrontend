import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpStatusComponent } from './emp-status.component';

describe('EmpStatusComponent', () => {
  let component: EmpStatusComponent;
  let fixture: ComponentFixture<EmpStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
