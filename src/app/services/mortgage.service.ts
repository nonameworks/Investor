import { Contribution } from './../models/contribution.model';
import { Injectable } from '@angular/core';
import { Mortgage } from '../models/mortgage.model';
import { MortgageContract } from '../models/mortgage-contract.model';

@Injectable({
  providedIn: 'root'
})
export class MortgageService {
  currentMortgages: MortgageContract[];
  initialMortgages: MortgageContract[];

  constructor() {
    this.currentMortgages = [];
    this.initialMortgages = [{
      mortgage: {
        ammortization: 24,
        open: true,
        term: 5,
        rate: 3.1,
        principal: 126916.10,
        originalAmmortization: 30,
        originalTerm: 5,
        originalPrincipal: 150000,
        started: false
      },
      payment: {
        active: true,
        risk: 'Aggressive',
        contribution: 288,
        period: 'Bi-weekly'
      }
    }];
  }

  CopyInitialToCurrent(): any {
    for (const contract of this.initialMortgages) {
      const newContract = {
        mortgage: Object.create(contract.mortgage),
        payment: Object.create(contract.payment)
      };
      newContract.mortgage.originalAmmortization = newContract.mortgage.ammortization;
      newContract.mortgage.originalPrincipal = newContract.mortgage.principal;
      newContract.mortgage.originalTerm = newContract.mortgage.term;
      this.currentMortgages.push(newContract);
    }
  }

  AddYear() {
    const nextYear = [];
    for (const contract of this.currentMortgages) {
      const ret: MortgageContract = {
        mortgage: Object.create(contract.mortgage),
        payment: contract.payment
      };

      if (ret.mortgage.term === 1) {
        ret.mortgage.term = Math.min(ret.mortgage.originalTerm, ret.mortgage.ammortization);
        ret.mortgage.open = true;
      } else {
        if (ret.mortgage.open) {
          ret.mortgage.originalPrincipal = ret.mortgage.principal;
          ret.mortgage.originalTerm = ret.mortgage.term;
        }
        ret.mortgage.term = ret.mortgage.term - 1;
        ret.mortgage.open = false;
      }
      ret.mortgage.ammortization = ret.mortgage.ammortization - 1;
      ret.mortgage.principal = this.GetRemainingPrincipal(ret);
      ret.mortgage.started = true;
      nextYear.push(ret);
    }

    this.currentMortgages = nextYear;
  }

  GetRemainingPrincipal(contract: MortgageContract): number {
    const paymentsPerYear = this.GetPaymentsPerYear(contract.payment);
    let balance = contract.mortgage.principal;
    const requiredPayment = this.GetRequiredPayment(contract);
    const actualPayment = contract.payment.contribution;
    const difference = actualPayment - requiredPayment;
    for (let i = 0; i < paymentsPerYear; i++) {
      const interest = this.Interest(balance, contract.mortgage.rate, paymentsPerYear);
      balance = balance + interest - actualPayment - difference;
    }
    return Math.max(0, balance);
  }

  GetRequiredPayment(contract: MortgageContract): number {
    const N = 12;
    const r = contract.mortgage.rate / N / 100;
    const P = contract.mortgage.started ? contract.mortgage.originalPrincipal : contract.mortgage.principal;
    const rN = Math.pow(1 + r, N);
    const curPayment = r * P / (1 - Math.pow(1 + r, -contract.mortgage.originalAmmortization * N));
    const paymentsPerYear = this.GetPaymentsPerYear(contract.payment);
    return curPayment * N / paymentsPerYear;
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
    return balance * rate / paymentsPerYear / 100;
  }
}
