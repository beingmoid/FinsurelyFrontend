import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBodyTypeComponent } from './add-body-type.component';

describe('AddBodyTypeComponent', () => {
  let component: AddBodyTypeComponent;
  let fixture: ComponentFixture<AddBodyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBodyTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
