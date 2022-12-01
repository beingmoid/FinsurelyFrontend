import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSalesComponent } from './bulk-sales.component';

describe('BulkSalesComponent', () => {
  let component: BulkSalesComponent;
  let fixture: ComponentFixture<BulkSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
