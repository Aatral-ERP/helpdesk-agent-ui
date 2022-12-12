import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurcahseQuotesComponent } from './purchase-quotes.component';

describe('PurcahseQuotesComponent', () => {
  let component: PurcahseQuotesComponent;
  let fixture: ComponentFixture<PurcahseQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurcahseQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurcahseQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
