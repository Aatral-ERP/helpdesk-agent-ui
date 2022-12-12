import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurcahseInvoicesComponent } from './purchase-invoices.component';

describe('PurcahseInvoicesComponent', () => {
  let component: PurcahseInvoicesComponent;
  let fixture: ComponentFixture<PurcahseInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurcahseInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurcahseInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
