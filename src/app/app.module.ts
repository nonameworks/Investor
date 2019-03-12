import { MortgageService } from './services/mortgage.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatTableModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material';
import {MatStepperModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material';

import { AppComponent } from './app.component';
import { ContributionComponent } from './contribution/contribution.component';
import { InitialValuesComponent } from './initial-values/initial-values.component';
import { SummaryComponent } from './summary/summary.component';
import { CurrentYearComponent } from './current-year/current-year.component';
import { SummaryService } from './services/summary.service';
import { RetireComponent } from './retire/retire.component';
import { MortgageComponent } from './mortgage/mortgage.component';
import { MortgagePaymentComponent } from './mortgage-payment/mortgage-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    ContributionComponent,
    InitialValuesComponent,
    SummaryComponent,
    CurrentYearComponent,
    RetireComponent,
    MortgageComponent,
    MortgagePaymentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatExpansionModule,
    MatStepperModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  entryComponents: [
    RetireComponent
  ],
  providers: [
    SummaryService,
    RetireComponent,
    MortgageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
