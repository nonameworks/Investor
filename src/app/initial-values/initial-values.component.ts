import { SummaryService } from './../services/summary.service';
import { Portfolio } from './../models/portfolio.model';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { Mortgage } from '../models/mortgage.model';
import { MortgageService } from '../services/mortgage.service';
import { MortgageContract } from '../models/mortgage-contract.model';

@Component({
  selector: 'app-initial-values',
  templateUrl: './initial-values.component.html',
  styleUrls: ['./initial-values.component.css']
})
export class InitialValuesComponent implements OnInit {
  @Input() model: Portfolio;
  @Input() disable: boolean;
  @Input() mortgages: MortgageContract[];

  constructor(private summary: SummaryService, private mortgageService: MortgageService) { }

  ngOnInit() {
    if (this.model == null) {
      this.model = {
        age: 30,
        rrspRoom: 57500,
        rrspValue: 100000,
        taxableValue: 0,
        tfsaRoom: 12000,
        tfsaValue: 60000,
        income: 85000,
        taxableContributions: 0
      };
    }
  }

  addFirstYear() {
    const firstYear: Year = {
      age: this.model.age,
      ret: 0,
      portfolio: this.model,
      tfsa: { active: true, risk: 'Aggressive', lump: 0, contribution: 621.18, period: 'Bi-weekly' },
      rrsp: { active: true,  risk: 'Aggressive', lump: 3500, contribution: 185.42, period: 'Bi-weekly' },
      taxable: { active: true,  risk: 'Aggressive', lump: 0, contribution: 0, period: null }
    };

    this.summary.AddFirstYear(firstYear);
    this.disable = true;
  }

  RemoveMortgage(mortgage: MortgageContract) {
    const index = this.mortgages.indexOf(mortgage, 0);
    if (index > -1) {
      this.mortgages.splice(index, 1);
    }
  }
}
