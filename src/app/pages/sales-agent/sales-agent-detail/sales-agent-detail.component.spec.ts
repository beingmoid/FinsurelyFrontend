import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAgentDetailComponent } from './sales-agent-detail.component';

describe('SalesAgentDetailComponent', () => {
  let component: SalesAgentDetailComponent;
  let fixture: ComponentFixture<SalesAgentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesAgentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesAgentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
