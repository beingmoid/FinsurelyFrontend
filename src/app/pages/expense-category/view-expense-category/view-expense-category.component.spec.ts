import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpenseCategoryComponent } from './view-expense-category.component';

describe('ViewExpenseCategoryComponent', () => {
  let component: ViewExpenseCategoryComponent;
  let fixture: ComponentFixture<ViewExpenseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpenseCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
