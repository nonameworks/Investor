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
  mortgage = true;
  constructor(private summary: SummaryService) { }

  ngOnInit() {
    this.model = {
      age: 32,
      rrspRoom: 57464,
      rrspValue: 102577.18,
      taxableValue: 0,
      tfsaRoom: 12015.75,
      tfsaValue: 58831.56,
      income: 92000,
      mortgage: {
        ammortization: 26,
        term: 1,
        principal: 132000,
        rate: 3.1
      }
    };
  }

  addFirstYear() {
    const firstYear: Year = {
      age: this.model.age,
      ret: 0,
      portfolio: this.model,
      tfsa: { lump: 0, contribution: 621.18, period: 'Bi-weekly'},
      rrsp: { lump: 0, contribution: 185.42, period: 'Bi-weekly'},
      taxable: { lump: 0, contribution: 0, period: null},
      mortgage: { lump: 0, contribution: 505, period: 'Bi-weekly'}
    };

    this.summary.AddFirstYear(firstYear);
    this.disable = true;
  }
}
