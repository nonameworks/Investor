import { Contribution } from './../models/contribution.model';
import { Injectable } from '@angular/core';
import { Mortgage } from '../models/mortgage.model';

@Injectable({
  providedIn: 'root'
})
export class MortgageService {
  currentMortgage: Mortgage;
  initialMortgage: Mortgage;
  payment: Contribution;

  constructor() {
    this.initialMortgage = {
      active: true,
      ammortization: 24,
      term: 5,
      rate: 2.7,
      principal: 126916.10,
      originalAmmortization: 30,
      originalTerm: 5,
      originalPrincipal: 150000
    };

    this.payment = {
      active: true,
      lump: null,
      contribution: 288,
      period: 'Bi-weekly'
    };
  }

  AddYear(): Mortgage {
    const mortgage = this.currentMortgage;
    const ret: Mortgage = {
      active: mortgage.ammortization > 1,
      term: mortgage.term === 1 ? mortgage.originalTerm : mortgage.term - 1,
      ammortization: mortgage.ammortization - 1,
      originalAmmortization: mortgage.originalAmmortization,
      originalTerm: mortgage.originalTerm,
      rate: mortgage.rate,
      originalPrincipal: mortgage.originalPrincipal,
      principal: this.GetRemainingPrincipal()
    };

    return ret;
  }

  GetRemainingPrincipal(): number {
    const paymentsPerYear = this.GetPaymentsPerYear();
    let balance = this.currentMortgage.principal;
    const requiredPayment = this.GetRequiredPayment();
    const actualPayment = this.payment.contribution;
    const difference = actualPayment - requiredPayment;
    for (let i = 0; i < paymentsPerYear; i++) {
      balance = this.Interest(balance, this.currentMortgage.rate) - actualPayment - difference;
    }
    return Math.max(0, Math.round(balance));
  }

  GetRequiredPayment(): number {
    const paymentsPerYear = this.GetPaymentsPerYear();
    const mortgage = this.currentMortgage;
    const r = mortgage.rate / paymentsPerYear / 100;
    const numberOfPayments = mortgage.originalAmmortization * paymentsPerYear;
    const rN = Math.pow(1 + r, numberOfPayments);
    const curPayment = r * rN * mortgage.principal / (rN - 1);
    return curPayment;
  }

  GetPaymentsPerYear(): number {
    let paymentsPerYear = 1;
    switch (this.payment.period) {
      case 'Monthly': paymentsPerYear = 12; break;
      case 'Semi-monthly': paymentsPerYear = 24; break;
      case 'Bi-weekly': paymentsPerYear = 26; break;
      case 'Weekly': paymentsPerYear = 52; break;
    }

    return paymentsPerYear;
  }

  Interest(balance: number, rate: number): number {
    return balance + balance * rate / 100;
  }
}
