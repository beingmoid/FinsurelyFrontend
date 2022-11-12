import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsAndDeductionsComponent } from './benefits-and-deductions.component';

describe('BenefitsAndDeductionsComponent', () => {
  let component: BenefitsAndDeductionsComponent;
  let fixture: ComponentFixture<BenefitsAndDeductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitsAndDeductionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitsAndDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
