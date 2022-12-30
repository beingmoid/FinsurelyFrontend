import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-loans',
  templateUrl: './view-loans.component.html',
  styleUrls: ['./view-loans.component.scss']
})
export class ViewLoansComponent implements OnInit {
  isVisible = false;
  isEditMode = false;

  constructor() { }

  ngOnInit(): void {
  }


  openModal() {
    this.isVisible = true;
    this.isEditMode= false;
  }
  closeModal() {
    this.isVisible = false;
  }
}
