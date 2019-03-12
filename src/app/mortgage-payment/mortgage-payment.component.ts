import { MortgageService } from './../services/mortgage.service';
import { Component, OnInit, Input } from '@angular/core';
import { Contribution } from '../models/contribution.model';

@Component({
  selector: 'app-mortgage-payment',
  templateUrl: './mortgage-payment.component.html',
  styleUrls: ['./mortgage-payment.component.css']
})
export class MortgagePaymentComponent {
  private contribution: number;
  periods = ['Annually', 'Monthly', 'Semi-monthly', 'Bi-weekly', 'Weekly'];

  CalculatePayment() {
      this.mortgageService.payment.contribution = Math.round(this.mortgageService.GetRequiredPayment());
  }


  constructor(private mortgageService: MortgageService) { }
}
