import { MortgageContract } from './../models/mortgage-contract.model';
import { MortgageService } from './mortgage.service';
import { YearFactory } from './yearFactory.service';
import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Year } from '../models/year.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  dataSource: MatTableDataSource<YearSummary>;
  firstYear: Year;
  thisYear: Year;
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

  constructor(private mortgage: MortgageService) {
    this.dataSource = new MatTableDataSource();
  }

  AddFirstYear(year: Year) {
    this.firstYearAdded.emit(year);
    this.dataSource = new MatTableDataSource([this.CreateYearSummary(year, [])]);
    this.firstYear = year;
  }

  AddYear(year: Year) {
    const newMortgages = this.mortgage.mortgages.filter(x => x.mortgage.started === false);
    this.mortgage.AddYear();
    this.thisYear = year;
    const allYears = this.dataSource.data;
    const mortgages = this.CreateMortgages(newMortgages);
    allYears.push(this.CreateYearSummary(year, mortgages));
    this.dataSource.data = allYears;
  }

  CreateMortgages(newMortgages: MortgageContract[]): any {
    this.mortgageCount = this.mortgageCount + newMortgages.length;
    for (let i = 0; i < newMortgages.length; i++) {
      const columnIndex = this.displayedColumns.length - 5;
      this.displayedColumns.push('mortgage' + columnIndex);
    }

    const mortgages = [];
    for (let i = 0; i < this.mortgageCount; i++) {
      const match = this.mortgage.mortgages.filter(x => x.id === i);
      mortgages.push(match.length === 0 ? '' : match[0].mortgage.principal);
    }
    return mortgages;
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
