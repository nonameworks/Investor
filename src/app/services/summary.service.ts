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

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  AddYear(year: Year): any {
    this.thisYear = year;
    const allYears = this.dataSource.data;
    allYears.push(year);
    this.dataSource.data = allYears;
  }
}
