import { MortgageContract } from './../models/mortgage-contract.model';
import { MortgageService } from './mortgage.service';
import { YearFactory } from './yearFactory.service';
import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Year } from '../models/year.model';
import { ContributionService } from './contribution.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  dataSource: MatTableDataSource<YearSummary>;
  firstYear: Year;
  thisYear: Year;
  averageReturn = 0;
  netIncome = 0;
  retirementIncome = 0;

  displayedColumns: string[] = ['age', 'ret', 'rrsp', 'tfsa', 'taxable'];
  private mortgageCount = 0;

  firstYearAdded = new EventEmitter<Year>();

  columns = [
    { columnDef: 'age', header: 'Age',    cell: (element: YearSummary) => `${element.age}` },
    { columnDef: 'ret', header: 'Return',    cell: (element: YearSummary) => `${element.ret}` },
    { columnDef: 'rrsp', header: 'RRSP',    cell: (element: YearSummary) => `${element.rrsp}` },
    { columnDef: 'tfsa', header: 'TFSA',    cell: (element: YearSummary) => `${element.tfsa}` },
    { columnDef: 'taxable', header: 'Taxable',    cell: (element: YearSummary) => `${element.taxable}` },
    { columnDef: 'mortgage0', header: 'Mortgage 1',    cell: (element: YearSummary) => `${element.mortgages[0] || ''}` },
    { columnDef: 'mortgage1', header: 'Mortgage 2',    cell: (element: YearSummary) => `${element.mortgages[1] || ''}` },
    { columnDef: 'mortgage2', header: 'Mortgage 3',    cell: (element: YearSummary) => `${element.mortgages[2] || ''}` },
    { columnDef: 'mortgage3', header: 'Mortgage 4',    cell: (element: YearSummary) => `${element.mortgages[3] || ''}` },
    { columnDef: 'mortgage4', header: 'Mortgage 5',    cell: (element: YearSummary) => `${element.mortgages[4] || ''}` },
    { columnDef: 'mortgage5', header: 'Mortgage 6',    cell: (element: YearSummary) => `${element.mortgages[5] || ''}` },
    { columnDef: 'mortgage6', header: 'Mortgage 7',    cell: (element: YearSummary) => `${element.mortgages[6] || ''}` },
  ];
  retired: any;

  constructor(private mortgage: MortgageService) {
    this.dataSource = new MatTableDataSource();
  }


  SetNetIncome() {
    const rrsp = ContributionService.GetTotal(this.thisYear.rrsp);
    const taxableIncome = this.thisYear.portfolio.income - rrsp;
    const tax = this.CalculateTax(taxableIncome);
    const tfsa = ContributionService.GetTotal(this.thisYear.tfsa);
    const taxable = ContributionService.GetTotal(this.thisYear.taxable);
    const mortgagePayments = this.mortgage.mortgages.map(x => x.payment);
    let sum = rrsp + tfsa + taxable;
    for (const payment of mortgagePayments) {
      sum += ContributionService.GetTotal(payment);
    }
    this.netIncome = Math.round((this.thisYear.portfolio.income - sum - tax) * 100) / 100;

    const remainingYears = 95 - this.thisYear.age;
    const rrspIncome = this.thisYear.portfolio.rrspValue / remainingYears;
    const totalWithdrawals = ContributionService.GetTotalValue(this.thisYear.portfolio) / remainingYears;
    if (this.thisYear.age >= 65) {
      const capitalGains = (this.thisYear.portfolio.taxableValue - this.thisYear.portfolio.taxableContributions) / remainingYears;
      const clawback = (rrspIncome - capitalGains - 75910) * .15;
      const oas = 7217.4;
      const cpp = 11115.84;
      this.retirementIncome =  totalWithdrawals + oas + cpp - clawback;
    } else {
      this.retirementIncome = totalWithdrawals;
    }

    this.retirementIncome = Math.round(this.retirementIncome * 100) / 100;
  }

  CalculateTax(taxableIncome: number): number {
    const taxes = [];
    taxes.push(Math.max(Math.min(taxableIncome, 43905), 0) * 0.2005);
    taxes.push(Math.max(Math.min(taxableIncome, 47629) - 43905, 0) * .2415);
    taxes.push(Math.max(Math.min(taxableIncome, 77312) - 47629, 0) * .2965);
    taxes.push(Math.max(Math.min(taxableIncome, 87812) - 77312, 0) * .3148);
    taxes.push(Math.max(Math.min(taxableIncome, 91100) - 87812, 0) * .3389);
    taxes.push(Math.max(Math.min(taxableIncome, 95258) - 91100, 0) * .3791);
    taxes.push(Math.max(Math.min(taxableIncome, 147666) - 95258, 0) * .4341);
    taxes.push(Math.max(Math.min(taxableIncome, 150000) - 147666, 0) * .4641);
    taxes.push(Math.max(Math.min(taxableIncome, 210370) - 150000, 0) * .4797);
    taxes.push(Math.max(Math.min(taxableIncome, 220000) - 210370, 0) * .5197);
    taxes.push(Math.max(taxableIncome - 220000, 0) * .5353);
    let sum = 0;
    for (const tax of taxes) {
      sum += tax;
    }
    return sum;
  }

  AddFirstYear(year: Year) {
    this.firstYearAdded.emit(year);
    this.dataSource = new MatTableDataSource([this.CreateYearSummary(year, [])]);
    this.firstYear = year;
  }

  AddYear(year: Year) {
    const newMortgages = this.mortgage.mortgages.filter(x => x.mortgage.started === false);
    this.mortgage.AddYear();
    const allYears = this.dataSource.data;
    const mortgages = this.CreateMortgages(newMortgages);
    const lastYear = this.dataSource.data[allYears.length - 1];
    lastYear.mortgages = lastYear.mortgages.concat(Array.from(mortgages[1].values()));
    allYears.push(this.CreateYearSummary(year, mortgages[0]));
    this.dataSource.data = allYears;
    this.thisYear = year;
    this.SetAverage();
    this.SetNetIncome();
  }

  SetAverage() {
    let sum = 0;
    for (let i = 0, l = this.dataSource.data.length; i < l; i++) {
      sum += this.dataSource.data[i].ret;
    }
    this.averageReturn = Math.round(sum / this.dataSource.data.length * 100) / 100;
  }

  CreateMortgages(contracts: MortgageContract[]): any {
    this.mortgageCount = this.mortgageCount + contracts.length;
    const firstYearMortgages = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < contracts.length; i++) {
      const columnIndex = this.displayedColumns.length - 5;
      this.displayedColumns.push('mortgage' + columnIndex);
      firstYearMortgages.push(contracts[i].mortgage.originalPrincipal);
    }

    const mortgages = [];
    for (let i = 0; i < this.mortgageCount; i++) {
      const match = this.mortgage.mortgages.filter(x => x.id === i);
      mortgages.push(match.length === 0 ? '' : match[0].mortgage.principal);
    }
    return [mortgages, firstYearMortgages];
  }

  CreateYearSummary(year: Year, newMortgages: string[]): YearSummary {
    return {
      age: year.age,
      ret: year.ret,
      rrsp: year.portfolio.rrspValue,
      tfsa: year.portfolio.tfsaValue,
      taxable: year.portfolio.taxableValue,
      mortgages: newMortgages
    };
  }
}

export interface YearSummary {
  age: number;
  ret: number;
  rrsp: number;
  tfsa: number;
  taxable: number;
  mortgages: string[];
}
