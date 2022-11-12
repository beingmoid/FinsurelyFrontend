import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingRulesComponent } from './accounting-rules.component';

describe('AccountingRulesComponent', () => {
  let component: AccountingRulesComponent;
  let fixture: ComponentFixture<AccountingRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
