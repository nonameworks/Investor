import { CurrentYearComponent } from './current-year/current-year.component';
import { SummaryService } from './services/summary.service';
import { Portfolio } from './models/portfolio.model';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

import { IdName } from './models/idName.model';
import { Year } from './models/year.model';
import { YearFactory } from './services/yearFactory.service';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'investor';
  initialExpanded = true;
  currentExpanded = false;

  constructor(private summary: SummaryService) {}

  ngOnInit() {
    this.summary.firstYearAdded.subscribe((year: Year) => {
      this.initialExpanded = false;
      this.currentExpanded = true;
    });
  }
}
