import { SummaryService } from './services/summary.service';
import { Portfolio } from './models/portfolio.model';
import { Contribution } from './models/contribution.model';
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

  constructor(private summary: SummaryService) {}

  ngOnInit() {
  }
}
