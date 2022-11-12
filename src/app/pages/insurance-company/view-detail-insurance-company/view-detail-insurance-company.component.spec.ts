import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailInsuranceCompanyComponent } from './view-detail-insurance-company.component';

describe('ViewDetailInsuranceCompanyComponent', () => {
  let component: ViewDetailInsuranceCompanyComponent;
  let fixture: ComponentFixture<ViewDetailInsuranceCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailInsuranceCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailInsuranceCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
