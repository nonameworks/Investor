import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule, MatButtonModule, MatInputModule, MatTableModule} from '@angular/material';

import { AppComponent } from './app.component';
import { ContributionComponent } from './contribution/contribution.component';

@NgModule({
  declarations: [
    AppComponent,
    ContributionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
