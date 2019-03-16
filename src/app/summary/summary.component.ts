import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Input } from '@angular/core';
import { Year } from '../models/year.model';
import { SummaryService } from '../services/summary.service';


export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  constructor(public summary: SummaryService) { }

  ngOnInit() {
  }
}
