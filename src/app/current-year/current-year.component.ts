import { Mortgage } from './../models/mortgage.model';
import { SummaryService } from './../services/summary.service';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { YearFactory } from '../services/yearFactory.service';
import { Portfolio } from '../models/portfolio.model';
import { IdName } from '../models/idName.model';
import { RetireComponent } from '../retire/retire.component';
import { MatDialog } from '@angular/material';
import { MortgageFactory } from '../services/mortgageFactory.service';

@Component({
  selector: 'app-current-year',
  templateUrl: './current-year.component.html',
  styleUrls: ['./current-year.component.css']
})
export class CurrentYearComponent implements OnInit {
  constructor(private summary: SummaryService, private dialog: MatDialog) { }
  initialValues: Portfolio;
  newMortgage: Mortgage;
  disable = true;
  income: number;
  strategy: string;
  risk = 'Aggressive';
  risks = ['Conservative', 'Cautious', 'Balanced', 'Assertive', 'Aggressive'];
  incomeTax: number;
  incomeTFSA: number;
  incomeRRSP: number;
  get showNewMortgage() {
    const ret = this.newMortgage.ammortization > 1
      && ((this.summary.thisYear.mortgage.active && !this.initialValues.mortgage.active)
        || (this.initialValues.mortgage.active && this.initialValues.mortgage.term === 1));
    return ret;
  }
  private retired = false;

  ngOnInit() {
    this.initialValues = this.summary.firstYear.portfolio;
    this.newMortgage = MortgageFactory.CreateMortgage(this.initialValues.mortgage);
    this.summary.thisYear = this.summary.firstYear;
    this.income = this.initialValues.income;
  }


  addYear() {
    const year = YearFactory.CreateYear(this.risk, this.income, this.summary.thisYear, this.newMortgage);
    this.retirementAdjustments(year);
    this.initialValues = year.portfolio;
    this.newMortgage = MortgageFactory.CreateMortgage(year.portfolio.mortgage);
    this.calculateRetirementIncome(year);
    this.summary.AddYear(year);
  }

  private calculateRetirementIncome(year: Year) {
    if (!this.retired) {
      return;
    }

    year.portfolio.income = (this.incomeRRSP || 0) + (this.incomeTFSA || 0) + (this.incomeTax || 0);
    if (year.portfolio.age >= 65) {
      year.portfolio.income = year.portfolio.income + 15000;
    }
  }

  private retirementAdjustments(year: Year) {
    if (!this.retired) {
      return;
    }

    if (year.portfolio.tfsaValue <= 0) {
      this.incomeTFSA = 0;
    } else if (this.incomeTFSA > year.portfolio.tfsaValue) {
      alert('TFSA withdrawal is higher than available value');
      return;
    }

    if (year.portfolio.rrspValue <= 0) {
      this.incomeRRSP = 0;
    } else if (this.incomeRRSP > year.portfolio.rrspValue) {
      alert('RRSP withdrawal is higher than available value');
      return;
    }

    if (year.portfolio.taxableValue <= 0) {
      this.incomeTax = 0;
    } else if (this.incomeTax > year.portfolio.taxableValue) {
      alert('Taxable withdrawal is higher than available value');
      return;
    }

    year.portfolio.rrspValue = year.portfolio.rrspValue - (this.incomeRRSP || 0);
    year.portfolio.tfsaValue = year.portfolio.tfsaValue - (this.incomeTFSA || 0);
    if (year.portfolio.rrspValue > 0 && year.portfolio.tfsaValue < 0) {
      year.portfolio.rrspValue = year.portfolio.rrspValue + year.portfolio.tfsaValue;
      year.portfolio.tfsaValue = 0;
    } else if (year.portfolio.tfsaValue > 0 && year.portfolio.rrspValue < 0) {
      year.portfolio.tfsaValue = year.portfolio.tfsaValue + year.portfolio.rrspValue;
      year.portfolio.rrspValue = 0;
    }
    year.portfolio.taxableValue = year.portfolio.taxableValue - (this.incomeTax || 0);
  }

  retire() {
    this.retired = true;
    this.summary.thisYear.rrsp.contribution = 0;
    this.summary.thisYear.tfsa.contribution = 0;
    this.summary.thisYear.taxable.contribution = 0;

    this.dialog.open(RetireComponent, {
      data: {
        age: this.initialValues.age,
        rrsp: this.initialValues.rrspValue,
        tfsa: this.initialValues.tfsaValue,
        taxable: this.initialValues.taxableValue,
      }
    });
  }
}
