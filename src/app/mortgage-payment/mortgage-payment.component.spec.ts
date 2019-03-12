import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgagePaymentComponent } from './mortgage-payment.component';

describe('MortgagePaymentComponent', () => {
  let component: MortgagePaymentComponent;
  let fixture: ComponentFixture<MortgagePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgagePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgagePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
