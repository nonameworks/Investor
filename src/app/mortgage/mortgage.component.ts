import { Component, OnInit, Input } from '@angular/core';
import { Mortgage } from '../models/mortgage.model';

@Component({
  selector: 'app-mortgage',
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.css']
})
export class MortgageComponent implements OnInit {
  @Input()  model: Mortgage;
  @Input() disable: boolean;
  constructor() { }

  ngOnInit() {
  }

}
