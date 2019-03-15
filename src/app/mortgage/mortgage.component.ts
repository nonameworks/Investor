import { Component, OnInit, Input } from '@angular/core';
import { MortgageContract } from '../models/mortgage-contract.model';
import { MortgageService } from '../services/mortgage.service';

@Component({
  selector: 'app-mortgage',
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.css']
})
export class MortgageComponent implements OnInit {
  @Input() model: MortgageContract;
  disable: boolean;
  periods = ['Annually', 'Monthly', 'Semi-monthly', 'Bi-weekly', 'Weekly'];

  constructor(private mortgageService: MortgageService) { }

  ngOnInit() {
    this.disable = false;
  }

  CalculatePayment() {
    if (!this.model.mortgage.started) {
      this.mortgageService.setOriginals(this.model.mortgage);
    }
    this.model.payment.contribution = this.mortgageService.GetRequiredPayment(this.model);
  }
}
