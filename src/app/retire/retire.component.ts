import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Retire } from '../models/retire.model';

@Component({
  selector: 'app-retire',
  templateUrl: './retire.component.html',
  styleUrls: ['./retire.component.css']
})
export class RetireComponent implements OnInit {
  oas: number;
  cpp: number;
  taxableIncome: number;
  lifeExpectancy: number;
  taxedIncome: number;
  totalIncome: number;

  constructor(
    public dialogRef: MatDialogRef<RetireComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

}
