import { SummaryService } from './../services/summary.service';
import { Component, OnInit } from '@angular/core';
import { Year } from '../models/year.model';
import { YearFactory } from '../services/yearFactory.service';

@Component({
  selector: 'app-current-year',
  templateUrl: './current-year.component.html',
  styleUrls: ['./current-year.component.css']
})
export class CurrentYearComponent implements OnInit {
  constructor(private summary: SummaryService) { }

  ngOnInit() {
  }


  addYear() {
    const year = YearFactory.CreateYear('Aggressive', this.summary.thisYear);
    this.summary.AddYear(year);
  }
}
