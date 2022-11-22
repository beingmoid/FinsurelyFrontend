import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDirectoryComponent } from './sales-directory.component';

describe('SalesDirectoryComponent', () => {
  let component: SalesDirectoryComponent;
  let fixture: ComponentFixture<SalesDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDirectoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
