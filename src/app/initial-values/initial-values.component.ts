import { SummaryService } from './../services/summary.service';
import { Portfolio } from './../models/portfolio.model';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { Mortgage } from '../models/mortgage.model';
import { MortgageService } from '../services/mortgage.service';

@Component({
  selector: 'app-initial-values',
  templateUrl: './initial-values.component.html',
  styleUrls: ['./initial-values.component.css']
})
export class InitialValuesComponent implements OnInit {
  @Input()  model: Portfolio;
  @Input()  disable: boolean;
  constructor(private summary: SummaryService, private mortgageService: MortgageService) { }

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
        pension: 5667
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
      mortgageContribution: { active: this.mortgageService.initialMortgage.active, lump: 0, contribution: 280.688, period: 'Bi-weekly'}
    };

    this.mortgageService.currentMortgage = Object.create(this.mortgageService.initialMortgage);
    this.summary.AddFirstYear(firstYear);
    this.disable = true;
  }
}
