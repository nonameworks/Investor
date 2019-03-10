import { SummaryService } from './../services/summary.service';
import { Portfolio } from './../models/portfolio.model';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { Mortgage } from '../models/mortgage.model';

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
    if (this.model == null) {
      this.model = {
        age: 32,
        rrspRoom: 57464,
        rrspValue: 102578,
        taxableValue: 0,
        tfsaRoom: 12016,
        tfsaValue: 58832,
        income: 134000,
        pension: 5667,
        mortgage: {
          active: true,
          ammortization: 26,
          term: 1,
          rate: 3.1,
          principal: 132000,
          originalAmmortization: 30,
          originalTerm: 5
        }
      };
    }
  }

  addFirstYear() {
    const firstYear: Year = {
      age: this.model.age,
      ret: 0,
      portfolio: this.model,
      tfsa: { active: true, lump: 0, contribution: 621.18, period: 'Bi-weekly'},
      rrsp: { active: true, lump: 3500, contribution: 185.42, period: 'Bi-weekly'},
      taxable: { active: false, lump: 0, contribution: 0, period: null},
      mortgage: { active: this.model.mortgage.active, lump: 0, contribution: 505, period: 'Bi-weekly'}
    };

    this.summary.AddFirstYear(firstYear);
    this.disable = true;
  }
}
