import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreditPaymentComponent } from './add-credit-payment.component';

describe('AddCreditPaymentComponent', () => {
  let component: AddCreditPaymentComponent;
  let fixture: ComponentFixture<AddCreditPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCreditPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
