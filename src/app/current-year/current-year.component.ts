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
  @Input() initialValues: Portfolio;
  disable = true;

  strategy: string;
  risk: string;

  risks = ['Conservative', 'Cautious', 'Balanced', 'Assertive', 'Aggressive'];

  ngOnInit() {
  }


  addYear() {
    const year = YearFactory.CreateYear('Aggressive', this.summary.thisYear);
    this.summary.AddYear(year);
  }
}
