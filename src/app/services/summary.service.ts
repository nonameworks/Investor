import { MortgageService } from './mortgage.service';
import { YearFactory } from './yearFactory.service';
import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Year } from '../models/year.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  dataSource: MatTableDataSource<Year>;
  firstYear: Year;
  thisYear: Year;
  firstYearAdded = new EventEmitter<Year>();

  constructor(private mortgage: MortgageService) {
    this.dataSource = new MatTableDataSource();
  }

  AddFirstYear(year: Year) {
    this.firstYearAdded.emit(year);
    this.dataSource = new MatTableDataSource([year]);
    this.firstYear = year;
  }

  AddYear(year: Year) {
    this.mortgage.AddYear();
    this.thisYear = year;
    const allYears = this.dataSource.data;
    allYears.push(year);
    this.dataSource.data = allYears;
  }
}
