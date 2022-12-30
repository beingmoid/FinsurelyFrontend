import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-vacations',
  templateUrl: './view-vacations.component.html',
  styleUrls: ['./view-vacations.component.scss']
})
export class ViewVacationsComponent implements OnInit {
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
