import { MortgageContract } from './../models/mortgage-contract.model';
import { MortgageService } from './../services/mortgage.service';
import { Mortgage } from './../models/mortgage.model';
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
  constructor(private summary: SummaryService, public mortgageService: MortgageService, private dialog: MatDialog) { }
  initialValues: Portfolio;
  strategy: string;
  incomeTax = 0;
  incomeTFSA = 0;
  incomeRRSP = 0;
  pension = 0;
  cppAndOas = 0;
  otherSavings = 0;
  calculatedPayment: number;

  ngOnInit() {
    this.initialValues = this.summary.firstYear.portfolio;
    this.summary.thisYear = this.summary.firstYear;
  }

  addYear() {
    const year = YearFactory.CreateYear(this.summary.thisYear);
    this.retirementAdjustments(year);
    this.initialValues = Object.create(year.portfolio);
    this.calculateRetirementIncome(year);
    this.summary.AddYear(year);
  }

  private calculateRetirementIncome(year: Year) {
    if (!this.summary.retired) {
      return;
    }

    year.portfolio.income = (this.incomeRRSP || 0) + (this.incomeTFSA || 0) + (this.incomeTax || 0);
    if (year.portfolio.age >= 65) {
      year.portfolio.income = year.portfolio.income + 15000;
    }
  }

  private retirementAdjustments(year: Year) {
    if (!this.summary.retired) {
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
    year.portfolio.taxableContributions = year.portfolio.taxableContributions - (this.incomeTax || 0);
  }

  calculatePayments() {
    const remainingYears = 95 - this.summary.thisYear.age;
    this.incomeTax = Math.round(this.summary.thisYear.portfolio.taxableValue / remainingYears * 100) / 100;
    this.incomeRRSP = Math.round(this.summary.thisYear.portfolio.rrspValue / remainingYears * 100) / 100;
    this.incomeTFSA = Math.round(this.summary.thisYear.portfolio.tfsaValue / remainingYears * 100) / 100;
  }

  retire() {
    this.summary.retired = true;
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
