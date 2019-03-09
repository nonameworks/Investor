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
  disable = false;

  constructor(private summary: SummaryService) { }

  ngOnInit() {
    this.model = {
      age: 32,
      rrspRoom: 65000,
      rrspValue: 100000,
      taxableValue: 0,
      tfsaRoom: 12000,
      tfsaValue: 40000
    };
  }

  addFirstYear() {
    const firstYear: Year = {
      age: this.model.age,
      portfolio: this.model,
      tfsa: {contribution: 450, period: 'Bi-weekly'},
      rrsp: {contribution: 0, period: 'Bi-weekly'},
      taxable: {contribution: 0, period: null},
    };

    this.summary.AddYear(firstYear);
    this.disable = true;
  }
}
