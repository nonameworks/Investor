import { YearFactory } from './yearFactory.service';
import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Year } from '../models/year.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  dataSource: MatTableDataSource<Year>;
  thisYear: Year;
  firstYearAdded = new EventEmitter();

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  AddYear(year: Year): any {
    if (!this.thisYear) {
      this.firstYearAdded.emit();
    }

    this.thisYear = year;
    const allYears = this.dataSource.data;
    allYears.push(year);
    this.dataSource.data = allYears;
  }
}
