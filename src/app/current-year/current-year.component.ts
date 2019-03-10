import { SummaryService } from './../services/summary.service';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { YearFactory } from '../services/yearFactory.service';
import { Portfolio } from '../models/portfolio.model';
import { IdName } from '../models/idName.model';
import { RetireComponent } from '../retire/retire.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-current-year',
  templateUrl: './current-year.component.html',
  styleUrls: ['./current-year.component.css']
})
export class CurrentYearComponent implements OnInit {
  constructor(private summary: SummaryService, private dialog: MatDialog) { }
  initialValues: Portfolio;
  disable = true;
  income: number;
  strategy: string;
  risk = 'Aggressive';
  risks = ['Conservative', 'Cautious', 'Balanced', 'Assertive', 'Aggressive'];
  incomeTax: number;
  incomeTFSA: number;
  incomeRRSP: number;

  private retired = false;

  ngOnInit() {
    this.initialValues = this.summary.firstYear.portfolio;
    this.summary.thisYear = this.summary.firstYear;
    this.income = this.initialValues.income;
  }


  addYear() {
    if (this.retired) {
      const year = YearFactory.CreateYear(this.risk, this.income, this.summary.thisYear);
      year.portfolio.rrspValue = year.portfolio.rrspValue - this.incomeRRSP;
      year.portfolio.tfsaValue = year.portfolio.tfsaValue - this.incomeTFSA;
      year.portfolio.taxableValue = year.portfolio.taxableValue - this.incomeTax;
      this.initialValues = year.portfolio;
      this.summary.AddYear(year);
    } else {
      const year = YearFactory.CreateYear(this.risk, this.income, this.summary.thisYear);
      this.initialValues = year.portfolio;
      this.summary.AddYear(year);
    }
  }

  retire() {
    this.retired = true;
    this.summary.thisYear.rrsp.contribution = 0;
    this.summary.thisYear.tfsa.contribution = 0;
    this.summary.thisYear.taxable.contribution = 0;

    this.dialog.open(RetireComponent, {data: {
      age: this.initialValues.age,
      rrsp: this.initialValues.rrspValue,
      tfsa: this.initialValues.tfsaValue,
      taxable: this.initialValues.taxableValue,
    }});
  }
}
