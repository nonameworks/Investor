import { Component, OnInit, Input } from '@angular/core';
import { Contribution } from '../models/contribution.model';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.css']
})
export class ContributionComponent {
  periods = ['Annually', 'Monthly', 'Semi-monthly', 'Bi-weekly', 'Weekly'];
  risk = 'Aggressive';
  risks = ['Conservative', 'Cautious', 'Balanced', 'Assertive', 'Aggressive'];
  @Input() model: Contribution;
  @Input() account: string;

  constructor() { }
}
