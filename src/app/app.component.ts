import { Component } from '@angular/core';


export interface idName {
  id: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'investor';
  riskProfile: idName[] = [
    {id: 'conservative', name: 'Conservative'},
    {id: 'cautious', name: 'Cautious'},
    {id: 'balanced', name: 'Balanced'},
    {id: 'assertive', name: 'Assertive'},
    {id: 'aggressive', name: 'Aggressive'}
  ];
  selectedCategory: string

  
}
