import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-attendence',
  templateUrl: './view-attendence.component.html',
  styleUrls: ['./view-attendence.component.scss']
})
export class ViewAttendenceComponent implements OnInit {
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
