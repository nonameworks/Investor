import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule, MatButtonModule, MatInputModule, MatTableModule, MatExpansionModule, MatStepperModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ContributionComponent } from './contribution/contribution.component';
import { InitialValuesComponent } from './initial-values/initial-values.component';
import { SummaryComponent } from './summary/summary.component';
import { CurrentYearComponent } from './current-year/current-year.component';
import { SummaryService } from './services/summary.service';

@NgModule({
  declarations: [
    AppComponent,
    ContributionComponent,
    InitialValuesComponent,
    SummaryComponent,
    CurrentYearComponent
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
    MatStepperModule
  ],
  providers: [
    SummaryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
