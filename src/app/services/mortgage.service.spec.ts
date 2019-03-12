import { TestBed } from '@angular/core/testing';

import { MortgageService } from './mortgage.service';

describe('MortgageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MortgageService = TestBed.get(MortgageService);
    expect(service).toBeTruthy();
  });
});
