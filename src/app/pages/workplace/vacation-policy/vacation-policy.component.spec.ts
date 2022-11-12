import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationPolicyComponent } from './vacation-policy.component';

describe('VacationPolicyComponent', () => {
  let component: VacationPolicyComponent;
  let fixture: ComponentFixture<VacationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacationPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
