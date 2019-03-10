import { SummaryService } from './../services/summary.service';
import { Portfolio } from './../models/portfolio.model';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';

@Component({
  selector: 'app-initial-values',
  templateUrl: './initial-values.component.html',
  styleUrls: ['./initial-values.component.css']
})
export class InitialValuesComponent implements OnInit {
  @Input()  model: Portfolio;
  @Input()  disable: boolean;
  constructor(private summary: SummaryService) { }

  ngOnInit() {
    this.model = {
      age: 32,
      rrspRoom: 57464,
      rrspValue: 102577.18,
      taxableValue: 0,
      tfsaRoom: 12015.75,
      tfsaValue: 58831.56,
      income: 92000
    };
  }

  addFirstYear() {
    const firstYear: Year = {
      age: this.model.age,
      ret: 0,
      portfolio: this.model,
      tfsa: {contribution: 621.18, period: 'Bi-weekly'},
      rrsp: {contribution: 185.42, period: 'Bi-weekly'},
      taxable: {contribution: 0, period: null},
    };

    this.summary.AddFirstYear(firstYear);
    this.disable = true;
  }
}
