import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpBasicDetailComponent } from './emp-basic-detail.component';

describe('EmpBasicDetailComponent', () => {
  let component: EmpBasicDetailComponent;
  let fixture: ComponentFixture<EmpBasicDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpBasicDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpBasicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
