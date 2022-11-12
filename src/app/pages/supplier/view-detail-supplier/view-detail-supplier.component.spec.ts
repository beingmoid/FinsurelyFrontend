import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailSupplierComponent } from './view-detail-supplier.component';

describe('ViewDetailSupplierComponent', () => {
  let component: ViewDetailSupplierComponent;
  let fixture: ComponentFixture<ViewDetailSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
