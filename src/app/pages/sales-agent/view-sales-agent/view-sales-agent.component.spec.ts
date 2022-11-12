import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalesAgentComponent } from './view-sales-agent.component';

describe('ViewSalesAgentComponent', () => {
  let component: ViewSalesAgentComponent;
  let fixture: ComponentFixture<ViewSalesAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalesAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
