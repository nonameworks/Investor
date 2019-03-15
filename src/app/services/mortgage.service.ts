import { Contribution } from './../models/contribution.model';
import { Injectable } from '@angular/core';
import { Mortgage } from '../models/mortgage.model';
import { MortgageContract } from '../models/mortgage-contract.model';

@Injectable({
  providedIn: 'root'
})
export class MortgageService {
  mortgages: MortgageContract[] = [];
  nextID = 0;

  constructor() {  }

  addMortgage() {
    this.mortgages.push({
      id: this.nextID,
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
    });
    this.nextID = this.nextID + 1;
  }

  removeMortgage(contract: MortgageContract) {
    const newMortgages = this.mortgages.filter(x => x !== contract);
    this.mortgages = newMortgages;
  }

  AddYear() {
    const nextYear = [];
    for (const contract of this.mortgages) {
      const ret: MortgageContract = {
        id: contract.id,
        mortgage: Object.create(contract.mortgage),
        payment: contract.payment
      };

      if (ret.mortgage.term === 1) {
        ret.mortgage.term = Math.min(ret.mortgage.originalTerm, ret.mortgage.ammortization);
        ret.mortgage.open = true;
      } else {
        if (ret.mortgage.open) {
          this.setOriginals(ret.mortgage);
        }
        ret.mortgage.term = ret.mortgage.term - 1;
        ret.mortgage.open = false;
      }
      ret.mortgage.ammortization = ret.mortgage.ammortization - 1;
      ret.mortgage.principal = this.GetRemainingPrincipal(ret);
      ret.mortgage.started = true;

      if (ret.mortgage.ammortization > 0 && ret.mortgage.principal > 0) {
        nextYear.push(ret);
      }
    }

    this.mortgages = nextYear;
  }

  setOriginals(model: Mortgage): any {
    model.originalPrincipal = model.principal;
    model.originalAmmortization = model.ammortization;
    model.originalTerm = model.term;
  }

  GetRemainingPrincipal(contract: MortgageContract): number {
    const paymentsPerYear = this.GetPaymentsPerYear(contract.payment);
    let balance = contract.mortgage.principal;
    const requiredPayment = this.GetRequiredPayment(contract);
    const actualPayment = contract.payment.contribution;
    const difference = Math.round(actualPayment - requiredPayment);
    for (let i = 0; i < paymentsPerYear; i++) {
      const interest = this.Interest(balance, contract.mortgage.rate, paymentsPerYear);
      balance = balance + interest - actualPayment - difference;
    }
    return Math.max(0, Math.round(balance * 100) / 100);
  }

  GetRequiredPayment(contract: MortgageContract): number {
    const N = 12;
    const r = contract.mortgage.rate / N / 100;
    const P = contract.mortgage.started ? contract.mortgage.originalPrincipal : contract.mortgage.principal;
    const rN = Math.pow(1 + r, N);
    const curPayment = r * P / (1 - Math.pow(1 + r, -contract.mortgage.originalAmmortization * N));
    const paymentsPerYear = this.GetPaymentsPerYear(contract.payment);
    return Math.round(curPayment * N / paymentsPerYear * 100) / 100;
  }

  GetPaymentsPerYear(payment: Contribution): number {
    let paymentsPerYear = 1;
    switch (payment.period) {
      case 'Monthly': paymentsPerYear = 12; break;
      case 'Semi-monthly': paymentsPerYear = 24; break;
      case 'Bi-weekly': paymentsPerYear = 26; break;
      case 'Weekly': paymentsPerYear = 52; break;
    }

    return paymentsPerYear;
  }

  Interest(balance: number, rate: number, paymentsPerYear: number): number {
    return Math.round(balance * rate / paymentsPerYear) / 100;
  }
}
