import { SummaryService } from './../services/summary.service';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { YearFactory } from '../services/yearFactory.service';
import { Portfolio } from '../models/portfolio.model';
import { IdName } from '../models/idName.model';

@Component({
  selector: 'app-current-year',
  templateUrl: './current-year.component.html',
  styleUrls: ['./current-year.component.css']
})
export class CurrentYearComponent implements OnInit {
  constructor(private summary: SummaryService) { }
  initialValues: Portfolio;
  disable = true;
  income: number;
  strategy: string;
  risk = 'Aggressive';

  risks = ['Conservative', 'Cautious', 'Balanced', 'Assertive', 'Aggressive'];

  ngOnInit() {
    this.initialValues = this.summary.firstYear.portfolio;
    this.summary.thisYear = this.summary.firstYear;
    this.income = this.initialValues.income;
  }


  addYear() {
    const year = YearFactory.CreateYear('Aggressive', this.income, this.summary.thisYear);
    this.initialValues = year.portfolio;
    this.summary.AddYear(year);
  }
}
