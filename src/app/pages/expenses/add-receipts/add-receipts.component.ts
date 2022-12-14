import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-receipts',
  templateUrl: './add-receipts.component.html',
  styleUrls: ['./add-receipts.component.scss']
})
export class AddReceiptsComponent implements OnInit {
form:FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
