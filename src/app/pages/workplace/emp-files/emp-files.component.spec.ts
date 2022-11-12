import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFilesComponent } from './emp-files.component';

describe('EmpFilesComponent', () => {
  let component: EmpFilesComponent;
  let fixture: ComponentFixture<EmpFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
