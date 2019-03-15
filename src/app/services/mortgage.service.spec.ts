import { TestBed } from '@angular/core/testing';

import { MortgageService } from './mortgage.service';

describe('MortgageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    expect(service).toBeTruthy();
  });

  it('should have one mortgage', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    service.addMortgage();
    expect(service.mortgages.length).toEqual(1);
  });

  it('mortgage should have value 150000', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    service.addMortgage();
    expect(service.mortgages[0].mortgage.principal).toEqual(150000);
  });

  it('contribution should be $750.94', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    service.addMortgage();
    service.mortgages[0].payment.contribution = Math.round(service.GetRequiredPayment(service.mortgages[0]) * 100) / 100;
    expect(service.mortgages[0].payment.contribution).toEqual(750.94);
  });

  it('should have interest equal $437.50', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    const interest1 = Math.round(service.Interest(150000, 3.5, 12) * 10000000000) / 10000000000;
    expect(interest1).toEqual(437.5);
    const interest2 = Math.round(service.Interest(149686.564644611, 3.5, 12) * 10000000000) / 10000000000;
    expect(interest2).toEqual(436.59);
    const interest32 = Math.round(service.Interest(139846.173312399, 3.5, 12) * 10000000000) / 10000000000;
    expect(interest32).toEqual(407.88);
    const interest62 = Math.round(service.Interest(129107.322064323, 3.5, 12) * 10000000000) / 10000000000;
    expect(interest62).toEqual(376.56);
    const interest300 = Math.round(service.Interest(748.751496856509, 3.5, 12) * 10000000000) / 10000000000;
    expect(interest300).toEqual(2.18);
  });


  it('service should have one mortgage', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    service.addMortgage();
    expect(service.mortgages.length).toEqual(1);
  });

  it('mortgage balance should be $146,177.80', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    const defaultMortgage = {
      mortgage: {
        ammortization: 25,
        open: true,
        term: 5,
        rate: 3.5,
        principal: 150000,
        originalAmmortization: 25,
        originalTerm: 5,
        originalPrincipal: 150000,
        started: false
      },
      payment: {
        active: true,
        period: 'Monthly',
        contribution: 750.94
      }
    };

    defaultMortgage.payment.contribution = service.GetRequiredPayment(defaultMortgage);
    const principal = service.GetRemainingPrincipal(defaultMortgage);
    expect(Math.round(principal * 100) / 100).toEqual(146177.8);
  });

  it('mortgage balance should be $146,177.80', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    const defaultMortgage = {
      mortgage: {
        ammortization: 25,
        open: true,
        term: 5,
        rate: 3.5,
        principal: 150000,
        originalAmmortization: 25,
        originalTerm: 5,
        originalPrincipal: 150000,
        started: false
      },
      payment: {
        active: true,
        period: 'Monthly',
        contribution: 750.94
      }
    };
    service.mortgages.push(defaultMortgage);
    service.mortgages[0].payment.contribution = service.GetRequiredPayment(service.mortgages[0]);
    service.AddYear();
    expect(Math.round(service.mortgages[0].mortgage.principal * 100) / 100).toEqual(146177.8);
  });

  it('mortgage balance should be $124,928.31', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    const defaultMortgage = {
      mortgage: {
        ammortization: 25,
        open: true,
        term: 5,
        rate: 3.5,
        principal: 150000,
        originalAmmortization: 25,
        originalTerm: 5,
        originalPrincipal: 150000,
        started: false
      },
      payment: {
        active: true,
        period: 'Monthly',
        contribution: 750.94
      }
    };
    service.mortgages.push(defaultMortgage);
    service.mortgages[0].payment.contribution = service.GetRequiredPayment(service.mortgages[0]);
    for (let i = 0; i < 6; i++) {
      service.AddYear();
    }
    expect(Math.round(service.mortgages[0].mortgage.principal * 100) / 100).toEqual(124928.31);
  });
});
